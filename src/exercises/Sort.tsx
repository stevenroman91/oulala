import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SortExercise } from '../data/curriculum'
import { playCorrect, playWrong, speak } from '../services/audio'
import { shuffle, type ExerciseProps } from './shared'

/* Méthode 10 — TRI / CATÉGORISATION.
   L'enfant range chaque carte dans le bon panier (animaux/fruits, ou surtout
   « le / la » pour le genre des noms — une vraie difficulté en français).
   Travaille la classification et la grammaire de façon active. */
export function Sort({
  exercise,
  onDone,
  soundOn: _soundOn,
}: ExerciseProps & { exercise: SortExercise }) {
  const queue = useMemo(() => shuffle(exercise.items), [exercise])
  const [index, setIndex] = useState(0)
  const [placed, setPlaced] = useState<{ 0: string[]; 1: string[] }>({ 0: [], 1: [] })
  const [wrongGroup, setWrongGroup] = useState<number | null>(null)
  const [misses, setMisses] = useState(false)

  const current = queue[index]

  function choose(group: 0 | 1) {
    if (!current) return
    if (group === current.group) {
      playCorrect()
      speak(`${exercise.groups[group].label} ${current.word.fr}`)
      setPlaced((p) => ({ ...p, [group]: [...p[group], current.word.emoji] }))
      if (index + 1 >= queue.length) {
        setTimeout(() => onDone(!misses), 450)
      } else {
        setIndex((i) => i + 1)
      }
    } else {
      playWrong()
      setMisses(true)
      setWrongGroup(group)
      setTimeout(() => setWrongGroup(null), 500)
    }
  }

  return (
    <div className="stack" style={{ gap: 14, flex: 1 }}>
      <p style={{ fontWeight: 800, marginTop: 6 }}>🗂️ {exercise.prompt}</p>

      {/* La carte courante à ranger */}
      <div className="center" style={{ minHeight: 150, display: 'grid', placeItems: 'center' }}>
        <AnimatePresence mode="wait">
          {current ? (
            <motion.button
              key={index}
              initial={{ scale: 0.6, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              onClick={() => speak(current.word.fr)}
              className="card"
              style={{ fontSize: '4rem', padding: '18px 26px', borderRadius: 30 }}
            >
              {current.word.emoji}
            </motion.button>
          ) : (
            <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: '3rem' }}>
              🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="spacer" />

      {/* Les deux paniers */}
      <div className="row" style={{ gap: 12, alignItems: 'stretch' }}>
        {exercise.groups.map((g, gi) => (
          <motion.button
            key={g.label}
            animate={wrongGroup === gi ? { x: [0, -8, 8, 0] } : {}}
            whileTap={{ scale: 0.96 }}
            onClick={() => choose(gi as 0 | 1)}
            className="card stack center"
            style={{
              flex: 1,
              gap: 8,
              minHeight: 130,
              padding: 14,
              outline: wrongGroup === gi ? '4px solid var(--soft-red)' : 'none',
              borderTop: `6px solid ${gi === 0 ? 'var(--coral)' : 'var(--teal)'}`,
            }}
          >
            <div style={{ fontSize: '1.6rem', fontWeight: 900 }}>
              {g.emoji} {g.label}
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
                justifyContent: 'center',
                fontSize: '1.3rem',
                minHeight: 28,
              }}
            >
              {placed[gi as 0 | 1].map((e, k) => (
                <span key={k}>{e}</span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
