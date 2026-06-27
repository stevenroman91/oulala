import { Navigate, Route, Routes } from 'react-router-dom'
import { useProfile } from './state/ProfileContext'
import { Onboarding } from './screens/Onboarding'
import { ProfilePicker } from './screens/ProfilePicker'
import { Home } from './screens/Home'
import { Lesson } from './screens/Lesson'
import { Review } from './screens/Review'
import { Chat } from './screens/Chat'

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
        <Route path="/parler" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
