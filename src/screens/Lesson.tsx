import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { findLesson } from '../data/curriculum'
import { useProfile } from '../state/ProfileContext'
import { ExerciseView } from '../exercises/ExerciseView'
import { Mascot } from '../components/Mascot'
import { playFanfare, speak } from '../services/audio'

const ENCOURAGE = ['Bravo ! 🎉', 'Super ! ⭐', 'Génial ! 🌟', 'Trop fort ! 💪', 'Oui ! 👏']

export function Lesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { profile, recordLesson } = useProfile()

  const found = useMemo(
    () => (lessonId ? findLesson(profile.level!, lessonId) : null),
    [lessonId, profile.level],
  )

  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [flash, setFlash] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)

  if (!found) {
    return (
      <div className="stack center" style={{ paddingTop: 60, gap: 16 }}>
        <Mascot mood="think" message="Oups, leçon introuvable !" />
        <button className="btn" onClick={() => navigate('/')}>
          Retour à la maison
        </button>
      </div>
    )
  }

  const { lesson } = found
  const total = lesson.exercises.length

  function handleDone(correctFirstTry: boolean) {
    const newCorrect = correctCount + (correctFirstTry ? 1 : 0)
    setCorrectCount(newCorrect)

    if (index + 1 >= total) {
      // Fin de leçon : calcul des étoiles selon le taux de réussite.
      const pct = Math.round((newCorrect / total) * 100)
      const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1
      recordLesson(lesson.id, stars, pct)
      playFanfare()
      setFinished(true)
      return
    }

    // Petit flash d'encouragement entre les exercices.
    setFlash(ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)])
    setTimeout(() => {
      setFlash(null)
      setIndex((i) => i + 1)
    }, 750)
  }

  if (finished) {
    const result = profile.lessons[lesson.id]
    const stars = result?.stars ?? 1
    return <LessonComplete lesson={lesson.title} stars={stars} onHome={() => navigate('/')} />
  }

  const exercise = lesson.exercises[index]

  return (
    <div className="stack" style={{ paddingTop: 16, paddingBottom: 20, gap: 14, flex: 1 }}>
      {/* En-tête : quitter + progression */}
      <div className="row" style={{ gap: 12 }}>
        <button
          onClick={() => navigate('/')}
          aria-label="Quitter"
          style={{
            fontSize: '1.6rem',
            width: 44,
            height: 44,
            borderRadius: 14,
            background: '#fff',
            boxShadow: '0 4px 0 rgba(58,46,42,0.12)',
          }}
        >
          ✕
        </button>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Exercice courant */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <ExerciseView
            exercise={exercise}
            soundOn={profile.soundOn}
            onDone={handleDone}
          />
        </motion.div>
      </AnimatePresence>

      {/* Flash d'encouragement */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 28,
              display: 'grid',
              placeItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                background: 'var(--good)',
                color: '#fff',
                fontWeight: 900,
                fontSize: '1.4rem',
                padding: '14px 28px',
                borderRadius: 999,
                boxShadow: '0 6px 0 var(--good-deep)',
              }}
            >
              {flash}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LessonComplete({
  lesson,
  stars,
  onHome,
}: {
  lesson: string
  stars: number
  onHome: () => void
}) {
  return (
    <div
      className="stack center"
      style={{ paddingTop: 40, gap: 22, flex: 1, justifyContent: 'center' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, -8, 8, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Mascot mood="cheer" size={130} />
      </motion.div>
      <h1 style={{ fontSize: '1.8rem' }}>Leçon terminée&nbsp;!</h1>
      <p className="muted" style={{ marginTop: -10, fontWeight: 700 }}>
        {lesson}
      </p>
      <div className="row" style={{ justifyContent: 'center', gap: 8 }}>
        {[1, 2, 3].map((s) => (
          <motion.span
            key={s}
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: s <= stars ? 1.1 : 0.8, rotate: 0 }}
            transition={{ delay: 0.2 + s * 0.18, type: 'spring' }}
            style={{ fontSize: '3rem', filter: s <= stars ? 'none' : 'grayscale(1) opacity(0.4)' }}
          >
            ⭐
          </motion.span>
        ))}
      </div>
      <button
        className="btn"
        onClick={() => speak('Bravo, continue comme ça !')}
        style={{ maxWidth: 240, margin: '0 auto', background: 'var(--sun)', color: 'var(--ink)', boxShadow: '0 6px 0 var(--sun-deep)' }}
      >
        🔊 Écoute Lumi
      </button>
      <button
        className="btn btn--coral"
        onClick={onHome}
        style={{ maxWidth: 240, margin: '0 auto' }}
      >
        Continuer 🏠
      </button>
    </div>
  )
}
