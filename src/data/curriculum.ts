/* ============================================================
   Curriculum de Lumi
   ------------------------------------------------------------
   Conçu pour des enfants du CP au CM2 vivant à l'étranger.
   Hypothèse pédagogique : ces enfants comprennent souvent le
   français à l'oral mais doivent consolider lecture, sons,
   orthographe et vocabulaire de façon ludique.

   Structure : Niveau > Île (thème) > Leçon (3–5 min) > Exercices.
   Une leçon courte respecte le temps d'attention (5–8 min max).
   Chaque leçon mélange PLUSIEURS méthodes pour garder l'intérêt.
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
  | SpellExercise // orthographe : je complète/écris le mot

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

/* ============================================================
   CONTENU — CP
   ============================================================ */

const cp: Curriculum = {
  level: 'cp',
  islands: [
    {
      id: 'cp-animaux',
      title: 'Les animaux',
      emoji: '🐾',
      color: 'var(--coral)',
      lessons: [
        {
          id: 'cp-animaux-1',
          title: 'Les animaux de la ferme',
          emoji: '🐔',
          exercises: [
            { type: 'flashcard', word: { fr: 'le chat', emoji: '🐱' } },
            { type: 'flashcard', word: { fr: 'le chien', emoji: '🐶' } },
            { type: 'flashcard', word: { fr: 'la vache', emoji: '🐮' } },
            {
              type: 'pickImage',
              prompt: { fr: 'le chien', emoji: '🐶' },
              options: [
                { fr: 'le chien', emoji: '🐶' },
                { fr: 'le chat', emoji: '🐱' },
                { fr: 'la vache', emoji: '🐮' },
              ],
            },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'le chat', emoji: '🐱' },
                { fr: 'le chien', emoji: '🐶' },
                { fr: 'la vache', emoji: '🐮' },
              ],
            },
            {
              type: 'pickImage',
              prompt: { fr: 'le chat', emoji: '🐱' },
              options: [
                { fr: 'la vache', emoji: '🐮' },
                { fr: 'le chat', emoji: '🐱' },
              ],
            },
          ],
        },
        {
          id: 'cp-animaux-2',
          title: 'Encore des animaux',
          emoji: '🐰',
          exercises: [
            { type: 'flashcard', word: { fr: 'le lapin', emoji: '🐰' } },
            { type: 'flashcard', word: { fr: 'le poisson', emoji: '🐟' } },
            { type: 'flashcard', word: { fr: 'l’oiseau', emoji: '🐦' } },
            {
              type: 'pickImage',
              prompt: { fr: 'le lapin', emoji: '🐰' },
              options: [
                { fr: 'le poisson', emoji: '🐟' },
                { fr: 'le lapin', emoji: '🐰' },
                { fr: 'l’oiseau', emoji: '🐦' },
              ],
            },
            {
              type: 'spell',
              word: { fr: 'lapin', emoji: '🐰' },
              missing: [0],
            },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'le lapin', emoji: '🐰' },
                { fr: 'le poisson', emoji: '🐟' },
                { fr: 'l’oiseau', emoji: '🐦' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'cp-couleurs',
      title: 'Les couleurs',
      emoji: '🎨',
      color: 'var(--grape)',
      lessons: [
        {
          id: 'cp-couleurs-1',
          title: 'Rouge, bleu, jaune',
          emoji: '🔴',
          exercises: [
            { type: 'flashcard', word: { fr: 'rouge', emoji: '🔴' } },
            { type: 'flashcard', word: { fr: 'bleu', emoji: '🔵' } },
            { type: 'flashcard', word: { fr: 'jaune', emoji: '🟡' } },
            { type: 'flashcard', word: { fr: 'vert', emoji: '🟢' } },
            {
              type: 'pickImage',
              prompt: { fr: 'bleu', emoji: '🔵' },
              options: [
                { fr: 'rouge', emoji: '🔴' },
                { fr: 'bleu', emoji: '🔵' },
                { fr: 'vert', emoji: '🟢' },
                { fr: 'jaune', emoji: '🟡' },
              ],
            },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'rouge', emoji: '🔴' },
                { fr: 'bleu', emoji: '🔵' },
                { fr: 'jaune', emoji: '🟡' },
                { fr: 'vert', emoji: '🟢' },
              ],
            },
            {
              type: 'buildSentence',
              sentence: 'Le ballon est rouge',
              emoji: '🔴',
            },
          ],
        },
      ],
    },
    {
      id: 'cp-sons',
      title: 'Les sons',
      emoji: '👂',
      color: 'var(--teal)',
      lessons: [
        {
          id: 'cp-sons-1',
          title: 'J’écoute les mots',
          emoji: '🔤',
          exercises: [
            {
              type: 'listenWord',
              answer: 'chat',
              options: ['chat', 'rat'],
            },
            {
              type: 'listenWord',
              answer: 'poule',
              options: ['poule', 'boule', 'roule'],
            },
            {
              type: 'listenWord',
              answer: 'lune',
              options: ['lune', 'dune'],
            },
            {
              type: 'spell',
              word: { fr: 'chat', emoji: '🐱' },
              missing: [0],
            },
            {
              type: 'spell',
              word: { fr: 'lune', emoji: '🌙' },
              missing: [0, 2],
            },
          ],
        },
      ],
    },
    {
      id: 'cp-nombres',
      title: 'Les nombres',
      emoji: '🔢',
      color: 'var(--sky)',
      lessons: [
        {
          id: 'cp-nombres-1',
          title: 'Compter jusqu’à 5',
          emoji: '✋',
          exercises: [
            { type: 'flashcard', word: { fr: 'un', emoji: '1️⃣' } },
            { type: 'flashcard', word: { fr: 'deux', emoji: '2️⃣' } },
            { type: 'flashcard', word: { fr: 'trois', emoji: '3️⃣' } },
            {
              type: 'pickImage',
              prompt: { fr: 'trois', emoji: '3️⃣' },
              options: [
                { fr: 'un', emoji: '1️⃣' },
                { fr: 'deux', emoji: '2️⃣' },
                { fr: 'trois', emoji: '3️⃣' },
              ],
            },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'un', emoji: '1️⃣' },
                { fr: 'deux', emoji: '2️⃣' },
                { fr: 'trois', emoji: '3️⃣' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

/* ============================================================
   CONTENU — CE1
   ============================================================ */

const ce1: Curriculum = {
  level: 'ce1',
  islands: [
    {
      id: 'ce1-famille',
      title: 'La famille',
      emoji: '👨‍👩‍👧',
      color: 'var(--coral)',
      lessons: [
        {
          id: 'ce1-famille-1',
          title: 'Ma famille',
          emoji: '🏠',
          exercises: [
            { type: 'flashcard', word: { fr: 'la maman', emoji: '👩' } },
            { type: 'flashcard', word: { fr: 'le papa', emoji: '👨' } },
            { type: 'flashcard', word: { fr: 'la sœur', emoji: '👧' } },
            { type: 'flashcard', word: { fr: 'le frère', emoji: '👦' } },
            {
              type: 'buildSentence',
              sentence: 'J’aime ma maman',
              emoji: '❤️',
            },
            {
              type: 'buildSentence',
              sentence: 'Mon papa est grand',
              emoji: '👨',
            },
            {
              type: 'spell',
              word: { fr: 'frère', emoji: '👦' },
              missing: [2],
            },
          ],
        },
      ],
    },
    {
      id: 'ce1-verbes',
      title: 'Les actions',
      emoji: '🏃',
      color: 'var(--teal)',
      lessons: [
        {
          id: 'ce1-verbes-1',
          title: 'Je fais des actions',
          emoji: '⭐',
          exercises: [
            { type: 'flashcard', word: { fr: 'manger', emoji: '🍽️' } },
            { type: 'flashcard', word: { fr: 'dormir', emoji: '😴' } },
            { type: 'flashcard', word: { fr: 'courir', emoji: '🏃' } },
            { type: 'flashcard', word: { fr: 'jouer', emoji: '⚽' } },
            {
              type: 'pickImage',
              prompt: { fr: 'dormir', emoji: '😴' },
              options: [
                { fr: 'manger', emoji: '🍽️' },
                { fr: 'dormir', emoji: '😴' },
                { fr: 'courir', emoji: '🏃' },
                { fr: 'jouer', emoji: '⚽' },
              ],
            },
            {
              type: 'buildSentence',
              sentence: 'Je joue dans le jardin',
              emoji: '⚽',
            },
            {
              type: 'buildSentence',
              sentence: 'Le chat aime dormir',
              emoji: '😴',
            },
          ],
        },
      ],
    },
    {
      id: 'ce1-ecole',
      title: 'À l’école',
      emoji: '🎒',
      color: 'var(--sun-deep)',
      lessons: [
        {
          id: 'ce1-ecole-1',
          title: 'Dans mon cartable',
          emoji: '✏️',
          exercises: [
            { type: 'flashcard', word: { fr: 'le crayon', emoji: '✏️' } },
            { type: 'flashcard', word: { fr: 'le livre', emoji: '📕' } },
            { type: 'flashcard', word: { fr: 'la gomme', emoji: '🧽' } },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'le crayon', emoji: '✏️' },
                { fr: 'le livre', emoji: '📕' },
                { fr: 'la gomme', emoji: '🧽' },
              ],
            },
            {
              type: 'spell',
              word: { fr: 'livre', emoji: '📕' },
              missing: [0, 3],
            },
            {
              type: 'buildSentence',
              sentence: 'Je lis un livre',
              emoji: '📕',
            },
          ],
        },
      ],
    },
  ],
}

/* ---- Niveaux à venir : gabarits (débloqués plus tard) ---- */
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
