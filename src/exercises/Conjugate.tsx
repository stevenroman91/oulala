import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { ConjugateExercise } from '../data/curriculum'
import { playCorrect, playWrong, speak } from '../services/audio'
import { shuffle, type ExerciseProps } from './shared'

/* Méthode 7 — CONJUGAISON.
   « je (manger) → ? » : l'enfant choisit la bonne terminaison.
   On entend la phrase correcte une fois trouvée, pour ancrer la
   forme à l'oral autant qu'à l'écrit. */
export function Conjugate({
  exercise,
  onDone,
  soundOn: _soundOn,
}: ExerciseProps & { exercise: ConjugateExercise }) {
  const options = useMemo(() => shuffle(exercise.options), [exercise])
  const [wrong, setWrong] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)

  const liaison = exercise.pronoun.endsWith('’') ? '' : ' '

  async function choose(form: string) {
    if (form === exercise.answer) {
      playCorrect()
      await speak(`${exercise.pronoun}${liaison}${exercise.answer}`)
      onDone(!missed)
    } else {
      playWrong()
      setWrong(form)
      setMissed(true)
      setTimeout(() => setWrong(null), 600)
    }
  }

  return (
    <div className="stack" style={{ gap: 18, flex: 1 }}>
      <p style={{ fontWeight: 800, marginTop: 6 }}>🧩 Choisis la bonne forme</p>

      {exercise.emoji && (
        <div className="center" style={{ fontSize: '3.2rem' }}>
          {exercise.emoji}
        </div>
      )}

      {/* La consigne : pronom + verbe à l'infinitif entre parenthèses */}
      <div
        className="card center"
        style={{ fontSize: '1.6rem', fontWeight: 900, padding: 20 }}
      >
        <span>{exercise.pronoun}</span>{' '}
        <span
          style={{
            display: 'inline-grid',
            placeItems: 'center',
            minWidth: 70,
            padding: '2px 14px',
            margin: '0 4px',
            borderRadius: 14,
            border: '3px dashed var(--cream-deep)',
            color: 'var(--ink-soft)',
          }}
        >
          ?
        </span>
        <div className="muted" style={{ fontSize: '0.95rem', marginTop: 8, fontWeight: 700 }}>
          (verbe : {exercise.verb})
        </div>
      </div>

      <div className="spacer" />

      <div className="stack">
        {options.map((form) => (
          <motion.button
            key={form}
            animate={wrong === form ? { x: [0, -10, 10, -8, 8, 0] } : {}}
            whileTap={{ scale: 0.96 }}
            onClick={() => choose(form)}
            className="card center"
            style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              padding: 16,
              outline: wrong === form ? '4px solid var(--soft-red)' : 'none',
            }}
          >
            {exercise.pronoun}
            {liaison}
            {form}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
