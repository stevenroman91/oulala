import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { MemoryExercise } from '../data/curriculum'
import { playCorrect, playWrong, speak } from '../services/audio'
import { shuffle, type ExerciseProps } from './shared'

/* Méthode 9 — MÉMOIRE (cartes retournées).
   Le grand classique « jeu de mémoire » : retrouver les paires mot ↔ image
   en retournant les cartes. Très rejouable, fait travailler la mémoire et le
   lien graphie/sens, et c'est jubilatoire pour un enfant. */
interface Card {
  id: number
  fr: string
  face: string // l'emoji, ou le mot écrit
  kind: 'image' | 'word'
}

export function Memory({
  exercise,
  onDone,
  soundOn: _soundOn,
}: ExerciseProps & { exercise: MemoryExercise }) {
  const cards = useMemo<Card[]>(() => {
    const deck: Card[] = []
    exercise.pairs.forEach((p, i) => {
      deck.push({ id: i * 2, fr: p.fr, face: p.emoji, kind: 'image' })
      deck.push({ id: i * 2 + 1, fr: p.fr, face: p.fr, kind: 'word' })
    })
    return shuffle(deck)
  }, [exercise])

  const [flipped, setFlipped] = useState<number[]>([]) // index dans `cards`
  const [matched, setMatched] = useState<string[]>([])
  const [wrong, setWrong] = useState(false)
  const [misses, setMisses] = useState(0)
  const busy = flipped.length === 2

  function tap(index: number) {
    const card = cards[index]
    if (busy || matched.includes(card.fr) || flipped.includes(index)) return
    if (card.kind === 'image' || card.kind === 'word') speak(card.fr)

    const next = [...flipped, index]
    setFlipped(next)
    if (next.length === 2) {
      const [a, b] = next
      if (cards[a].fr === cards[b].fr) {
        playCorrect()
        const done = [...matched, cards[a].fr]
        setMatched(done)
        setFlipped([])
        if (done.length === exercise.pairs.length) {
          setTimeout(() => onDone(misses === 0), 450)
        }
      } else {
        playWrong()
        setWrong(true)
        setMisses((m) => m + 1)
        setTimeout(() => {
          setWrong(false)
          setFlipped([])
        }, 800)
      }
    }
  }

  return (
    <div className="stack" style={{ gap: 16, flex: 1 }}>
      <p style={{ fontWeight: 800, marginTop: 6 }}>🧠 Retrouve les paires</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: cards.length > 6 ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr',
          gap: 10,
          flex: 1,
          alignContent: 'center',
        }}
      >
        {cards.map((card, i) => {
          const isUp = flipped.includes(i) || matched.includes(card.fr)
          const isMatched = matched.includes(card.fr)
          return (
            <motion.button
              key={card.id}
              onClick={() => tap(i)}
              whileTap={{ scale: 0.95 }}
              animate={
                wrong && flipped.includes(i) ? { x: [0, -6, 6, -6, 0] } : {}
              }
              style={{
                aspectRatio: '3 / 4',
                borderRadius: 18,
                display: 'grid',
                placeItems: 'center',
                fontSize: card.kind === 'image' ? '2.4rem' : '1.05rem',
                fontWeight: 800,
                padding: 6,
                textAlign: 'center',
                color: isMatched ? '#fff' : isUp ? 'var(--ink)' : '#fff',
                background: isMatched
                  ? 'var(--good)'
                  : isUp
                    ? '#fff'
                    : 'linear-gradient(135deg, var(--grape), var(--sky))',
                boxShadow: isUp
                  ? '0 4px 0 rgba(58,46,42,0.12)'
                  : '0 5px 0 rgba(58,46,42,0.18)',
                opacity: isMatched ? 0.6 : 1,
                transition: 'background 0.2s, color 0.15s',
              }}
            >
              {isUp ? card.face : '⭐'}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
