/** Mélange une copie d'un tableau (Fisher–Yates). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Contrat commun à tous les exercices. */
export interface ExerciseProps {
  /** Appelé quand l'enfant a réussi l'exercice. */
  onDone: (correctFirstTry: boolean) => void
  /** Le son est-il activé ? (consignes, mots) */
  soundOn: boolean
}
