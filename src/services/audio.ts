/* ============================================================
   Service audio de Lumi
   ------------------------------------------------------------
   Un enfant qui apprend le français à l'étranger a besoin
   d'ENTENDRE le mot juste, prononcé clairement, autant de fois
   qu'il veut. L'audio est donc central, pas accessoire.

   Deux fournisseurs :
   1. ElevenLabs (voix premium) si une clé est configurée.
   2. Web Speech API du navigateur (gratuit, hors-ligne) sinon.

   L'app reste 100% jouable sans aucune clé.
   ============================================================ */

const EL_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined
const EL_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID as string | undefined

export const hasPremiumVoice = Boolean(EL_API_KEY && EL_VOICE_ID)

// Petit cache pour ne pas re-télécharger un mot déjà prononcé.
const cache = new Map<string, string>()
let currentAudio: HTMLAudioElement | null = null

function stopCurrent() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

async function speakWithElevenLabs(text: string): Promise<boolean> {
  try {
    let url = cache.get(text)
    if (!url) {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': EL_API_KEY as string,
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        },
      )
      if (!res.ok) return false
      const blob = await res.blob()
      url = URL.createObjectURL(blob)
      cache.set(text, url)
    }
    const audio = new Audio(url)
    currentAudio = audio
    await audio.play()
    return true
  } catch {
    return false
  }
}

let frenchVoice: SpeechSynthesisVoice | null = null
function pickFrenchVoice(): SpeechSynthesisVoice | null {
  if (frenchVoice) return frenchVoice
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  frenchVoice =
    voices.find((v) => v.lang === 'fr-FR') ||
    voices.find((v) => v.lang.startsWith('fr')) ||
    null
  return frenchVoice
}

function speakWithBrowser(text: string, rate = 0.9) {
  if (!('speechSynthesis' in window)) return
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'fr-FR'
  // Un débit légèrement ralenti aide l'apprenant débutant.
  utter.rate = rate
  utter.pitch = 1.05
  const voice = pickFrenchVoice()
  if (voice) utter.voice = voice
  window.speechSynthesis.speak(utter)
}

/** Prononce un mot ou une phrase en français. */
export async function speak(text: string, opts: { rate?: number } = {}) {
  stopCurrent()
  if (hasPremiumVoice) {
    const ok = await speakWithElevenLabs(text)
    if (ok) return
  }
  speakWithBrowser(text, opts.rate)
}

// Certains navigateurs chargent les voix de façon asynchrone.
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    frenchVoice = null
    pickFrenchVoice()
  }
}

/* ---- Petits effets sonores de feedback (générés, sans fichier) ---- */
let audioCtx: AudioContext | null = null
function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (AC) audioCtx = new AC()
  }
  return audioCtx
}

function tone(freq: number, start: number, dur: number, gain = 0.15) {
  const c = ctx()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  g.gain.setValueAtTime(0.0001, c.currentTime + start)
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + start + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur)
  osc.connect(g).connect(c.destination)
  osc.start(c.currentTime + start)
  osc.stop(c.currentTime + start + dur + 0.02)
}

/** Carillon joyeux de réussite (do–mi–sol montant). */
export function playCorrect() {
  tone(523, 0, 0.16)
  tone(659, 0.08, 0.16)
  tone(784, 0.16, 0.24)
}

/** Son doux et non punitif d'erreur (deux notes descendantes douces). */
export function playWrong() {
  tone(330, 0, 0.18, 0.1)
  tone(247, 0.12, 0.22, 0.1)
}

/** Fanfare de fin de leçon. */
export function playFanfare() {
  tone(523, 0, 0.18)
  tone(659, 0.12, 0.18)
  tone(784, 0.24, 0.18)
  tone(1046, 0.38, 0.4)
}
