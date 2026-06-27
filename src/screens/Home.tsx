import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { closestRate, SPEECH_RATES, useProfile } from '../state/ProfileContext'
import { getCurriculum, LEVELS, type Island, type Lesson } from '../data/curriculum'
import { speak } from '../services/audio'

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
      whileTap={{ scale: 0.94 }}
      onClick={status === 'locked' ? undefined : onClick}
      style={{
        width: 92,
        height: 92,
        borderRadius: 28,
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
  const { profile, toggleSound, setRate, setLevel, reset } = useProfile()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const level = profile.level!
  const curriculum = getCurriculum(level)
  const levelMeta = LEVELS.find((l) => l.id === level)!


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
          }}
        >
          {profile.avatar}
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

      {/* Carte des îles */}
      {curriculum.islands.length === 0 ? (
        <div className="card center muted">
          Ce niveau arrive très bientôt&nbsp;! 🚧
        </div>
      ) : (
        curriculum.islands.map((island: Island) => (
          <div key={island.id} className="stack" style={{ gap: 12 }}>
            <div className="row" style={{ gap: 10, marginTop: 6 }}>
              <span style={{ fontSize: '1.6rem' }}>{island.emoji}</span>
              <h2 style={{ fontSize: '1.2rem' }}>{island.title}</h2>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 18,
                rowGap: 26,
                padding: '4px 4px 8px',
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
        ))
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
                    const ready = l.id === 'cp' || l.id === 'ce1'
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

              <button className="btn" onClick={() => setMenuOpen(false)}>
                Continuer à jouer
              </button>

              <button
                className="btn btn--coral"
                onClick={() => {
                  // Pas de compte : « se déconnecter » = effacer le profil
                  // local et revenir à l'écran de bienvenue.
                  if (
                    window.confirm(
                      'Changer de héros ? La progression de ' +
                        profile.name +
                        ' sera effacée sur cet appareil.',
                    )
                  ) {
                    reset()
                    navigate('/bienvenue', { replace: true })
                  }
                }}
              >
                👋 Changer de héros
              </button>

              <p className="center muted" style={{ fontSize: '0.75rem', margin: 0 }}>
                Lumi fonctionne sans compte : la progression reste sur cet appareil.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
