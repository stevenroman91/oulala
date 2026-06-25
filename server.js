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

const server = createServer(async (req, res) => {
  try {
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
