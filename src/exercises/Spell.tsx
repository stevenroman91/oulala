import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { SpellExercise } from '../data/curriculum'
import { playCorrect, playWrong, speak } from '../services/audio'
import { shuffle, type ExerciseProps } from './shared'

/* Méthode 6 — ORTHOGRAPHE.
   On masque une ou deux lettres du mot ; l'enfant choisit la
   bonne lettre parmi des intrus. Travaille la mémoire
   orthographique sans clavier (adapté aux plus jeunes). */
const ALPHABET = 'abcdefghijklmnopqrstuvwxyzéèàâ'.split('')

export function Spell({
  exercise,
  onDone,
  soundOn,
}: ExerciseProps & { exercise: SpellExercise }) {
  const letters = exercise.word.fr.split('')
  const missingSet = useMemo(() => new Set(exercise.missing), [exercise])

  // État : lettres déjà placées (index -> lettre).
  const [filled, setFilled] = useState<Record<number, string>>({})
  const [missed, setMissed] = useState(false)
  const [wrongLetter, setWrongLetter] = useState<string | null>(null)

  // Prochaine case vide à compléter (de gauche à droite).
  const nextIndex = exercise.missing.find((i) => !(i in filled))

  useEffect(() => {
    if (soundOn) speak(exercise.word.fr)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise])

  // Choix de lettres : les bonnes manquantes + des intrus, mélangés.
  const choices = useMemo(() => {
    const correct = exercise.missing.map((i) => letters[i].toLowerCase())
    const pool = shuffle(ALPHABET.filter((l) => !correct.includes(l)))
    const distractors = pool.slice(0, Math.max(3, 6 - correct.length))
    return shuffle([...new Set([...correct, ...distractors])])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise])

  function pick(letter: string) {
    if (nextIndex === undefined) return
    const expected = letters[nextIndex].toLowerCase()
    if (letter === expected) {
      const filledNext = { ...filled, [nextIndex]: letters[nextIndex] }
      setFilled(filledNext)
      const complete = exercise.missing.every((i) => i in filledNext)
      if (complete) {
        playCorrect()
        speak(exercise.word.fr)
        setTimeout(() => onDone(!missed), 300)
      } else {
        playCorrect()
      }
    } else {
      playWrong()
      setMissed(true)
      setWrongLetter(letter)
      setTimeout(() => setWrongLetter(null), 500)
    }
  }

  return (
    <div className="stack" style={{ gap: 18, flex: 1 }}>
      <div className="row" style={{ gap: 12, marginTop: 6 }}>
        <button className="audio-pill" onClick={() => speak(exercise.word.fr)}>
          🔊
        </button>
        <p style={{ fontWeight: 800 }}>Complète le mot</p>
      </div>

      <div className="center" style={{ fontSize: '3.6rem' }}>
        {exercise.word.emoji}
      </div>

      {/* Le mot avec des cases */}
      <div
        className="row"
        style={{ justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}
      >
        {letters.map((ch, i) => {
          const isMissing = missingSet.has(i)
          const shown = isMissing ? filled[i] : ch
          const isActive = i === nextIndex
          return (
            <div
              key={i}
              style={{
                width: 46,
                height: 58,
                borderRadius: 14,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                fontSize: '1.8rem',
                background: isMissing ? '#fff' : 'transparent',
                border: isMissing
                  ? `3px solid ${isActive ? 'var(--teal)' : 'var(--cream-deep)'}`
                  : 'none',
                color: 'var(--ink)',
              }}
            >
              {shown ?? ''}
            </div>
          )
        })}
      </div>

      <div className="spacer" />

      {/* Lettres proposées */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
        }}
      >
        {choices.map((l) => (
          <motion.button
            key={l}
            animate={wrongLetter === l ? { x: [0, -8, 8, 0] } : {}}
            whileTap={{ scale: 0.92 }}
            onClick={() => pick(l)}
            className="card center"
            style={{
              fontWeight: 900,
              fontSize: '1.6rem',
              padding: 14,
              outline: wrongLetter === l ? '4px solid var(--soft-red)' : 'none',
            }}
          >
            {l}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
