import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { ListenWordExercise } from '../data/curriculum'
import { playCorrect, playWrong, speak } from '../services/audio'
import { SpeedControl } from '../components/SpeedControl'
import { shuffle, type ExerciseProps } from './shared'

/* Méthode 3 — DISCRIMINATION DES SONS / LECTURE.
   « Quel mot as-tu entendu ? » entre des mots proches
   (chat / rat, poule / boule). Affûte l'oreille et le décodage. */
export function ListenWord({
  exercise,
  onDone,
  soundOn,
}: ExerciseProps & { exercise: ListenWordExercise }) {
  const options = useMemo(() => shuffle(exercise.options), [exercise])
  const [wrong, setWrong] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    if (soundOn) speak(exercise.answer, { rate: 0.85 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise])

  function choose(word: string) {
    if (word === exercise.answer) {
      playCorrect()
      onDone(!missed)
    } else {
      playWrong()
      setWrong(word)
      setMissed(true)
      setTimeout(() => setWrong(null), 600)
    }
  }

  return (
    <div className="stack" style={{ gap: 18, flex: 1 }}>
      <div className="center stack" style={{ gap: 14, marginTop: 10 }}>
        <button
          className="audio-pill"
          style={{ width: 84, height: 84, fontSize: '2rem', margin: '0 auto' }}
          onClick={() => speak(exercise.answer, { rate: 0.85 })}
          aria-label="Réécouter"
        >
          🔊
        </button>
        <p style={{ fontWeight: 800 }}>Quel mot entends-tu&nbsp;?</p>
        <SpeedControl preview={exercise.answer} />
      </div>

      <div className="stack" style={{ flex: 1, justifyContent: 'center' }}>
        {options.map((word) => (
          <motion.button
            key={word}
            animate={wrong === word ? { x: [0, -10, 10, -8, 8, 0] } : {}}
            whileTap={{ scale: 0.96 }}
            onClick={() => choose(word)}
            className="card center"
            style={{
              fontSize: '1.8rem',
              fontWeight: 900,
              padding: 18,
              outline: wrong === word ? '4px solid var(--soft-red)' : 'none',
            }}
          >
            {word}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
