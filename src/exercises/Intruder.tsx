import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { IntruderExercise } from '../data/curriculum'
import { playCorrect, playWrong, speak } from '../services/audio'
import { shuffle, type ExerciseProps } from './shared'

/* Méthode 11 — TROUVE L'INTRUS.
   Quatre images, trois d'une même famille, une qui n'a rien à voir. L'enfant
   doit repérer l'intrus : vocabulaire + catégorisation + raisonnement, dans
   un format rapide et ludique. */
export function Intruder({
  exercise,
  onDone,
  soundOn,
}: ExerciseProps & { exercise: IntruderExercise }) {
  const options = useMemo(() => shuffle(exercise.options), [exercise])
  const [wrong, setWrong] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)
  const [found, setFound] = useState(false)

  function choose(opt: { fr: string }) {
    if (found) return
    if (opt.fr === exercise.answer) {
      playCorrect()
      speak(exercise.answer)
      setFound(true)
      setTimeout(() => onDone(!missed), 600)
    } else {
      playWrong()
      if (soundOn) speak(opt.fr)
      setMissed(true)
      setWrong(opt.fr)
      setTimeout(() => setWrong(null), 600)
    }
  }

  return (
    <div className="stack" style={{ gap: 16, flex: 1 }}>
      <p style={{ fontWeight: 800, marginTop: 6 }}>🔍 {exercise.prompt}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          flex: 1,
          alignContent: 'center',
        }}
      >
        {options.map((opt) => {
          const isIntruder = found && opt.fr === exercise.answer
          return (
            <motion.button
              key={opt.fr}
              animate={
                wrong === opt.fr
                  ? { x: [0, -8, 8, -8, 0] }
                  : isIntruder
                    ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }
                    : {}
              }
              whileTap={{ scale: 0.95 }}
              onClick={() => choose(opt)}
              className="card center"
              style={{
                fontSize: '3.4rem',
                padding: 18,
                aspectRatio: '1',
                display: 'grid',
                placeItems: 'center',
                outline: isIntruder
                  ? '5px solid var(--good)'
                  : wrong === opt.fr
                    ? '4px solid var(--soft-red)'
                    : 'none',
              }}
            >
              {opt.emoji}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
