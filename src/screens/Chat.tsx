import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ConversationProvider, useConversation } from '@elevenlabs/react'
import { Mascot } from '../components/Mascot'
import { speak } from '../services/audio'

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string | undefined

/* ============================================================
   « Parle avec Lumi » — expression orale.
   Produire de la langue à voix haute est la compétence la plus
   difficile pour un enfant à l'étranger : il comprend souvent
   mais ose peu parler.

   • Si un agent ElevenLabs est configuré (VITE_ELEVENLABS_AGENT_ID),
     on ouvre une vraie conversation temps réel via le SDK React.
     L'enfant peut COUPER son micro à tout moment (pour poser une
     question à son prof, réfléchir…) puis le rouvrir.
   • Sinon, mode « entraînement guidé » : Lumi pose une question
     parmi une grande banque variée (voix de synthèse), l'enfant
     répond à voix haute, puis touche une réponse modèle pour
     l'entendre et se corriger.
   ============================================================ */

// Grande banque de questions, classées par thème et MÉLANGÉE à chaque
// session : Lumi ne « tourne plus en rond » et varie les sujets. Les
// formulations restent très simples et encourageantes, pour des enfants
// qui APPRENNENT à parler français (phrases courtes, mots du quotidien).
type Prompt = { q: string; emoji: string; samples: string[] }

const PROMPT_BANK: Prompt[] = [
  // — Se présenter —
  { q: 'Bonjour ! Comment tu t’appelles ?', emoji: '👋', samples: ['Je m’appelle…', 'Moi, c’est…'] },
  { q: 'Quel âge as-tu ?', emoji: '🎂', samples: ['J’ai six ans.', 'J’ai sept ans.'] },
  { q: 'Dans quel pays habites-tu ?', emoji: '🌍', samples: ['J’habite en Espagne.', 'J’habite aux États-Unis.'] },
  { q: 'Comment ça va aujourd’hui ?', emoji: '😊', samples: ['Ça va bien, merci !', 'Je suis content.'] },
  // — La famille —
  { q: 'Tu as un frère ou une sœur ?', emoji: '👧', samples: ['J’ai une sœur.', 'J’ai un petit frère.'] },
  { q: 'Comment s’appelle ta maman ?', emoji: '💕', samples: ['Ma maman s’appelle…', 'Elle s’appelle…'] },
  { q: 'Tu as un animal à la maison ?', emoji: '🐾', samples: ['J’ai un chat.', 'Non, je n’ai pas d’animal.'] },
  // — Les goûts —
  { q: 'Quelle est ta couleur préférée ?', emoji: '🎨', samples: ['Ma couleur préférée, c’est le bleu.', 'J’aime le rouge.'] },
  { q: 'Quel est ton animal préféré ?', emoji: '🦁', samples: ['J’aime les chats.', 'Mon animal préféré, c’est le chien.'] },
  { q: 'Qu’est-ce que tu aimes manger ?', emoji: '🍝', samples: ['J’aime les pâtes.', 'J’adore le chocolat !'] },
  { q: 'Quel est ton jeu préféré ?', emoji: '⚽', samples: ['J’aime le foot.', 'Je préfère les cartes.'] },
  { q: 'Tu préfères l’été ou l’hiver ?', emoji: '☀️', samples: ['Je préfère l’été.', 'J’aime l’hiver, pour la neige.'] },
  // — Le quotidien —
  { q: 'Qu’est-ce que tu as mangé ce matin ?', emoji: '🥐', samples: ['J’ai mangé du pain.', 'J’ai bu du lait.'] },
  { q: 'Qu’est-ce que tu fais après l’école ?', emoji: '🎒', samples: ['Je joue dehors.', 'Je fais mes devoirs.'] },
  { q: 'Quel temps fait-il aujourd’hui ?', emoji: '🌦️', samples: ['Il fait beau.', 'Il pleut.'] },
  { q: 'Qu’est-ce que tu vois par la fenêtre ?', emoji: '🪟', samples: ['Je vois un arbre.', 'Je vois des maisons.'] },
  // — Le corps & les émotions —
  { q: 'Tu te sens comment, là, tout de suite ?', emoji: '🫶', samples: ['Je suis content.', 'Je suis un peu fatigué.'] },
  { q: 'Montre-moi : où est ta main ?', emoji: '✋', samples: ['Voici ma main !', 'Ma main est là.'] },
  // — L’imagination —
  { q: 'Si tu étais un animal, lequel serais-tu ?', emoji: '🐯', samples: ['Je serais un lion.', 'Je serais un oiseau.'] },
  { q: 'Raconte-moi une chose que tu aimes faire.', emoji: '🌟', samples: ['J’aime dessiner.', 'J’aime chanter.'] },
  { q: 'Compte avec moi jusqu’à cinq !', emoji: '🔢', samples: ['Un, deux, trois, quatre, cinq !', 'Un… deux… trois…'] },
  { q: 'Dis-moi un mot en français que tu connais.', emoji: '💬', samples: ['Bonjour !', 'Merci !'] },
]

// Mélange (Fisher-Yates) — Lumi pose les questions dans un ordre différent
// à chaque visite, pour que ça ne devienne jamais répétitif.
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function Chat() {
  const navigate = useNavigate()
  const liveAgent = Boolean(AGENT_ID)

  return (
    <div className="stack" style={{ paddingTop: 16, paddingBottom: 24, gap: 18, flex: 1 }}>
      <div className="row">
        <button
          onClick={() => navigate('/')}
          aria-label="Retour"
          style={{
            fontSize: '1.4rem',
            width: 44,
            height: 44,
            borderRadius: 14,
            background: '#fff',
            boxShadow: '0 4px 0 rgba(58,46,42,0.12)',
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '1.3rem' }}>Parle avec Lumi 🎙️</h1>
      </div>

      {liveAgent ? (
        <ConversationProvider>
          <LiveAgent agentId={AGENT_ID as string} />
        </ConversationProvider>
      ) : (
        <GuidedMode />
      )}
    </div>
  )
}

/* ---------------------------------------------------------------
   Conversation temps réel avec l'agent ElevenLabs.
   Bouton « parler », bouton COUPER LE MICRO (pour poser une
   question à son prof sans que Lumi écoute), et bouton « stop ».
   --------------------------------------------------------------- */
function LiveAgent({ agentId }: { agentId: string }) {
  const conv = useConversation()
  const [error, setError] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)

  const status = conv.status // 'disconnected' | 'connecting' | 'connected' | 'error'
  const connected = status === 'connected'
  const isMuted = conv.isMuted

  async function start() {
    setError(null)
    setStarting(true)
    try {
      // Demande l'autorisation micro avant d'ouvrir la session.
      await navigator.mediaDevices.getUserMedia({ audio: true })
      await conv.startSession({ agentId, connectionType: 'webrtc' })
    } catch (e) {
      setError(
        'Je n’arrive pas à ouvrir le micro. Vérifie l’autorisation du micro dans ton navigateur, puis réessaie.',
      )
      console.error('startSession error', e)
    } finally {
      setStarting(false)
    }
  }

  async function stop() {
    try {
      await conv.endSession()
    } catch (e) {
      console.error('endSession error', e)
    }
  }

  // Coupe la session proprement si on quitte l'écran.
  useEffect(() => {
    return () => {
      conv.endSession?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stateLabel = !connected
    ? ''
    : isMuted
    ? '🤫 Micro coupé — Lumi attend'
    : conv.isSpeaking
    ? '🗣️ Lumi parle…'
    : '👂 Lumi t’écoute, parle !'

  return (
    <div className="stack" style={{ gap: 18, flex: 1 }}>
      <div className="center">
        <motion.div
          animate={
            connected && conv.isSpeaking
              ? { scale: [1, 1.06, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 1, repeat: connected && conv.isSpeaking ? Infinity : 0 }}
        >
          <Mascot
            mood={connected ? (conv.isSpeaking ? 'happy' : 'cheer') : 'happy'}
            size={120}
            message={connected ? undefined : 'Appuie sur le bouton et parle-moi !'}
          />
        </motion.div>
      </div>

      {connected && (
        <motion.div
          key={stateLabel}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="card center"
          style={{ fontSize: '1.15rem', fontWeight: 800 }}
        >
          {stateLabel}
        </motion.div>
      )}

      {!connected ? (
        <button
          className="btn btn--sun"
          onClick={start}
          disabled={starting || status === 'connecting'}
          style={{ maxWidth: 280, margin: '0 auto', fontSize: '1.15rem' }}
        >
          {starting || status === 'connecting' ? 'Connexion…' : '🎙️ Parler avec Lumi'}
        </button>
      ) : (
        <div className="stack" style={{ gap: 12 }}>
          {/* Couper / rouvrir le micro : l'enfant peut faire une pause
              (par ex. poser une question à son prof) sans fermer Lumi. */}
          <button
            className="btn"
            onClick={() => conv.setMuted(!isMuted)}
            style={{
              maxWidth: 300,
              margin: '0 auto',
              fontSize: '1.1rem',
              background: isMuted ? 'var(--good)' : 'var(--sun)',
              color: isMuted ? '#fff' : 'var(--ink)',
              boxShadow: isMuted ? '0 6px 0 var(--good-deep)' : '0 6px 0 var(--sun-deep)',
            }}
          >
            {isMuted ? '🎤 Reprendre la parole' : '🤫 Couper mon micro'}
          </button>
          {isMuted && (
            <p className="muted center" style={{ fontSize: '0.85rem', margin: 0 }}>
              Ton micro est coupé. Tu peux poser une question à ton prof,
              puis appuie sur « Reprendre la parole ».
            </p>
          )}
          <button
            className="btn btn--ghost"
            onClick={stop}
            style={{ maxWidth: 220, margin: '0 auto' }}
          >
            ⏹️ Terminer
          </button>
        </div>
      )}

      {error && (
        <p className="center" style={{ color: 'var(--bad)', fontWeight: 700, fontSize: '0.9rem' }}>
          {error}
        </p>
      )}

      {!connected && (
        <p className="muted center" style={{ fontSize: '0.85rem' }}>
          Lumi t’écoute et te répond en vrai. Parle doucement, Lumi est patiente 💬
        </p>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------
   Mode guidé (sans agent) : banque de questions variée et mélangée.
   --------------------------------------------------------------- */
function GuidedMode() {
  // Ordre mélangé, fixé pour la session (ne change pas à chaque rendu).
  const order = useMemo(() => shuffle(PROMPT_BANK), [])
  const [i, setI] = useState(0)
  const prompt = order[i]
  const seenReshuffle = useRef(false)

  useEffect(() => {
    speak(prompt.q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i])

  function next() {
    setI((v) => {
      const nv = v + 1
      if (nv >= order.length) {
        seenReshuffle.current = true
        return 0
      }
      return nv
    })
  }
  function prev() {
    setI((v) => (v - 1 + order.length) % order.length)
  }

  return (
    <div className="stack" style={{ gap: 18, flex: 1 }}>
      <div className="center">
        <Mascot mood="happy" size={110} />
      </div>

      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card center"
        style={{ fontSize: '1.4rem', fontWeight: 800 }}
      >
        <span style={{ fontSize: '2rem', display: 'block', marginBottom: 6 }}>{prompt.emoji}</span>
        « {prompt.q} »
      </motion.div>

      <button
        className="btn btn--sun"
        onClick={() => speak(prompt.q)}
        style={{ maxWidth: 260, margin: '0 auto' }}
      >
        🔊 Réécouter la question
      </button>

      <div className="card stack" style={{ gap: 12 }}>
        <p className="muted" style={{ fontWeight: 800, margin: 0 }}>
          🗣️ À toi&nbsp;! Réponds à voix haute, puis écoute un exemple :
        </p>
        {prompt.samples.map((s) => (
          <button
            key={s}
            onClick={() => speak(s)}
            className="row"
            style={{
              gap: 12,
              background: 'var(--cream)',
              borderRadius: 16,
              padding: '12px 16px',
              fontWeight: 700,
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🔊</span>
            <span>{s}</span>
          </button>
        ))}
      </div>

      <div className="spacer" />
      <div className="row" style={{ gap: 12 }}>
        <button className="btn btn--ghost" onClick={prev}>
          ← Avant
        </button>
        <button className="btn" onClick={next}>
          Une autre question →
        </button>
      </div>

      <p className="muted center" style={{ fontSize: '0.78rem', marginTop: 4 }}>
        💡 Astuce pour les parents : activez l’agent vocal ElevenLabs
        (variable <code>VITE_ELEVENLABS_AGENT_ID</code>) pour une vraie
        conversation où l’enfant peut aussi couper son micro.
      </p>
    </div>
  )
}
