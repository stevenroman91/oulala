import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mascot } from '../components/Mascot'
import { useProfile } from '../state/ProfileContext'
import { LEVELS, type LevelId } from '../data/curriculum'
import { useGreeting } from '../hooks/useGreeting'

const AVATARS = ['🦊', '🐼', '🐯', '🐰', '🐨', '🦁', '🐸', '🦄', '🐙']

export function Onboarding() {
  const { createProfile } = useProfile()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('🦊')
  const [level, setLevel] = useState<LevelId | null>(null)

  // Lumi se présente dès le premier contact de l'enfant avec l'écran.
  useGreeting('Bonjour ! Moi, c’est Lumi. Et toi, comment tu t’appelles ?')

  function finish(lvl: LevelId) {
    createProfile({ name: name.trim() || 'Champion', avatar, level: lvl })
    navigate('/', { replace: true })
  }

  return (
    <div className="stack" style={{ paddingTop: 28, gap: 22, flex: 1 }}>
      {step === 0 && (
        <motion.div
          className="stack"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ gap: 22 }}
        >
          <div className="center">
            <Mascot mood="wave" size={120} />
          </div>
          <h1 className="center" style={{ fontSize: '1.9rem' }}>
            Bienvenue&nbsp;! 👋
          </h1>
          <p className="center muted" style={{ marginTop: -8 }}>
            Je suis Lumi. On va apprendre le français en s’amusant&nbsp;!
          </p>
          <div className="card stack">
            <label style={{ fontWeight: 800 }}>Comment tu t’appelles&nbsp;?</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ton prénom"
              maxLength={16}
              style={{
                fontFamily: 'inherit',
                fontSize: '1.3rem',
                fontWeight: 700,
                padding: '16px 18px',
                borderRadius: 20,
                border: '3px solid var(--cream-deep)',
                outline: 'none',
                color: 'var(--ink)',
              }}
            />
          </div>
          <button className="btn" onClick={() => setStep(1)}>
            Continuer →
          </button>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div
          className="stack"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ gap: 18 }}
        >
          <h1 className="center" style={{ fontSize: '1.6rem' }}>
            Choisis ton héros&nbsp;!
          </h1>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 14,
            }}
          >
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className="card"
                style={{
                  fontSize: '3rem',
                  padding: 10,
                  display: 'grid',
                  placeItems: 'center',
                  aspectRatio: '1',
                  outline:
                    avatar === a ? '4px solid var(--teal)' : '4px solid transparent',
                  transform: avatar === a ? 'translateY(-4px)' : 'none',
                  transition: 'all 0.12s',
                }}
              >
                {a}
              </button>
            ))}
          </div>
          <button className="btn" onClick={() => setStep(2)}>
            C’est lui&nbsp;! →
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          className="stack"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ gap: 16 }}
        >
          <h1 className="center" style={{ fontSize: '1.5rem' }}>
            Tu es en quelle classe&nbsp;?
          </h1>
          <p className="center muted" style={{ marginTop: -6 }}>
            On commence par le bon niveau.
          </p>
          <div className="stack">
            {LEVELS.map((l) => {
              const ready = l.id === 'cp' || l.id === 'ce1'
              return (
                <button
                  key={l.id}
                  onClick={() => ready && setLevel(l.id)}
                  className="card row"
                  style={{
                    justifyContent: 'space-between',
                    outline:
                      level === l.id ? '4px solid var(--teal)' : '4px solid transparent',
                    opacity: ready ? 1 : 0.55,
                  }}
                >
                  <span className="row" style={{ gap: 14 }}>
                    <span
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        background: l.color,
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 900,
                      }}
                    >
                      {l.label}
                    </span>
                    <span style={{ fontWeight: 800 }}>{l.age}</span>
                  </span>
                  <span>{ready ? '✅' : '🔒 bientôt'}</span>
                </button>
              )
            })}
          </div>
          <button
            className="btn btn--coral"
            disabled={!level}
            onClick={() => level && finish(level)}
          >
            On commence&nbsp;! 🚀
          </button>
        </motion.div>
      )}
    </div>
  )
}
