import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useProfile } from './state/ProfileContext'
import { Onboarding } from './screens/Onboarding'
import { ProfilePicker } from './screens/ProfilePicker'
import { Home } from './screens/Home'
import { Lesson } from './screens/Lesson'
import { Review } from './screens/Review'

// L'écran « Parle avec Lumi » embarque le SDK ElevenLabs (lourd) : on le
// charge à la demande pour ne pas alourdir le premier affichage.
const Chat = lazy(() => import('./screens/Chat').then((m) => ({ default: m.Chat })))

export default function App() {
  const { hasActive } = useProfile()

  return (
    <div className="app-shell">
      <Routes>
        <Route
          path="/"
          element={hasActive ? <Home /> : <Navigate to="/profils" replace />}
        />
        {/* « Qui joue ? » : choix du compte enfant */}
        <Route path="/profils" element={<ProfilePicker />} />
        {/* Création d'un nouveau compte */}
        <Route path="/bienvenue" element={<Onboarding />} />
        <Route path="/lecon/:lessonId" element={<Lesson />} />
        <Route path="/revision" element={<Review />} />
        <Route
          path="/parler"
          element={
            <Suspense fallback={<div className="center" style={{ paddingTop: 80 }}>Lumi arrive… 🦊</div>}>
              <Chat />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
