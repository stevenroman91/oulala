import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { LevelId } from '../data/curriculum'

/* ============================================================
   Profil & progression de l'enfant (persistés en localStorage).
   Pas de compte, pas de mot de passe : l'expérience démarre en
   un clic, ce qui est essentiel pour de jeunes enfants.
   ============================================================ */

export interface LessonResult {
  stars: number // 0–3
  bestScore: number // % de bonnes réponses
}

export interface Profile {
  name: string
  avatar: string
  level: LevelId | null
  xp: number
  // Progression par leçon : id -> résultat.
  lessons: Record<string, LessonResult>
  streak: number
  lastActiveDate: string | null // AAAA-MM-JJ
  soundOn: boolean
}

const DEFAULT_PROFILE: Profile = {
  name: '',
  avatar: '🦊',
  level: null,
  xp: 0,
  lessons: {},
  streak: 0,
  lastActiveDate: null,
  soundOn: true,
}

const STORAGE_KEY = 'lumi.profile.v1'

function todayStr(): string {
  // Date locale au format AAAA-MM-JJ (sans dépendance externe).
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00')
  const db = new Date(b + 'T00:00:00')
  return Math.round((db.getTime() - da.getTime()) / 86400000)
}

function load(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROFILE
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_PROFILE
  }
}

interface ProfileContextValue {
  profile: Profile
  isOnboarded: boolean
  createProfile: (data: { name: string; avatar: string; level: LevelId }) => void
  setLevel: (level: LevelId) => void
  recordLesson: (lessonId: string, stars: number, scorePct: number) => void
  toggleSound: () => void
  reset: () => void
}

const Ctx = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch {
      /* stockage indisponible : on continue sans persistance */
    }
  }, [profile])

  const createProfile = useCallback(
    (data: { name: string; avatar: string; level: LevelId }) => {
      setProfile((p) => ({ ...p, ...data }))
    },
    [],
  )

  const setLevel = useCallback((level: LevelId) => {
    setProfile((p) => ({ ...p, level }))
  }, [])

  const recordLesson = useCallback(
    (lessonId: string, stars: number, scorePct: number) => {
      setProfile((p) => {
        const prev = p.lessons[lessonId]
        const bestStars = Math.max(prev?.stars ?? 0, stars)
        const bestScore = Math.max(prev?.bestScore ?? 0, scorePct)

        // XP : 10 par leçon terminée + 5 par étoile, seulement si on
        // progresse (on ne farme pas l'XP en rejouant une leçon déjà max).
        const gainedStars = Math.max(0, bestStars - (prev?.stars ?? 0))
        const firstTime = !prev
        const xpGain = (firstTime ? 10 : 0) + gainedStars * 5

        // Série : +1 si nouveau jour consécutif, reset si trou.
        const today = todayStr()
        let streak = p.streak
        if (p.lastActiveDate !== today) {
          if (p.lastActiveDate && daysBetween(p.lastActiveDate, today) === 1) {
            streak = p.streak + 1
          } else {
            streak = 1
          }
        }
        if (!p.lastActiveDate) streak = 1

        return {
          ...p,
          xp: p.xp + xpGain,
          lessons: { ...p.lessons, [lessonId]: { stars: bestStars, bestScore } },
          streak,
          lastActiveDate: today,
        }
      })
    },
    [],
  )

  const toggleSound = useCallback(() => {
    setProfile((p) => ({ ...p, soundOn: !p.soundOn }))
  }, [])

  const reset = useCallback(() => {
    setProfile(DEFAULT_PROFILE)
  }, [])

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      isOnboarded: Boolean(profile.name && profile.level),
      createProfile,
      setLevel,
      recordLesson,
      toggleSound,
      reset,
    }),
    [profile, createProfile, setLevel, recordLesson, toggleSound, reset],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProfile() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProfile doit être utilisé dans ProfileProvider')
  return ctx
}
