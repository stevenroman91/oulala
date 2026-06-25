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
const EL_MODEL = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2'

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

async function handleTts(req, res) {
  if (!EL_KEY || !EL_VOICE) {
    res.writeHead(503, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'TTS non configuré' }))
    return
  }
  try {
    const body = JSON.parse((await readBody(req)) || '{}')
    const text = String(body.text || '').slice(0, 400)
    if (!text) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'texte manquant' }))
      return
    }
    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE}`,
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
        }),
      },
    )
    if (!upstream.ok) {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'erreur ElevenLabs', status: upstream.status }))
      return
    }
    const buf = Buffer.from(await upstream.arrayBuffer())
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
    })
    res.end(buf)
  } catch (err) {
    console.error('TTS error', err)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'erreur interne' }))
  }
}

const server = createServer(async (req, res) => {
  try {
    const path = (req.url || '/').split('?')[0]

    // API : capacités du serveur (toujours 200, pour sonder sans erreur).
    if (path === '/api/config') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' })
      res.end(JSON.stringify({ tts: Boolean(EL_KEY && EL_VOICE) }))
      return
    }

    // API : synthèse vocale.
    if (path === '/api/tts') {
      if (req.method === 'POST') return handleTts(req, res)
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
