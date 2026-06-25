import { createElement, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mascot } from '../components/Mascot'
import { speak } from '../services/audio'

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string | undefined

/* ============================================================
   « Parle avec Lumi » — expression orale.
   Produire de la langue à voix haute est la compétence la plus
   difficile pour un enfant à l'étranger : il comprend souvent
   mais ose peu parler.

   • Si un agent ElevenLabs est configuré (VITE_ELEVENLABS_AGENT_ID),
     on charge le widget conversationnel temps réel.
   • Sinon, mode « entraînement guidé » : Lumi pose une question
     (voix de synthèse), l'enfant répond à voix haute, puis touche
     une réponse modèle pour l'entendre et se corriger.
   ============================================================ */

const PROMPTS: { q: string; samples: string[] }[] = [
  {
    q: 'Bonjour ! Comment tu t’appelles ?',
    samples: ['Je m’appelle…', 'Moi, c’est…'],
  },
  {
    q: 'Quel âge as-tu ?',
    samples: ['J’ai six ans.', 'J’ai sept ans.'],
  },
  {
    q: 'Quelle est ta couleur préférée ?',
    samples: ['Ma couleur préférée est le bleu.', 'J’aime le rouge.'],
  },
  {
    q: 'Quel est ton animal préféré ?',
    samples: ['J’aime les chats.', 'Mon animal préféré est le chien.'],
  },
  {
    q: 'Qu’est-ce que tu aimes manger ?',
    samples: ['J’aime les pâtes.', 'J’adore le chocolat !'],
  },
]

function useElevenLabsWidget(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const id = 'elevenlabs-convai-script'
    if (document.getElementById(id)) return
    const s = document.createElement('script')
    s.id = id
    s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
    s.async = true
    s.type = 'text/javascript'
    document.body.appendChild(s)
  }, [enabled])
}

export function Chat() {
  const navigate = useNavigate()
  const liveAgent = Boolean(AGENT_ID)
  useElevenLabsWidget(liveAgent)

  const [i, setI] = useState(0)
  const prompt = PROMPTS[i]

  useEffect(() => {
    if (!liveAgent) speak(prompt.q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i])

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
        <div className="stack" style={{ gap: 16, flex: 1 }}>
          <div className="center">
            <Mascot mood="happy" size={120} message="Appuie sur le micro et parle-moi !" />
          </div>
          {/* Widget conversationnel temps réel ElevenLabs */}
          <div className="card center" style={{ padding: 16 }}>
            {createElement('elevenlabs-convai', { 'agent-id': AGENT_ID })}
          </div>
          <p className="muted center" style={{ fontSize: '0.85rem' }}>
            Lumi t’écoute et te répond en vrai 💬
          </p>
        </div>
      ) : (
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
            <button
              className="btn btn--ghost"
              onClick={() => setI((v) => (v - 1 + PROMPTS.length) % PROMPTS.length)}
            >
              ← Avant
            </button>
            <button
              className="btn"
              onClick={() => setI((v) => (v + 1) % PROMPTS.length)}
            >
              Suivant →
            </button>
          </div>

          <p className="muted center" style={{ fontSize: '0.78rem', marginTop: 4 }}>
            💡 Astuce pour les parents : activez l’agent vocal ElevenLabs
            (variable <code>VITE_ELEVENLABS_AGENT_ID</code>) pour une vraie
            conversation.
          </p>
        </div>
      )}
    </div>
  )
}
