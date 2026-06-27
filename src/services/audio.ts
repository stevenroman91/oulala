/* ============================================================
   Service audio de Lumi
   ------------------------------------------------------------
   Un enfant qui apprend le français à l'étranger a besoin
   d'ENTENDRE le mot juste, prononcé clairement, autant de fois
   qu'il veut. L'audio est donc central, pas accessoire.

   Trois fournisseurs de voix, dans l'ordre de préférence :
   1. Proxy serveur « /api/tts » → voix premium ElevenLabs, avec
      la MÊME voix que l'agent conversationnel (clé API gardée
      SECRÈTE côté serveur, jamais exposée au navigateur).
   2. Web Speech API du navigateur (gratuit, hors-ligne) sinon.

   `speak()` renvoie une Promise résolue À LA FIN de la lecture :
   on peut donc attendre que la voix finisse avant d'enchaîner.

   L'app reste 100% jouable sans aucune configuration.
   ============================================================ */

// Réglages globaux pilotés par le profil (voir ProfileContext).
// 1 = vitesse normale (multiplicateur appliqué premium + navigateur).
let defaultRate = 1
let muted = false

// Quelques mots courts isolés sont mal prononcés par les TTS (homographes de
// l'anglais comme « chat », ou consonne finale muette comme « loup »). On les
// fait dire avec leur article, forme confirmée comme correcte, sans changer
// ce qui est affiché à l'écran. (Aussi appliqué côté serveur, voir server.js.)
const PRONUNCIATION: Record<string, string> = {
  // MOTS ISOLÉS à finale muette / nasale ou homographes de l'anglais : l'article
  // donne le contexte français et corrige la prononciation (au pire, ajoute un
  // « le/la/un » inoffensif). Audité sur tout le contenu (listenWord + dictée).
  chat: 'le chat',
  rat: 'le rat',
  loup: 'le loup',
  lit: 'le lit',
  pont: 'le pont',
  pain: 'le pain',
  pin: 'le pin',
  bain: 'le bain',
  gant: 'le gant',
  roi: 'le roi',
  nez: 'le nez',
  main: 'la main',
  maison: 'la maison',
  ballon: 'le ballon',
  crayon: 'le crayon',
  lapin: 'le lapin',
  ami: 'un ami',
  // MOTS COMPOSÉS : « grand-mère/père » — le moteur féminise « grand » →
  // « grande ». Forme phonétique sans « d » pour garder le « grand » nasal/muet.
  'la grand-mère': 'la gran-mère',
  'le grand-père': 'le gran-père',
}
function withPronunciation(text: string): string {
  return PRONUNCIATION[text.trim().toLowerCase()] ?? text
}

/** Vitesse de lecture par défaut (0.6 = lent, 1.1 = rapide). */
export function setSpeechRate(rate: number) {
  defaultRate = rate
}

/** Coupe/active toute la voix d'un coup. */
export function setMuted(value: boolean) {
  muted = value
}

// Cache des audios déjà synthétisés (clé = texte + voix).
const cache = new Map<string, string>()
let currentAudio: HTMLAudioElement | null = null

// Sonde unique des capacités du serveur via /api/config (renvoie 200,
// donc aucune erreur réseau en console quand le TTS n'est pas configuré).
let capabilityProbe: Promise<boolean> | null = null
function serverSupportsTts(): Promise<boolean> {
  if (!capabilityProbe) {
    capabilityProbe = fetch('/api/config')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('config'))))
      .then((c) => Boolean(c && c.tts))
      .catch(() => {
        // Échec transitoire : on NE mémorise PAS « pas de premium » (sinon
        // toute la session resterait en voix navigateur). On re-sondera.
        capabilityProbe = null
        return false
      })
  }
  return capabilityProbe
}

function stopCurrent() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

// On SÉRIALISE les appels réseau au proxy : ElevenLabs limite le nombre de
// requêtes simultanées, et plusieurs lectures rapprochées (mot au montage +
// aperçu de vitesse + réécoute) pouvaient en faire échouer certaines, d'où
// des basculements aléatoires sur la voix du navigateur.
let ttsQueue: Promise<unknown> = Promise.resolve()

function fetchTtsUrl(text: string): Promise<string | null> {
  const run = async (): Promise<string | null> => {
    const cached = cache.get(text)
    if (cached) return cached
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const type = res.headers.get('content-type') || ''
      if (!res.ok || !type.includes('audio')) return null
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      cache.set(text, url)
      return url
    } catch {
      return null
    }
  }
  const p = ttsQueue.then(run, run)
  ttsQueue = p.then(
    () => undefined,
    () => undefined,
  )
  return p
}

/** Tente la voix premium via le proxy serveur. Renvoie false si indispo. */
async function playWithServer(text: string, rate: number): Promise<boolean> {
  if (!(await serverSupportsTts())) return false
  const url = await fetchTtsUrl(text)
  if (!url) return false
  try {
    const audio = new Audio(url)
    // Applique la vitesse à la voix premium en préservant la hauteur de voix.
    audio.preservesPitch = true
    ;(audio as unknown as { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true
    audio.playbackRate = Math.min(2, Math.max(0.5, rate))
    currentAudio = audio
    await new Promise<void>((resolve) => {
      audio.onended = () => resolve()
      audio.onerror = () => resolve()
      audio.play().catch(() => resolve())
    })
    return true
  } catch {
    return false
  }
}

let cachedFrenchVoice: SpeechSynthesisVoice | null = null
let frenchVoiceMissing = false

/** Vrai si aucune voix française n'est installée sur l'appareil — dans ce
 *  cas, seule la voix premium ElevenLabs donne une vraie prononciation. */
export function isFrenchVoiceMissing(): boolean {
  return frenchVoiceMissing
}

function chooseFrench(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const fr = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('fr'))
  if (!fr.length) return null
  return (
    fr.find((v) => v.lang.toLowerCase() === 'fr-fr') ||
    fr.find((v) => /fran|french/i.test(v.name)) ||
    fr[0]
  )
}

// Les voix se chargent souvent de façon ASYNCHRONE : la première lecture
// peut partir avant qu'elles soient prêtes → voix anglaise par défaut.
function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve([])
    const now = window.speechSynthesis.getVoices()
    if (now.length) return resolve(now)
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve(window.speechSynthesis.getVoices())
    }
    try {
      window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true })
    } catch {
      /* navigateur sans addEventListener sur speechSynthesis */
    }
    setTimeout(finish, 1200)
  })
}

let voiceResolved = false
async function resolveFrenchVoice(): Promise<SpeechSynthesisVoice | null> {
  if (voiceResolved) return cachedFrenchVoice
  const voices = await getVoicesAsync()
  cachedFrenchVoice = chooseFrench(voices)
  frenchVoiceMissing = !cachedFrenchVoice
  voiceResolved = true
  return cachedFrenchVoice
}

/** Voix du navigateur. Résout quand la lecture est terminée. */
async function speakWithBrowser(text: string, rate: number): Promise<void> {
  if (!('speechSynthesis' in window)) return
  // On s'assure d'avoir une vraie voix française AVANT de parler.
  const voice = await resolveFrenchVoice()
  return new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      resolve()
    }
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'fr-FR'
    utter.rate = rate
    utter.pitch = 1.05
    if (voice) utter.voice = voice
    utter.onend = finish
    utter.onerror = finish
    // Garde-fou : si onend ne se déclenche jamais (certains navigateurs /
    // environnements sans TTS réelle), on libère après une durée estimée.
    const estimateMs = Math.min(9000, 700 + (text.length / Math.max(rate, 0.5)) * 90)
    setTimeout(finish, estimateMs)
    window.speechSynthesis.speak(utter)
  })
}

/**
 * Prononce un mot ou une phrase en français.
 * @returns une Promise résolue à la fin de la lecture.
 */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function speak(
  text: string,
  opts: { rate?: number } = {},
): Promise<void> {
  stopCurrent()
  if (muted || !text) return
  text = withPronunciation(text)

  const rate = opts.rate ?? defaultRate
  const premium = await serverSupportsTts()
  if (premium) {
    // Voix premium configurée : on tente, puis on RÉESSAIE une fois (les
    // échecs sont souvent transitoires : limite de débit/concurrence côté
    // ElevenLabs). On ne bascule JAMAIS sur la voix anglaise du navigateur.
    if (await playWithServer(text, rate)) return
    await delay(300)
    if (await playWithServer(text, rate)) return
    // Dernier recours : voix du navigateur UNIQUEMENT si elle est française,
    // sinon on se tait (mieux vaut le silence qu'une prononciation anglaise).
    const frVoice = await resolveFrenchVoice()
    if (frVoice) await speakWithBrowser(text, rate)
    return
  }

  // Pas de voix premium : on utilise la voix du navigateur (fr si dispo).
  await speakWithBrowser(text, rate)
}

// Les voix arrivent parfois après coup : on réévalue la voix française.
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedFrenchVoice = null
    voiceResolved = false
    void resolveFrenchVoice()
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
  if (!c || muted) return
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
