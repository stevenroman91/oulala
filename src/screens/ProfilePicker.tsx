import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mascot } from '../components/Mascot'
import { useProfile } from '../state/ProfileContext'
import { LEVELS } from '../data/curriculum'

/* « Qui joue ? » — chaque enfant a son compte (juste un prénom), avec sa
   propre progression sauvegardée. Sélection à la Netflix Kids. */
export function ProfilePicker() {
  const { profiles, selectProfile, deleteProfile } = useProfile()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)

  // Aucun profil encore : on va directement créer le premier.
  if (profiles.length === 0) return <Navigate to="/bienvenue" replace />

  return (
    <div className="stack" style={{ paddingTop: 30, gap: 20, flex: 1 }}>
      <div className="center">
        <Mascot mood="wave" size={96} />
      </div>
      <h1 className="center" style={{ fontSize: '1.7rem' }}>
        Qui joue&nbsp;?
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 14,
        }}
      >
        {profiles.map((p) => {
          const lvl = LEVELS.find((l) => l.id === p.level)
          return (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (editing) return
                selectProfile(p.id)
                navigate('/', { replace: true })
              }}
              className="card stack center"
              style={{ gap: 6, padding: 16, position: 'relative' }}
            >
              <div style={{ fontSize: '3.2rem' }}>{p.avatar}</div>
              <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{p.name}</div>
              <div className="muted" style={{ fontWeight: 700, fontSize: '0.78rem' }}>
                {lvl ? `${lvl.label} · ` : ''}⭐ {p.xp}
              </div>
              {editing && (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm(`Supprimer ${p.name} et toute sa progression ?`)) {
                      deleteProfile(p.id)
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: 'var(--coral)',
                    color: '#fff',
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '0.9rem',
                    boxShadow: '0 3px 0 var(--coral-deep)',
                  }}
                >
                  🗑️
                </span>
              )}
            </motion.button>
          )
        })}

        {/* Nouveau joueur */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/bienvenue')}
          className="card stack center"
          style={{ gap: 6, padding: 16, border: '3px dashed var(--cream-deep)' }}
        >
          <div style={{ fontSize: '3.2rem' }}>➕</div>
          <div style={{ fontWeight: 900, fontSize: '1.05rem' }}>Nouveau</div>
          <div className="muted" style={{ fontWeight: 700, fontSize: '0.78rem' }}>
            Créer un compte
          </div>
        </motion.button>
      </div>

      <div className="spacer" />
      <button
        className="btn btn--ghost"
        onClick={() => setEditing((e) => !e)}
        style={{ maxWidth: 240, margin: '0 auto' }}
      >
        {editing ? '✓ Terminé' : '✏️ Modifier'}
      </button>
    </div>
  )
}
