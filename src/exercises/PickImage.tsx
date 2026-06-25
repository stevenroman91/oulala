import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { PickImageExercise } from '../data/curriculum'
import { playCorrect, playWrong, speak } from '../services/audio'
import { shuffle, type ExerciseProps } from './shared'

/* Méthode 2 — COMPRÉHENSION ORALE.
   « J'entends un mot, je touche la bonne image. »
   Travaille le lien son → sens sans exiger la lecture. */
export function PickImage({
  exercise,
  onDone,
  soundOn,
}: ExerciseProps & { exercise: PickImageExercise }) {
  const options = useMemo(() => shuffle(exercise.options), [exercise])
  const [wrong, setWrong] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    if (soundOn) speak(exercise.prompt.fr)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise])

  function choose(fr: string) {
    if (fr === exercise.prompt.fr) {
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
    <div className="stack" style={{ gap: 18, flex: 1 }}>
      <div className="row" style={{ justifyContent: 'center', gap: 14, marginTop: 8 }}>
        <button
          className="audio-pill"
          onClick={() => speak(exercise.prompt.fr)}
          aria-label="Réécouter le mot"
        >
          🔊
        </button>
        <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>Touche : écoute&nbsp;!</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: options.length > 2 ? '1fr 1fr' : '1fr 1fr',
          gap: 14,
          flex: 1,
          alignContent: 'center',
        }}
      >
        {options.map((opt) => (
          <motion.button
            key={opt.fr}
            animate={wrong === opt.fr ? { x: [0, -10, 10, -8, 8, 0] } : {}}
            whileTap={{ scale: 0.95 }}
            onClick={() => choose(opt.fr)}
            className="card"
            style={{
              fontSize: '3.6rem',
              padding: 18,
              display: 'grid',
              placeItems: 'center',
              aspectRatio: '1',
              outline: wrong === opt.fr ? '4px solid var(--soft-red)' : 'none',
            }}
          >
            {opt.emoji}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
