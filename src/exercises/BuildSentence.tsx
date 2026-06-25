import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import type { BuildSentenceExercise } from '../data/curriculum'
import { playCorrect, playWrong, speak } from '../services/audio'
import { SpeedControl } from '../components/SpeedControl'
import { shuffle, type ExerciseProps } from './shared'

/* Méthode 4 — SYNTAXE / CONSTRUCTION DE PHRASE.
   L'enfant remet les mots dans l'ordre en les touchant.
   Travaille l'ordre des mots et la structure de la phrase. */
export function BuildSentence({
  exercise,
  onDone,
  soundOn,
}: ExerciseProps & { exercise: BuildSentenceExercise }) {
  const target = exercise.sentence.split(' ')
  const bank = useMemo(
    () => shuffle(target.map((w, i) => ({ w, key: `${w}-${i}` }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercise],
  )
  const [picked, setPicked] = useState<{ w: string; key: string }[]>([])
  const [missed, setMissed] = useState(false)
  const [shake, setShake] = useState(false)

  // On joue la phrase entière une fois au début comme modèle.
  useEffect(() => {
    if (soundOn) speak(exercise.sentence)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise])

  const available = bank.filter((b) => !picked.some((p) => p.key === b.key))
  const isFull = picked.length === target.length

  async function check() {
    const made = picked.map((p) => p.w).join(' ')
    if (made === exercise.sentence) {
      playCorrect()
      await speak(exercise.sentence) // on laisse la phrase se terminer
      onDone(!missed)
    } else {
      playWrong()
      setMissed(true)
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setPicked([])
      }, 600)
    }
  }

  return (
    <div className="stack" style={{ gap: 16, flex: 1 }}>
      <div className="row" style={{ gap: 12, marginTop: 6 }}>
        <button className="audio-pill" onClick={() => speak(exercise.sentence)}>
          🔊
        </button>
        <p style={{ fontWeight: 800, flex: 1 }}>Remets la phrase</p>
        <SpeedControl preview={exercise.sentence} />
      </div>

      {exercise.emoji && (
        <div className="center" style={{ fontSize: '3.4rem' }}>
          {exercise.emoji}
        </div>
      )}

      {/* Zone de construction */}
      <motion.div
        animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : {}}
        className="card"
        style={{
          minHeight: 78,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
          borderRadius: 24,
          border: '3px dashed var(--cream-deep)',
        }}
      >
        {picked.length === 0 && (
          <span className="muted" style={{ fontWeight: 700 }}>
            Touche les mots ci-dessous…
          </span>
        )}
        {picked.map((p) => (
          <button
            key={p.key}
            onClick={() => setPicked((cur) => cur.filter((x) => x.key !== p.key))}
            style={chipStyle('var(--teal)')}
          >
            {p.w}
          </button>
        ))}
      </motion.div>

      {/* Banque de mots */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {available.map((b) => (
          <motion.button
            key={b.key}
            whileTap={{ scale: 0.92 }}
            onClick={() => setPicked((cur) => [...cur, b])}
            style={chipStyle('#fff', true)}
          >
            {b.w}
          </motion.button>
        ))}
      </div>

      <div className="spacer" />
      <button className="btn" disabled={!isFull} onClick={check}>
        Vérifier ✓
      </button>
    </div>
  )
}

function chipStyle(bg: string, dark = false): CSSProperties {
  return {
    fontFamily: 'inherit',
    fontWeight: 800,
    fontSize: '1.15rem',
    color: dark ? 'var(--ink)' : '#fff',
    background: bg,
    borderRadius: 16,
    padding: '12px 16px',
    boxShadow: dark ? '0 4px 0 rgba(58,46,42,0.12)' : '0 4px 0 var(--teal-deep)',
  }
}
