/* ============================================================
   Curriculum de Lumi — types & registre
   ------------------------------------------------------------
   Conçu pour des enfants du CP au CM2 vivant à l'étranger.
   Hypothèse pédagogique : ces enfants comprennent souvent le
   français à l'oral mais doivent consolider lecture, sons,
   orthographe, conjugaison et vocabulaire de façon ludique.

   Structure : Niveau > Île (thème) > Leçon (3–5 min) > Exercices.
   Chaque leçon mélange PLUSIEURS méthodes pour garder l'intérêt.
   Le contenu de chaque niveau vit dans son propre fichier
   (cp.ts, ce1.ts…) pour rester lisible et facile à enrichir.
   ============================================================ */

export type LevelId = 'cp' | 'ce1' | 'ce2' | 'cm1' | 'cm2'

export interface Level {
  id: LevelId
  label: string
  age: string
  color: string
}

export const LEVELS: Level[] = [
  { id: 'cp', label: 'CP', age: '6–7 ans', color: 'var(--coral)' },
  { id: 'ce1', label: 'CE1', age: '7–8 ans', color: 'var(--teal)' },
  { id: 'ce2', label: 'CE2', age: '8–9 ans', color: 'var(--grape)' },
  { id: 'cm1', label: 'CM1', age: '9–10 ans', color: 'var(--sky)' },
  { id: 'cm2', label: 'CM2', age: '10–11 ans', color: 'var(--sun-deep)' },
]

/** Un mot illustré : la brique de base du vocabulaire. */
export interface Word {
  fr: string
  emoji: string
}

/* ---- Types d'exercices = autant de méthodes d'apprentissage ---- */

export type Exercise =
  | FlashcardExercise // découverte : voir + entendre + répéter
  | PickImageExercise // compréhension orale : j'entends, je choisis l'image
  | ListenWordExercise // discrimination des sons : quel mot ai-je entendu ?
  | BuildSentenceExercise // syntaxe : je remets la phrase dans l'ordre
  | MatchPairsExercise // mémoire : j'associe mot et image
  | SpellExercise // orthographe / dictée : je complète le mot
  | ConjugateExercise // conjugaison : je choisis la bonne forme du verbe
  | ReadingExercise // lecture : je lis une phrase et je réponds

export interface FlashcardExercise {
  type: 'flashcard'
  word: Word
  hint?: string
}

export interface PickImageExercise {
  type: 'pickImage'
  prompt: Word // le mot à entendre (réponse correcte)
  options: Word[] // 2 à 4 images
}

export interface ListenWordExercise {
  type: 'listenWord'
  answer: string // mot prononcé
  options: string[] // mots proches à l'écrit/au son
}

export interface BuildSentenceExercise {
  type: 'buildSentence'
  sentence: string // phrase cible (les mots seront mélangés)
  emoji?: string
}

export interface MatchPairsExercise {
  type: 'matchPairs'
  pairs: Word[] // 3 à 4 paires mot/image
}

export interface SpellExercise {
  type: 'spell'
  word: Word
  missing: number[] // index des lettres masquées
}

export interface ConjugateExercise {
  type: 'conjugate'
  pronoun: string // « je », « tu », « il/elle », « nous »…
  verb: string // infinitif, ex. « manger »
  answer: string // forme correcte, ex. « mange »
  options: string[] // formes proposées (la bonne + des intrus plausibles)
  emoji?: string
}

export interface ReadingExercise {
  type: 'reading'
  text: string // courte phrase à lire
  emoji?: string
  question: string // question de compréhension
  options: Word[] // réponses illustrées
  answer: string // « fr » de la bonne réponse
}

export interface Lesson {
  id: string
  title: string
  emoji: string
  exercises: Exercise[]
}

export interface Island {
  id: string
  title: string
  emoji: string
  color: string
  lessons: Lesson[]
}

export interface Curriculum {
  level: LevelId
  islands: Island[]
}

/* ---- Registre des niveaux ---- */
import { cp } from './cp'
import { ce1 } from './ce1'

const placeholder = (level: LevelId): Curriculum => ({ level, islands: [] })

export const CURRICULA: Record<LevelId, Curriculum> = {
  cp,
  ce1,
  ce2: placeholder('ce2'),
  cm1: placeholder('cm1'),
  cm2: placeholder('cm2'),
}

export function getCurriculum(level: LevelId): Curriculum {
  return CURRICULA[level]
}

export function findLesson(level: LevelId, lessonId: string) {
  const cur = getCurriculum(level)
  for (const island of cur.islands) {
    const lesson = island.lessons.find((l) => l.id === lessonId)
    if (lesson) return { island, lesson }
  }
  return null
}
