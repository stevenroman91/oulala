import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { closestRate, DAILY_GOAL, SPEECH_RATES, useProfile } from '../state/ProfileContext'
import { getCurriculum, LEVELS, type Lesson } from '../data/curriculum'
import { costumeById, journeyStops, type Stop } from '../data/france'
import { FranceMap, type MapStop } from '../components/FranceMap'
import { dueCount } from '../data/review'
import { speak } from '../services/audio'
import { playFanfare } from '../services/audio'

function Stat({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div
      className="card"
      style={{ padding: '10px 14px', flex: 1, textAlign: 'center', borderRadius: 20 }}
    >
      <div style={{ fontSize: '1.4rem' }}>{icon}</div>
      <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>{value}</div>
      <div className="muted" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
        {label}
      </div>
    </div>
  )
}

function LessonNode({
  lesson,
  status,
  stars,
  onClick,
  color,
}: {
  lesson: Lesson
  status: 'done' | 'current' | 'locked'
  stars: number
  onClick: () => void
  color: string
}) {
  return (
    <motion.button
      id={`lesson-${lesson.id}`}
      whileTap={{ scale: 0.94 }}
      onClick={status === 'locked' ? undefined : onClick}
      style={{
        width: 92,
        height: 92,
        borderRadius: 28,
        scrollMarginTop: 80,
        background: status === 'locked' ? 'var(--cream-deep)' : color,
        color: status === 'locked' ? 'var(--ink-soft)' : '#fff',
        boxShadow:
          status === 'locked'
            ? 'none'
            : `0 7px 0 rgba(58,46,42,0.18)`,
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
        opacity: status === 'locked' ? 0.7 : 1,
        outline: status === 'current' ? '4px solid var(--ink)' : 'none',
      }}
    >
      <span style={{ fontSize: '2.2rem' }}>
        {status === 'locked' ? '🔒' : lesson.emoji}
      </span>
      {status === 'done' && (
        <span
          style={{
            position: 'absolute',
            bottom: -10,
            background: '#fff',
            borderRadius: 999,
            padding: '1px 7px',
            fontSize: '0.8rem',
            boxShadow: '0 3px 0 rgba(58,46,42,0.12)',
          }}
        >
          {'⭐'.repeat(Math.max(1, stars))}
        </span>
      )}
    </motion.button>
  )
}

export function Home() {
  const {
    profile,
    toggleSound,
    setRate,
    setLevel,
    switchToPicker,
    deleteProfile,
    unlockCostume,
    equipCostume,
  } = useProfile()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [story, setStory] = useState<Stop | null>(null)
  const [celebration, setCelebration] = useState<Stop | null>(null)
  const level = profile.level!
  const curriculum = getCurriculum(level)
  const levelMeta = LEVELS.find((l) => l.id === level)!

  // Quête du jour + révision espacée.
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const dailyXp = profile.daily.date === todayStr ? profile.daily.xp : 0
  const questPct = Math.min(100, Math.round((dailyXp / DAILY_GOAL) * 100))
  const questDone = dailyXp >= DAILY_GOAL
  const learnedTotal = Object.keys(profile.words).length
  const due = dueCount(profile)

  // Le voyage en France : les leçons regroupées par étape (région).
  const stops = journeyStops(level, curriculum)
  const regionDone = (islands: { lessons: Lesson[] }[]) =>
    islands.every((isl) => isl.lessons.every((l) => Boolean(profile.lessons[l.id])))

  const mapStops: MapStop[] = stops.map(({ stop, islands }) => ({
    id: stop.id,
    region: stop.region,
    emoji: stop.emoji,
    color: stop.color,
    coord: stop.coord,
    done: regionDone(islands),
  }))
  const currentStop = stops.find(({ islands }) => !regionDone(islands))?.stop ?? null
  const equippedCostume = costumeById(profile.costume)

  // Débloque le costume d'une région terminée + déclenche la célébration.
  useEffect(() => {
    for (const { stop, islands } of stops) {
      if (regionDone(islands) && !profile.costumes.includes(stop.costume.id)) {
        unlockCostume(stop.costume.id)
        setCelebration(stop)
        playFanfare()
        break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.lessons])

  function goToRegion(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // En revenant d'une leçon, on défile jusqu'à là où l'enfant en est (et non
  // tout en haut sur la carte).
  const location = useLocation()
  const focusLesson = (location.state as { focusLesson?: string } | null)?.focusLesson
  useEffect(() => {
    if (!focusLesson) return
    const t = setTimeout(() => {
      document
        .getElementById(`lesson-${focusLesson}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)
    return () => clearTimeout(t)
  }, [focusLesson])

  // Détermine l'état de chaque leçon : la première non terminée est "current".
  let foundCurrent = false
  function statusOf(lesson: Lesson): 'done' | 'current' | 'locked' {
    const done = Boolean(profile.lessons[lesson.id])
    if (done) return 'done'
    if (!foundCurrent) {
      foundCurrent = true
      return 'current'
    }
    return 'locked'
  }

  return (
    <div className="stack" style={{ paddingTop: 20, paddingBottom: 28, gap: 18 }}>
      {/* En-tête */}
      <div className="row">
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontSize: '2rem',
            boxShadow: '0 5px 0 rgba(58,46,42,0.12)',
            position: 'relative',
          }}
        >
          {profile.avatar}
          {equippedCostume && (
            <span
              style={{ position: 'absolute', top: -6, right: -6, fontSize: '1.1rem' }}
              title={equippedCostume.name}
            >
              {equippedCostume.emoji}
            </span>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>
            Salut {profile.name}&nbsp;!
          </div>
          <div className="muted" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
            Niveau {levelMeta.label}
          </div>
        </div>
        <div className="spacer" />
        <button
          onClick={toggleSound}
          className="audio-pill"
          style={{ width: 48, height: 48, minWidth: 48, fontSize: '1.2rem' }}
          aria-label={profile.soundOn ? 'Couper le son' : 'Activer le son'}
        >
          {profile.soundOn ? '🔊' : '🔇'}
        </button>
        <button
          onClick={() => setMenuOpen(true)}
          className="audio-pill"
          style={{
            width: 48,
            height: 48,
            minWidth: 48,
            fontSize: '1.2rem',
            background: '#fff',
            boxShadow: '0 5px 0 rgba(58,46,42,0.12)',
          }}
          aria-label="Réglages"
        >
          ⚙️
        </button>
      </div>

      {/* Statistiques */}
      <div className="row" style={{ gap: 10 }}>
        <Stat icon="🔥" value={profile.streak} label="jours de suite" />
        <Stat icon="⭐" value={profile.xp} label="points" />
        <Stat
          icon="🏆"
          value={Object.keys(profile.lessons).length}
          label="leçons finies"
        />
      </div>

      {/* Quête du jour */}
      <div
        className="card"
        style={{
          borderRadius: 26,
          background: questDone
            ? 'linear-gradient(120deg, var(--good), var(--teal))'
            : '#fff',
          color: questDone ? '#fff' : 'var(--ink)',
        }}
      >
        <div className="row" style={{ gap: 10 }}>
          <span style={{ fontSize: '1.8rem' }}>{questDone ? '🏅' : '🎯'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900 }}>
              {questDone ? 'Quête du jour réussie !' : 'Quête du jour'}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: 700 }}>
              {questDone ? 'Reviens demain pour la suite 🔥' : `Gagne ${DAILY_GOAL} ⭐ aujourd'hui`}
            </div>
          </div>
          <div style={{ fontWeight: 900 }}>
            {dailyXp}/{DAILY_GOAL}
          </div>
        </div>
        {!questDone && (
          <div className="progress-track" style={{ marginTop: 10 }}>
            <div className="progress-fill" style={{ width: `${questPct}%` }} />
          </div>
        )}
      </div>

      {/* Révision (répétition espacée) */}
      {learnedTotal > 0 && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/revision')}
          className="card row"
          style={{
            background: 'linear-gradient(120deg, var(--sun), var(--coral))',
            color: '#fff',
            gap: 14,
            borderRadius: 26,
          }}
        >
          <span style={{ fontSize: '2.2rem' }}>🧠</span>
          <span style={{ textAlign: 'left', flex: 1 }}>
            <span style={{ display: 'block', fontWeight: 900, fontSize: '1.1rem' }}>
              Révision du jour
            </span>
            <span style={{ fontSize: '0.85rem', opacity: 0.95 }}>
              {due > 0
                ? `${due} mot${due > 1 ? 's' : ''} à revoir avec Lumi`
                : 'Entretiens ta mémoire 💪'}
            </span>
          </span>
          {due > 0 && (
            <span
              style={{
                background: '#fff',
                color: 'var(--coral)',
                fontWeight: 900,
                borderRadius: 999,
                padding: '2px 12px',
                fontSize: '1.1rem',
              }}
            >
              {due}
            </span>
          )}
        </motion.button>
      )}

      {/* Parler avec Lumi */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/parler')}
        className="card row"
        style={{
          background: 'linear-gradient(120deg, var(--grape), var(--sky))',
          color: '#fff',
          gap: 14,
          borderRadius: 26,
        }}
      >
        <span style={{ fontSize: '2.2rem' }}>🎙️</span>
        <span style={{ textAlign: 'left' }}>
          <span style={{ display: 'block', fontWeight: 900, fontSize: '1.1rem' }}>
            Parle avec Lumi
          </span>
          <span style={{ fontSize: '0.85rem', opacity: 0.95 }}>
            Discute en français, à voix haute&nbsp;!
          </span>
        </span>
      </motion.button>

      {/* Le voyage de Lumi en France */}
      {stops.length === 0 ? (
        <div className="card center muted">
          Ce niveau arrive très bientôt&nbsp;! 🚧
        </div>
      ) : (
        <>
          {/* La carte de France avec la progression de Lumi */}
          <FranceMap
            stops={mapStops}
            currentId={currentStop?.id ?? null}
            avatar={profile.avatar}
            onSelect={goToRegion}
          />

          {/* Les étapes du voyage */}
          {stops.map(({ stop, islands }) => (
            <div key={stop.id} id={stop.id} className="stack" style={{ gap: 12, scrollMarginTop: 12 }}>
              {/* Bannière de la région + personnage */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setStory(stop)
                  speak(stop.story)
                }}
                className="card row"
                style={{
                  gap: 12,
                  marginTop: 6,
                  background: stop.color,
                  color: '#fff',
                  borderRadius: 22,
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '2rem' }}>{stop.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: '1.15rem' }}>{stop.region}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.95, fontWeight: 700 }}>
                    {stop.character.emoji} {stop.character.name} · touche pour l'histoire
                  </div>
                </div>
                <span style={{ fontSize: '1.8rem' }}>{stop.character.emoji}</span>
              </motion.button>

              {/* Les thèmes (îles) de la région */}
              {islands.map((island) => (
                <div key={island.id} className="stack" style={{ gap: 8 }}>
                  <div className="row" style={{ gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: '1.2rem' }}>{island.emoji}</span>
                    <h3 style={{ fontSize: '1rem' }}>{island.title}</h3>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 18,
                      rowGap: 24,
                      padding: '2px 4px 6px',
                    }}
                  >
                    {island.lessons.map((lesson) => {
                      const result = profile.lessons[lesson.id]
                      return (
                        <LessonNode
                          key={lesson.id}
                          lesson={lesson}
                          color={island.color}
                          status={statusOf(lesson)}
                          stars={result?.stars ?? 0}
                          onClick={() => navigate(`/lecon/${lesson.id}`)}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Fenêtre Réglages / Profil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(58,46,42,0.45)',
              display: 'grid',
              placeItems: 'center',
              padding: 20,
              zIndex: 50,
            }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="card stack"
              style={{ width: '100%', maxWidth: 380, gap: 16 }}
            >
              <div className="center" style={{ fontSize: '3rem' }}>
                {profile.avatar}
              </div>
              <h2 className="center" style={{ fontSize: '1.3rem' }}>
                {profile.name}
              </h2>
              <p className="center muted" style={{ marginTop: -8, fontWeight: 700 }}>
                Niveau {levelMeta.label} · ⭐ {profile.xp} points
              </p>

              {/* Changer de niveau (si on s'est trompé) */}
              <div className="stack" style={{ gap: 8 }}>
                <span style={{ fontWeight: 800 }}>🎓 Mon niveau</span>
                <div className="row" style={{ gap: 8 }}>
                  {LEVELS.map((l) => {
                    const ready = getCurriculum(l.id).islands.length > 0
                    const active = profile.level === l.id
                    return (
                      <button
                        key={l.id}
                        onClick={() => ready && setLevel(l.id)}
                        className="card center"
                        style={{
                          flex: 1,
                          padding: '12px 4px',
                          fontWeight: 900,
                          background: active ? l.color : '#fff',
                          color: active ? '#fff' : ready ? 'var(--ink)' : 'var(--ink-soft)',
                          opacity: ready ? 1 : 0.45,
                          outline: active ? '4px solid var(--ink)' : '4px solid transparent',
                        }}
                      >
                        {l.label}
                        {!ready && (
                          <span style={{ display: 'block', fontSize: '0.6rem' }}>🔒</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Vitesse de la voix */}
              <div className="stack" style={{ gap: 8 }}>
                <span style={{ fontWeight: 800 }}>🔊 Vitesse de la voix</span>
                <div className="row" style={{ gap: 8 }}>
                  {SPEECH_RATES.map((r) => {
                    const active = closestRate(profile.rate).id === r.id
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          setRate(r.value)
                          // aperçu immédiat à la nouvelle vitesse
                          speak('Bonjour, je suis Lumi.', { rate: r.value })
                        }}
                        className="card center stack"
                        style={{
                          flex: 1,
                          gap: 2,
                          padding: '12px 6px',
                          outline: active ? '4px solid var(--teal)' : '4px solid transparent',
                        }}
                      >
                        <span style={{ fontSize: '1.6rem' }}>{r.icon}</span>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                          {r.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Garde-robe : costumes de Lumi débloqués */}
              {profile.costumes.length > 0 && (
                <div className="stack" style={{ gap: 8 }}>
                  <span style={{ fontWeight: 800 }}>🧥 La garde-robe de Lumi</span>
                  <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => equipCostume(null)}
                      className="card center"
                      style={{
                        width: 52,
                        height: 52,
                        fontSize: '1.4rem',
                        padding: 0,
                        outline: !profile.costume ? '4px solid var(--teal)' : '4px solid transparent',
                      }}
                      title="Sans costume"
                    >
                      🦊
                    </button>
                    {profile.costumes.map((cid) => {
                      const c = costumeById(cid)
                      if (!c) return null
                      return (
                        <button
                          key={cid}
                          onClick={() => equipCostume(cid)}
                          className="card center"
                          style={{
                            width: 52,
                            height: 52,
                            fontSize: '1.4rem',
                            padding: 0,
                            outline: profile.costume === cid ? '4px solid var(--teal)' : '4px solid transparent',
                          }}
                          title={c.name}
                        >
                          {c.emoji}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <button className="btn" onClick={() => setMenuOpen(false)}>
                Continuer à jouer
              </button>

              <button
                className="btn btn--coral"
                onClick={() => {
                  // Change de joueur sans rien effacer : retour au choix des
                  // comptes. Chaque enfant garde sa progression.
                  switchToPicker()
                  navigate('/profils', { replace: true })
                }}
              >
                👋 Changer de joueur
              </button>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Supprimer le compte de ${profile.name} et toute sa progression ? C'est définitif.`,
                    )
                  ) {
                    deleteProfile(profile.id)
                    navigate('/profils', { replace: true })
                  }
                }}
                style={{
                  background: 'none',
                  color: 'var(--coral-deep)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  padding: 6,
                }}
              >
                🗑️ Supprimer ce compte
              </button>

              <p className="center muted" style={{ fontSize: '0.75rem', margin: 0 }}>
                Chaque enfant a son compte : sa progression est sauvegardée.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini-histoire du personnage de la région */}
      <AnimatePresence>
        {story && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStory(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(58,46,42,0.45)', display: 'grid', placeItems: 'center', padding: 20, zIndex: 50 }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="card stack center"
              style={{ width: '100%', maxWidth: 380, gap: 14 }}
            >
              <div style={{ fontSize: '3.4rem' }}>{story.character.emoji}</div>
              <h2 style={{ fontSize: '1.2rem' }}>{story.character.name}</h2>
              <p style={{ fontWeight: 700, lineHeight: 1.4 }}>« {story.story} »</p>
              <button className="btn btn--sun" onClick={() => speak(story.story)}>
                🔊 Réécouter
              </button>
              <button className="btn" onClick={() => setStory(null)}>
                C'est parti ! →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Célébration : région terminée + costume débloqué */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCelebration(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(58,46,42,0.55)', display: 'grid', placeItems: 'center', padding: 20, zIndex: 60 }}
          >
            <motion.div
              initial={{ scale: 0.6, rotate: -6 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card stack center"
              style={{ width: '100%', maxWidth: 380, gap: 12 }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
                style={{ fontSize: '3.6rem' }}
              >
                🎉
              </motion.div>
              <h2 style={{ fontSize: '1.3rem' }}>Bravo&nbsp;!</h2>
              <p style={{ fontWeight: 800, margin: 0 }}>
                Tu as terminé {celebration.region}&nbsp;!
              </p>
              <div
                className="card stack center"
                style={{ gap: 4, background: 'var(--cream)', width: '100%' }}
              >
                <div style={{ fontSize: '2.6rem' }}>{celebration.costume.emoji}</div>
                <div style={{ fontWeight: 800 }}>Costume débloqué&nbsp;!</div>
                <div className="muted" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  {celebration.costume.name}
                </div>
              </div>
              <button className="btn btn--coral" onClick={() => setCelebration(null)}>
                Super&nbsp;! 🎁
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
