import { Navigate, Route, Routes } from 'react-router-dom'
import { useProfile } from './state/ProfileContext'
import { Onboarding } from './screens/Onboarding'
import { Home } from './screens/Home'
import { Lesson } from './screens/Lesson'
import { Chat } from './screens/Chat'

export default function App() {
  const { isOnboarded } = useProfile()

  return (
    <div className="app-shell">
      <Routes>
        <Route
          path="/"
          element={isOnboarded ? <Home /> : <Navigate to="/bienvenue" replace />}
        />
        <Route
          path="/bienvenue"
          element={isOnboarded ? <Navigate to="/" replace /> : <Onboarding />}
        />
        <Route path="/lecon/:lessonId" element={<Lesson />} />
        <Route path="/parler" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
