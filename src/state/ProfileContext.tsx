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
import { setMuted, setSpeechRate } from '../services/audio'

/* ============================================================
   Profil & progression de l'enfant (persistés en localStorage).
   Pas de compte, pas de mot de passe : l'expérience démarre en
   un clic, ce qui est essentiel pour de jeunes enfants.
   ============================================================ */

export interface LessonResult {
  stars: number // 0–3
  bestScore: number // % de bonnes réponses
}

/** Mémoire d'un mot pour la répétition espacée (système de Leitner). */
export interface WordMemory {
  emoji: string
  level: number // 0 = fragile → plus haut = bien su
  due: string // prochaine révision (AAAA-MM-JJ)
}

export interface Profile {
  name: string
  avatar: string
  level: LevelId | null
  xp: number
  // Progression par leçon : id -> résultat.
  lessons: Record<string, LessonResult>
  // Mémoire des mots appris (clé = mot affiché) pour la révision espacée.
  words: Record<string, WordMemory>
  streak: number
  lastActiveDate: string | null // AAAA-MM-JJ
  // Objectif du jour : XP gagnés aujourd'hui.
  daily: { date: string; xp: number }
  soundOn: boolean
  rate: number // vitesse de lecture de la voix (0.6 lent → 1.1 rapide)
}

/** Intervalles de révision (en jours) selon le niveau de maîtrise. */
const LEITNER_DAYS = [1, 2, 4, 8, 16, 30]
/** Objectif d'XP quotidien (la « quête du jour »). */
export const DAILY_GOAL = 30

/** Vitesses proposées à l'enfant (multiplicateur : 1 = normal). S'applique
 *  à la voix premium (playbackRate) comme à la voix du navigateur. */
export const SPEECH_RATES = [
  { id: 'slow', label: 'Lent', icon: '🐢', value: 0.7 },
  { id: 'normal', label: 'Normal', icon: '🙂', value: 1 },
  { id: 'fast', label: 'Rapide', icon: '🐇', value: 1.3 },
] as const

/** Renvoie la vitesse proposée la plus proche d'une valeur (robuste aux
 *  anciens profils enregistrés avec d'autres valeurs). */
export function closestRate(value: number) {
  return SPEECH_RATES.reduce((a, b) =>
    Math.abs(b.value - value) < Math.abs(a.value - value) ? b : a,
  )
}

const DEFAULT_PROFILE: Profile = {
  name: '',
  avatar: '🦊',
  level: null,
  xp: 0,
  lessons: {},
  words: {},
  streak: 0,
  lastActiveDate: null,
  daily: { date: '', xp: 0 },
  soundOn: true,
  rate: 1,
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

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

/** XP du jour, remis à zéro si on change de journée. */
function bumpDaily(daily: Profile['daily'], gain: number): Profile['daily'] {
  const today = todayStr()
  if (daily.date !== today) return { date: today, xp: gain }
  return { date: today, xp: daily.xp + gain }
}

/** Met à jour la série (jours consécutifs) au passage d'une activité. */
function touchStreak(p: Profile): { streak: number; lastActiveDate: string } {
  const today = todayStr()
  if (p.lastActiveDate === today) return { streak: p.streak, lastActiveDate: today }
  if (p.lastActiveDate && daysBetween(p.lastActiveDate, today) === 1)
    return { streak: p.streak + 1, lastActiveDate: today }
  return { streak: 1, lastActiveDate: today }
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
  learnWords: (words: { fr: string; emoji: string }[]) => void
  reviewWord: (fr: string, correct: boolean) => void
  toggleSound: () => void
  setRate: (rate: number) => void
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

  // Synchronise les réglages voix avec le service audio.
  useEffect(() => {
    setSpeechRate(profile.rate)
    setMuted(!profile.soundOn)
  }, [profile.rate, profile.soundOn])

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

        const { streak, lastActiveDate } = touchStreak(p)

        return {
          ...p,
          xp: p.xp + xpGain,
          lessons: { ...p.lessons, [lessonId]: { stars: bestStars, bestScore } },
          streak,
          lastActiveDate,
          daily: bumpDaily(p.daily, xpGain),
        }
      })
    },
    [],
  )

  // Mémorise les mots d'une leçon terminée (entrée dans la révision espacée).
  const learnWords = useCallback((words: { fr: string; emoji: string }[]) => {
    setProfile((p) => {
      const today = todayStr()
      const next = { ...p.words }
      for (const w of words) {
        if (!next[w.fr]) next[w.fr] = { emoji: w.emoji, level: 0, due: today }
        else next[w.fr] = { ...next[w.fr], emoji: w.emoji }
      }
      return { ...p, words: next }
    })
  }, [])

  // Met à jour la mémoire d'un mot après une révision (Leitner).
  const reviewWord = useCallback((fr: string, correct: boolean) => {
    setProfile((p) => {
      const mem = p.words[fr]
      if (!mem) return p
      const today = todayStr()
      const level = correct ? Math.min(mem.level + 1, LEITNER_DAYS.length - 1) : 0
      const due = addDays(today, LEITNER_DAYS[level])
      const xpGain = correct ? 2 : 0
      const { streak, lastActiveDate } = touchStreak(p)
      return {
        ...p,
        words: { ...p.words, [fr]: { ...mem, level, due } },
        xp: p.xp + xpGain,
        daily: bumpDaily(p.daily, xpGain),
        streak,
        lastActiveDate,
      }
    })
  }, [])

  const toggleSound = useCallback(() => {
    setProfile((p) => ({ ...p, soundOn: !p.soundOn }))
  }, [])

  const setRate = useCallback((rate: number) => {
    setProfile((p) => ({ ...p, rate }))
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
      learnWords,
      reviewWord,
      toggleSound,
      setRate,
      reset,
    }),
    [
      profile,
      createProfile,
      setLevel,
      recordLesson,
      learnWords,
      reviewWord,
      toggleSound,
      setRate,
      reset,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProfile() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProfile doit être utilisé dans ProfileProvider')
  return ctx
}
