import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { MatchPairsExercise } from '../data/curriculum'
import { playCorrect, playWrong, speak } from '../services/audio'
import { shuffle, type ExerciseProps } from './shared'

/* Méthode 5 — MÉMOIRE & ASSOCIATION.
   L'enfant associe chaque mot écrit à son image. Renforce le
   lien graphie ↔ image et fait travailler la mémoire de travail. */
export function MatchPairs({
  exercise,
  onDone,
  soundOn: _soundOn,
}: ExerciseProps & { exercise: MatchPairsExercise }) {
  const words = useMemo(() => shuffle(exercise.pairs), [exercise])
  const images = useMemo(() => shuffle(exercise.pairs), [exercise])

  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [wrongPair, setWrongPair] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)

  function tapWord(fr: string) {
    if (matched.includes(fr)) return
    setSelectedWord(fr)
    speak(fr)
  }

  function tapImage(fr: string) {
    if (matched.includes(fr)) return
    if (!selectedWord) return
    if (selectedWord === fr) {
      playCorrect()
      const next = [...matched, fr]
      setMatched(next)
      setSelectedWord(null)
      if (next.length === exercise.pairs.length) {
        setTimeout(() => onDone(!missed), 350)
      }
    } else {
      playWrong()
      setMissed(true)
      setWrongPair(fr)
      setTimeout(() => {
        setWrongPair(null)
        setSelectedWord(null)
      }, 500)
    }
  }

  return (
    <div className="stack" style={{ gap: 16, flex: 1 }}>
      <p style={{ fontWeight: 800, marginTop: 6 }}>
        🧩 Associe le mot à la bonne image
      </p>
      <div className="row" style={{ alignItems: 'flex-start', gap: 12, flex: 1 }}>
        {/* Colonne des mots */}
        <div className="stack" style={{ flex: 1 }}>
          {words.map((p) => {
            const done = matched.includes(p.fr)
            const active = selectedWord === p.fr
            return (
              <motion.button
                key={p.fr}
                whileTap={{ scale: 0.96 }}
                onClick={() => tapWord(p.fr)}
                className="card center"
                style={{
                  fontWeight: 800,
                  padding: 14,
                  opacity: done ? 0.4 : 1,
                  outline: active ? '4px solid var(--teal)' : 'none',
                }}
              >
                {p.fr}
              </motion.button>
            )
          })}
        </div>
        {/* Colonne des images */}
        <div className="stack" style={{ flex: 1 }}>
          {images.map((p) => {
            const done = matched.includes(p.fr)
            return (
              <motion.button
                key={p.fr}
                animate={wrongPair === p.fr ? { x: [0, -8, 8, 0] } : {}}
                whileTap={{ scale: 0.96 }}
                onClick={() => tapImage(p.fr)}
                className="card center"
                style={{
                  fontSize: '2.4rem',
                  padding: 12,
                  opacity: done ? 0.4 : 1,
                  outline: wrongPair === p.fr ? '4px solid var(--soft-red)' : 'none',
                }}
              >
                {done ? '✅' : p.emoji}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
