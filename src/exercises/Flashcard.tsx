import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { FlashcardExercise } from '../data/curriculum'
import { speak } from '../services/audio'
import type { ExerciseProps } from './shared'

/* Méthode 1 — DÉCOUVERTE multisensorielle.
   L'enfant voit l'image, lit le mot, l'entend, et peut le répéter
   autant de fois qu'il veut. Aucune pression, aucune note. */
export function Flashcard({
  exercise,
  onDone,
  soundOn,
}: ExerciseProps & { exercise: FlashcardExercise }) {
  const { word } = exercise

  useEffect(() => {
    if (soundOn) speak(word.fr)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word.fr])

  return (
    <div className="stack center" style={{ gap: 22, flex: 1, justifyContent: 'center' }}>
      <p className="muted" style={{ fontWeight: 800 }}>
        👀 Regarde et écoute
      </p>
      <motion.div
        key={word.fr}
        initial={{ scale: 0.7, rotate: -6, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        className="card"
        style={{
          fontSize: '6rem',
          padding: '28px',
          alignSelf: 'center',
          borderRadius: 40,
        }}
        onClick={() => speak(word.fr)}
      >
        {word.emoji}
      </motion.div>
      <button
        onClick={() => speak(word.fr)}
        className="row"
        style={{
          alignSelf: 'center',
          gap: 12,
          background: '#fff',
          borderRadius: 999,
          padding: '12px 22px',
          boxShadow: '0 5px 0 rgba(58,46,42,0.12)',
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>🔊</span>
        <span style={{ fontWeight: 900, fontSize: '1.6rem' }}>{word.fr}</span>
      </button>
      {exercise.hint && <p className="muted">{exercise.hint}</p>}
      <button className="btn" onClick={() => onDone(true)}>
        J’ai compris ! →
      </button>
    </div>
  )
}
