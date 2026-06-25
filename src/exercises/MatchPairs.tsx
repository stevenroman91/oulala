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
        🧩 Touche un mot, puis son image
      </p>
      <div className="row" style={{ alignItems: 'stretch', gap: 12, flex: 1 }}>
        {/* Colonne des mots */}
        <div className="stack" style={{ flex: 1, justifyContent: 'center' }}>
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
                  fontSize: '1.15rem',
                  padding: '18px 12px',
                  minHeight: 70,
                  background: active ? 'var(--teal)' : '#fff',
                  color: active ? '#fff' : 'var(--ink)',
                  opacity: done ? 0.35 : 1,
                }}
              >
                {done ? '✅' : p.fr}
              </motion.button>
            )
          })}
        </div>
        {/* Colonne des images — grandes vignettes faciles à reconnaître */}
        <div className="stack" style={{ flex: 1, justifyContent: 'center' }}>
          {images.map((p) => {
            const done = matched.includes(p.fr)
            return (
              <motion.button
                key={p.fr}
                animate={
                  wrongPair === p.fr
                    ? { x: [0, -8, 8, 0] }
                    : done
                      ? { scale: [1, 1.12, 1] }
                      : {}
                }
                whileTap={{ scale: 0.96 }}
                onClick={() => tapImage(p.fr)}
                className="card center"
                style={{
                  fontSize: '3.8rem',
                  padding: 8,
                  minHeight: 90,
                  lineHeight: 1,
                  opacity: done ? 0.85 : 1,
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
