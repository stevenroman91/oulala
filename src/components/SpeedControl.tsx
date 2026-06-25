import { SPEECH_RATES, useProfile } from '../state/ProfileContext'
import { speak } from '../services/audio'

/* ============================================================
   Contrôle de vitesse compact, à placer À CÔTÉ d'un bouton
   « réécouter » dans les exercices. Change la vitesse globale
   (la même que dans le menu réglages) et, si on passe `preview`,
   rejoue tout de suite le mot/la phrase à la nouvelle vitesse.
   ============================================================ */
export function SpeedControl({ preview }: { preview?: string }) {
  const { profile, setRate } = useProfile()

  return (
    <div
      className="row"
      role="group"
      aria-label="Vitesse de la voix"
      style={{
        gap: 4,
        background: 'var(--cream)',
        borderRadius: 999,
        padding: 4,
      }}
    >
      {SPEECH_RATES.map((r) => {
        const active = Math.abs(profile.rate - r.value) < 0.01
        return (
          <button
            key={r.id}
            onClick={() => {
              setRate(r.value)
              if (preview) speak(preview, { rate: r.value })
            }}
            aria-label={r.label}
            aria-pressed={active}
            title={r.label}
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              fontSize: '1.25rem',
              display: 'grid',
              placeItems: 'center',
              background: active ? 'var(--sun)' : 'transparent',
              boxShadow: active ? '0 3px 0 var(--sun-deep)' : 'none',
              transition: 'background 0.12s',
            }}
          >
            {r.icon}
          </button>
        )
      })}
    </div>
  )
}
