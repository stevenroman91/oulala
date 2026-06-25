/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Agent conversationnel ElevenLabs (public, intégrable côté client).
  readonly VITE_ELEVENLABS_AGENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
