import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { ReadingExercise } from '../data/curriculum'
import { playCorrect, playWrong, speak } from '../services/audio'
import { SpeedControl } from '../components/SpeedControl'
import { shuffle, type ExerciseProps } from './shared'

/* Méthode 8 — LECTURE & COMPRÉHENSION.
   L'enfant LIT une phrase courte (il peut la réécouter), puis
   répond à une question avec des réponses illustrées. On vérifie
   ainsi qu'il comprend ce qu'il décode, pas seulement qu'il sonne
   les lettres. */
export function Reading({
  exercise,
  onDone,
  soundOn,
}: ExerciseProps & { exercise: ReadingExercise }) {
  const options = useMemo(() => shuffle(exercise.options), [exercise])
  const [wrong, setWrong] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    if (soundOn) {
      const t = setTimeout(() => speak(exercise.text), 350)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise])

  function choose(fr: string) {
    if (fr === exercise.answer) {
      playCorrect()
      onDone(!missed)
    } else {
      playWrong()
      setWrong(fr)
      setMissed(true)
      setTimeout(() => setWrong(null), 600)
    }
  }

  return (
    <div className="stack" style={{ gap: 16, flex: 1 }}>
      <p style={{ fontWeight: 800, marginTop: 6 }}>📖 Lis la phrase</p>

      {/* La phrase à lire, avec bouton d'écoute */}
      <motion.div
        key={exercise.text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ padding: 20 }}
      >
        {exercise.emoji && (
          <div className="center" style={{ fontSize: '3rem', marginBottom: 8 }}>
            {exercise.emoji}
          </div>
        )}
        <div
          className="center"
          style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1.3 }}
        >
          {exercise.text}
        </div>
        <div
          className="row"
          style={{ justifyContent: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}
        >
          <button
            onClick={() => {
              setReveal(true)
              speak(exercise.text)
            }}
            className="row"
            style={{
              gap: 10,
              background: 'var(--cream)',
              borderRadius: 999,
              padding: '10px 18px',
              fontWeight: 800,
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🔊</span>
            {reveal ? 'Réécouter' : 'Écouter la phrase'}
          </button>
          <SpeedControl preview={exercise.text} />
        </div>
      </motion.div>

      {/* La question */}
      <p className="center" style={{ fontWeight: 800, fontSize: '1.1rem' }}>
        {exercise.question}
      </p>

      {/* Réponses illustrées */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {options.map((opt) => (
          <motion.button
            key={opt.fr}
            animate={wrong === opt.fr ? { x: [0, -8, 8, 0] } : {}}
            whileTap={{ scale: 0.96 }}
            onClick={() => choose(opt.fr)}
            className="card center stack"
            style={{
              gap: 6,
              padding: '18px 12px',
              minHeight: 120,
              justifyContent: 'center',
              outline: wrong === opt.fr ? '4px solid var(--soft-red)' : 'none',
            }}
          >
            <span style={{ fontSize: '3.6rem', lineHeight: 1 }}>{opt.emoji}</span>
            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{opt.fr}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
