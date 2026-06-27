import type { Exercise, Lesson, Word } from './curriculum'
import type { Profile } from '../state/ProfileContext'

/* ============================================================
   Moteur de révision (répétition espacée).
   ------------------------------------------------------------
   - lessonWords : quels mots une leçon enseigne (à mémoriser).
   - selectReviewWords : quels mots réviser maintenant (les plus
     « en retard » d'abord).
   - buildReviewExercises : fabrique une séance d'exercices variés
     à partir de ces mots, en réutilisant les composants existants.
   C'est ce qui transforme un contenu fini en séances quasi infinies.
   ============================================================ */

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

/** Tous les mots illustrés enseignés par une leçon (sans doublon). */
export function lessonWords(lesson: Lesson): Word[] {
  const out: Word[] = []
  const seen = new Set<string>()
  const add = (w?: Word) => {
    if (w && w.emoji && !seen.has(w.fr)) {
      seen.add(w.fr)
      out.push(w)
    }
  }
  for (const ex of lesson.exercises) {
    switch (ex.type) {
      case 'flashcard':
        add(ex.word)
        break
      case 'pickImage':
        add(ex.prompt)
        ex.options.forEach(add)
        break
      case 'matchPairs':
      case 'memory':
        ex.pairs.forEach(add)
        break
      case 'spell':
        add(ex.word)
        break
      case 'sort':
        ex.items.forEach((i) => add(i.word))
        break
      case 'intruder':
        ex.options.forEach(add)
        break
      // listenWord / buildSentence / conjugate / reading : pas de mot illustré simple
    }
  }
  return out
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Nombre de mots dont la révision est due aujourd'hui. */
export function dueCount(profile: Profile): number {
  const today = todayStr()
  return Object.values(profile.words).filter((m) => m.due <= today).length
}

/** Sélectionne les mots à réviser : les plus en retard d'abord. */
export function selectReviewWords(profile: Profile, max = 10): Word[] {
  const entries = Object.entries(profile.words)
  entries.sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : 0))
  return entries.slice(0, max).map(([fr, m]) => ({ fr, emoji: m.emoji }))
}

/** Un exercice de révision, associé au mot qu'il fait travailler. */
export interface ReviewItem {
  exercise: Exercise
  wordFr: string
}

function distractors(target: Word, pool: Word[], n: number): Word[] {
  return shuffle(pool.filter((w) => w.fr !== target.fr)).slice(0, n)
}

/** Fabrique une séance d'exercices variés à partir des mots à réviser. */
export function buildReviewExercises(words: Word[], pool: Word[]): ReviewItem[] {
  const items: ReviewItem[] = []
  words.forEach((word, i) => {
    const singleToken = !word.fr.includes(' ') && !word.fr.includes('-')
    // On alterne les mécaniques pour garder l'intérêt.
    const kind = i % 3

    if (kind === 0 || pool.length < 3) {
      // J'entends, je choisis la bonne image.
      const opts = shuffle([word, ...distractors(word, pool, 3)])
      items.push({
        wordFr: word.fr,
        exercise: { type: 'pickImage', prompt: word, options: opts },
      })
    } else if (kind === 1) {
      // Quel mot entends-tu ? (lecture / discrimination)
      const opts = shuffle([word.fr, ...distractors(word, pool, 2).map((d) => d.fr)])
      items.push({
        wordFr: word.fr,
        exercise: { type: 'listenWord', answer: word.fr, options: opts },
      })
    } else if (singleToken) {
      // J'écris le mot (une lettre sur deux masquée).
      const missing = word.fr
        .split('')
        .map((_, idx) => idx)
        .filter((idx) => idx % 2 === 0)
      items.push({
        wordFr: word.fr,
        exercise: { type: 'spell', word, missing: missing.length ? missing : [0] },
      })
    } else {
      const opts = shuffle([word, ...distractors(word, pool, 3)])
      items.push({
        wordFr: word.fr,
        exercise: { type: 'pickImage', prompt: word, options: opts },
      })
    }
  })
  return items
}
