import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useProfile } from '../state/ProfileContext'
import { buildReviewExercises, selectReviewWords } from '../data/review'
import { ExerciseView } from '../exercises/ExerciseView'
import { Mascot } from '../components/Mascot'
import { playFanfare } from '../services/audio'

const ENCOURAGE = ['Bravo ! 🎉', 'Tu te souviens ! 🌟', 'Super mémoire ! 🧠', 'Oui ! 👏']

/* « Révision du jour » : une séance générée à partir des mots déjà appris,
   planifiée par répétition espacée. Rejouable chaque jour, contenu qui tourne. */
export function Review() {
  const navigate = useNavigate()
  const { profile, reviewWord } = useProfile()

  const items = useMemo(() => {
    const pool = Object.entries(profile.words).map(([fr, m]) => ({ fr, emoji: m.emoji }))
    const words = selectReviewWords(profile, 10)
    return buildReviewExercises(words, pool)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [index, setIndex] = useState(0)
  const [flash, setFlash] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  if (items.length === 0) {
    return (
      <div className="stack center" style={{ paddingTop: 50, gap: 18, flex: 1, justifyContent: 'center' }}>
        <Mascot mood="think" size={120} message="Finis d'abord une leçon, puis on révisera ensemble !" />
        <button className="btn" onClick={() => navigate('/')} style={{ maxWidth: 240, margin: '0 auto' }}>
          Aller jouer
        </button>
      </div>
    )
  }

  const total = items.length

  function handleDone(correctFirstTry: boolean) {
    reviewWord(items[index].wordFr, correctFirstTry)
    if (correctFirstTry) setCorrectCount((c) => c + 1)

    if (index + 1 >= total) {
      playFanfare()
      setFinished(true)
      return
    }
    setFlash(ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)])
    setTimeout(() => {
      setFlash(null)
      setIndex((i) => i + 1)
    }, 700)
  }

  if (finished) {
    return (
      <div className="stack center" style={{ paddingTop: 40, gap: 20, flex: 1, justifyContent: 'center' }}>
        <Mascot mood="cheer" size={130} />
        <h1 style={{ fontSize: '1.7rem' }}>Révision terminée&nbsp;!</h1>
        <p className="muted" style={{ marginTop: -10, fontWeight: 700 }}>
          {correctCount}/{total} du premier coup 🧠
        </p>
        <button className="btn btn--coral" onClick={() => navigate('/')} style={{ maxWidth: 240, margin: '0 auto' }}>
          Continuer 🏠
        </button>
      </div>
    )
  }

  return (
    <div className="stack" style={{ paddingTop: 16, paddingBottom: 20, gap: 14, flex: 1 }}>
      <div className="row" style={{ gap: 12 }}>
        <button
          onClick={() => navigate('/')}
          aria-label="Quitter"
          style={{ fontSize: '1.6rem', width: 44, height: 44, borderRadius: 14, background: '#fff', boxShadow: '0 4px 0 rgba(58,46,42,0.12)' }}
        >
          ✕
        </button>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(index / total) * 100}%` }} />
        </div>
        <span style={{ fontSize: '1.4rem' }}>🧠</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <ExerciseView exercise={items[index].exercise} soundOn={profile.soundOn} onDone={handleDone} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            style={{ position: 'fixed', left: 0, right: 0, bottom: 28, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}
          >
            <div style={{ background: 'var(--good)', color: '#fff', fontWeight: 900, fontSize: '1.3rem', padding: '14px 28px', borderRadius: 999, boxShadow: '0 6px 0 var(--good-deep)' }}>
              {flash}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
