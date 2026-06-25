import { motion } from 'framer-motion'

/* ============================================================
   Lumi, la mascotte.
   Un compagnon constant rassure l'enfant et porte la voix de
   l'app (consignes, encouragements). Ses humeurs renforcent le
   feedback émotionnel positif.
   ============================================================ */

export type Mood = 'happy' | 'cheer' | 'think' | 'oops' | 'wave'

const FACE: Record<Mood, string> = {
  happy: '🦊',
  cheer: '🦊',
  think: '🦊',
  oops: '🦊',
  wave: '🦊',
}

const BADGE: Record<Mood, string> = {
  happy: '⭐',
  cheer: '🎉',
  think: '💭',
  oops: '🤍',
  wave: '👋',
}

export function Mascot({
  mood = 'happy',
  size = 96,
  message,
}: {
  mood?: Mood
  size?: number
  message?: string
}) {
  return (
    <div className="row" style={{ alignItems: 'flex-end', gap: 12 }}>
      <motion.div
        initial={{ scale: 0.8, y: 8 }}
        animate={
          mood === 'cheer'
            ? { scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] }
            : mood === 'wave'
              ? { rotate: [0, -8, 8, 0] }
              : { scale: 1, y: [0, -6, 0] }
        }
        transition={
          mood === 'cheer'
            ? { duration: 0.5 }
            : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          position: 'relative',
          width: size,
          height: size,
          fontSize: size * 0.72,
          lineHeight: 1,
          display: 'grid',
          placeItems: 'center',
          filter: 'drop-shadow(0 6px 0 rgba(58,46,42,0.12))',
        }}
      >
        <span aria-hidden>{FACE[mood]}</span>
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: -4,
            right: -2,
            fontSize: size * 0.34,
          }}
        >
          {BADGE[mood]}
        </span>
      </motion.div>

      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, scale: 0.9, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="card"
          style={{
            padding: '12px 16px',
            borderRadius: 22,
            borderBottomLeftRadius: 6,
            fontWeight: 700,
            maxWidth: 280,
            boxShadow: '0 5px 0 rgba(58,46,42,0.10)',
          }}
        >
          {message}
        </motion.div>
      )}
    </div>
  )
}
