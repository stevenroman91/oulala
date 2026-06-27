import { motion } from 'framer-motion'

/* ============================================================
   La carte de France du voyage de Lumi.
   Une silhouette de l'Hexagone, les étapes positionnées
   géographiquement, un chemin qui se colore au fur et à mesure,
   et Lumi 🦊 (avec son costume) posée sur l'étape en cours.
   ============================================================ */

export interface MapStop {
  id: string
  region: string
  emoji: string
  color: string
  coord: { x: number; y: number }
  done: boolean
}

// Silhouette simplifiée mais reconnaissable de la France métropolitaine
// (l'Hexagone) — viewBox 0..100. Tracé dans le sens horaire depuis le nord :
// frontière est (Alsace), pointe des Alpes au SE, côte méditerranéenne,
// Pyrénées au sud, côte atlantique, pointe de la Bretagne à l'ouest, Cotentin.
const FRANCE_OUTLINE =
  '57,2 62,5 75,13 84,16 95,26 95,36 92,40 91,47 92,54 92,63 94,75 80,80 69,79 62,84 62,86 50,87 42,86 27,79 29,66 29,56 29,50 25,47 22,39 15,37 3,32 6,26 23,26 26,21 26,14 29,18 39,16 47,12 53,3'

export function FranceMap({
  stops,
  currentId,
  avatar,
  onSelect,
}: {
  stops: MapStop[]
  currentId: string | null
  avatar: string
  onSelect: (id: string) => void
}) {
  const currentIndex = Math.max(
    0,
    stops.findIndex((s) => s.id === currentId),
  )
  const lumi = stops[currentIndex] ?? stops[stops.length - 1]
  // Chemin déjà parcouru (jusqu'à l'étape en cours incluse).
  const donePoints = stops
    .slice(0, currentIndex + 1)
    .map((s) => `${s.coord.x},${s.coord.y}`)
    .join(' ')
  const allPoints = stops.map((s) => `${s.coord.x},${s.coord.y}`).join(' ')

  return (
    <div className="card" style={{ borderRadius: 26, padding: 14 }}>
      <div className="row" style={{ gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: '1.3rem' }}>🇫🇷</span>
        <h2 style={{ fontSize: '1.05rem' }}>Le voyage de Lumi en France</h2>
      </div>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Mer / fond */}
        <rect x="0" y="0" width="100" height="100" rx="6" fill="rgba(77,171,247,0.10)" />
        {/* Terre */}
        <polygon
          points={FRANCE_OUTLINE}
          fill="rgba(47,191,113,0.16)"
          stroke="rgba(58,46,42,0.25)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        {/* Chemin complet (pointillés) */}
        <polyline
          points={allPoints}
          fill="none"
          stroke="rgba(58,46,42,0.25)"
          strokeWidth="1.1"
          strokeDasharray="2 2"
          strokeLinecap="round"
        />
        {/* Chemin parcouru */}
        <polyline
          points={donePoints}
          fill="none"
          stroke="var(--good)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Étapes */}
        {stops.map((s, i) => {
          const isCurrent = i === currentIndex
          return (
            <g
              key={s.id}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect(s.id)}
            >
              {isCurrent && (
                <motion.circle
                  cx={s.coord.x}
                  cy={s.coord.y}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="1"
                  initial={{ r: 6, opacity: 0.8 }}
                  animate={{ r: [6, 9, 6], opacity: [0.8, 0.2, 0.8] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
              )}
              <circle
                cx={s.coord.x}
                cy={s.coord.y}
                r="5"
                fill={s.done ? s.color : '#fff'}
                stroke={s.color}
                strokeWidth="1.2"
              />
              <text
                x={s.coord.x}
                y={s.coord.y + 2}
                fontSize="5"
                textAnchor="middle"
              >
                {s.done ? '⭐' : s.emoji}
              </text>
            </g>
          )
        })}
        {/* Lumi sur l'étape en cours */}
        {lumi && (
          <motion.text
            x={lumi.coord.x}
            y={lumi.coord.y - 6}
            fontSize="8"
            textAnchor="middle"
            animate={{ y: [lumi.coord.y - 6, lumi.coord.y - 8, lumi.coord.y - 6] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            {avatar}
          </motion.text>
        )}
      </svg>
    </div>
  )
}
