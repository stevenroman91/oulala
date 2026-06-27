// Minimal production static server for the Vite SPA build (Railway-friendly).
// Serves files from ./dist and falls back to index.html for client-side routing.
// No external dependencies — uses only Node's built-in modules.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = join(fileURLToPath(new URL('.', import.meta.url)), 'dist')
const PORT = process.env.PORT || 3000

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
}

async function sendFile(res, filePath, status = 200) {
  const data = await readFile(filePath)
  const type = MIME[extname(filePath)] || 'application/octet-stream'
  // Long-cache hashed assets; never cache the HTML shell.
  const cache = filePath.includes(`${'/assets/'}`)
    ? 'public, max-age=31536000, immutable'
    : 'no-cache'
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': cache })
  res.end(data)
}

// --- Proxy Text-To-Speech ElevenLabs (clé API gardée côté serveur) ---
// Permet à l'app d'utiliser EXACTEMENT la même voix que l'agent
// conversationnel, sans jamais exposer la clé API au navigateur.
const EL_KEY = process.env.ELEVENLABS_API_KEY
const EL_VOICE = process.env.ELEVENLABS_VOICE_ID
// multilingual_v2 = meilleure qualité de prononciation française avec une VRAIE
// voix française : c'est lui qui prononce correctement les chiffres (« dix »,
// « sept ») et les finales muettes (« loup »). Pas besoin de forcer la langue,
// la voix étant déjà française. Surchargeable via ELEVENLABS_MODEL_ID
// (ex. eleven_turbo_v2_5, qui force language_code=fr si la voix n'est pas FR).
const EL_MODEL = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2'
// language_code n'est supporté/utile que sur turbo / flash.
const EL_FORCE_FR = /turbo|flash/.test(EL_MODEL)

function readBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (c) => {
      data += c
      if (data.length > 1e5) req.destroy() // garde-fou
    })
    req.on('end', () => resolve(data))
    req.on('error', () => resolve(''))
  })
}

// Appelle ElevenLabs et renvoie soit l'audio, soit le détail de l'erreur.
// voiceOverride : pour ESSAYER une autre voix (test A/B via /api/tts?voice=…),
// sans rien redéployer. L'app, elle, utilise toujours EL_VOICE.
async function ttsSynthesize(text, voiceOverride) {
  const voice = voiceOverride || EL_VOICE
  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': EL_KEY,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: EL_MODEL,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        // Force la prononciation française quand le modèle le supporte.
        ...(EL_FORCE_FR ? { language_code: 'fr' } : {}),
      }),
    },
  )
  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '')
    return { ok: false, status: upstream.status, detail }
  }
  return { ok: true, buf: Buffer.from(await upstream.arrayBuffer()) }
}

// Phrase par défaut pour le test audible (GET /api/tts).
const TTS_TEST_TEXT =
  'Bonjour ! Moi, c’est Lumi. On va apprendre le français en s’amusant !'

// Mots courts mal prononcés isolément (homographes anglais, finale muette) :
// on les fait dire avec leur article. Doit rester aligné avec le client.
const PRONUNCIATION = {
  // Doit rester aligné avec src/services/audio.ts.
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
  'la grand-mère': 'la gran-mère',
  'le grand-père': 'le gran-père',
}
function withPronunciation(text) {
  return PRONUNCIATION[String(text).trim().toLowerCase()] || text
}

async function handleTts(req, res, fixedText, voiceOverride) {
  if (!EL_KEY || !EL_VOICE) {
    res.writeHead(503, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'TTS non configuré (clé ou voice id manquant)' }))
    return
  }
  try {
    let text = fixedText
    if (!text) {
      const body = JSON.parse((await readBody(req)) || '{}')
      text = String(body.text || '').slice(0, 400)
    }
    if (!text) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'texte manquant' }))
      return
    }

    const result = await ttsSynthesize(withPronunciation(text), voiceOverride)
    if (!result.ok) {
      // On renvoie le DÉTAIL réel d'ElevenLabs, lisible dans le navigateur,
      // pour diagnostiquer (voice_id introuvable, crédits, clé invalide…).
      res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end(
        `❌ ElevenLabs a refusé la requête (HTTP ${result.status}).\n` +
          `Voice ID utilisé : ${voiceOverride || EL_VOICE}\n` +
          `Modèle : ${EL_MODEL}\n\n` +
          `Réponse d'ElevenLabs :\n${String(result.detail).slice(0, 1000)}`,
      )
      return
    }
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': fixedText ? 'no-cache' : 'public, max-age=86400',
    })
    res.end(result.buf)
  } catch (err) {
    console.error('TTS error', err)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'erreur interne', detail: String(err) }))
  }
}

const server = createServer(async (req, res) => {
  try {
    const path = (req.url || '/').split('?')[0]

    // API : capacités du serveur (toujours 200, pour sonder sans erreur).
    // On expose aussi le voice_id + modèle EMPLOYÉS PAR LE JEU (un voice_id
    // n'est pas secret) pour pouvoir vérifier qu'ils correspondent bien à la
    // voix française attendue. La clé API, elle, n'est jamais exposée.
    if (path === '/api/config') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' })
      res.end(
        JSON.stringify({
          tts: Boolean(EL_KEY && EL_VOICE),
          voiceId: EL_VOICE || null,
          model: EL_MODEL,
          forceFr: EL_FORCE_FR,
        }),
      )
      return
    }

    // API : métadonnées de la voix utilisée par le jeu (langue, accent…).
    // Donne une réponse CERTAINE « la voix est-elle française ? » sans rien
    // écouter — d'après les métadonnées officielles d'ElevenLabs.
    if (path === '/api/voice-info') {
      if (!EL_KEY || !EL_VOICE) {
        res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({ error: 'TTS non configuré' }))
        return
      }
      try {
        const r = await fetch(`https://api.elevenlabs.io/v1/voices/${EL_VOICE}`, {
          headers: { 'xi-api-key': EL_KEY, Accept: 'application/json' },
        })
        const raw = await r.text()
        if (!r.ok) {
          res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end(`Erreur ElevenLabs ${r.status} pour voice ${EL_VOICE} :\n${raw.slice(0, 800)}`)
          return
        }
        const v = JSON.parse(raw)
        const labels = v.labels || {}
        // Verdict simple à partir des métadonnées.
        const lang = (
          labels.language ||
          (v.verified_languages && v.verified_languages[0] && v.verified_languages[0].language) ||
          (v.fine_tuning && v.fine_tuning.language) ||
          ''
        ).toString().toLowerCase()
        const isFrench = /fr|french|français/.test(lang) || /fr|french|français/.test(JSON.stringify(labels).toLowerCase())
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(
          JSON.stringify(
            {
              verdict: lang
                ? isFrench
                  ? '✅ Voix FRANÇAISE'
                  : `⚠️ Voix NON française (langue : ${lang})`
                : '❔ langue non précisée dans les métadonnées (voir labels)',
              name: v.name,
              voiceId: EL_VOICE,
              category: v.category,
              labels,
              verified_languages: v.verified_languages || null,
            },
            null,
            2,
          ),
        )
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'erreur interne', detail: String(err) }))
      }
      return
    }

    // API : synthèse vocale.
    if (path === '/api/tts') {
      // POST : utilisé par l'app. GET : test audible à ouvrir dans le
      // navigateur (joue une phrase de Lumi, ou affiche l'erreur ElevenLabs).
      if (req.method === 'POST') return handleTts(req, res)
      if (req.method === 'GET') {
        // Test audible. ?text=poule pour un mot précis ; ?voice=ID pour
        // ESSAYER une autre voix instantanément (sans redéployer).
        let q = ''
        let voice = ''
        try {
          const sp = new URL(req.url, 'http://localhost').searchParams
          q = sp.get('text') || ''
          voice = sp.get('voice') || ''
        } catch {
          q = ''
        }
        return handleTts(req, res, q.slice(0, 400) || TTS_TEST_TEXT, voice || undefined)
      }
      res.writeHead(405).end()
      return
    }

    const url = decodeURIComponent((req.url || '/').split('?')[0])
    // Prevent path traversal.
    const safePath = normalize(url).replace(/^(\.\.[/\\])+/, '')
    let filePath = join(DIST, safePath)

    let isFile = false
    try {
      isFile = (await stat(filePath)).isFile()
    } catch {
      isFile = false
    }

    if (isFile) {
      await sendFile(res, filePath)
    } else {
      // SPA fallback.
      await sendFile(res, join(DIST, 'index.html'))
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Internal Server Error')
    console.error(err)
  }
})

server.listen(PORT, () => {
  console.log(`Lumi est en ligne sur le port ${PORT} ⭐`)
})
