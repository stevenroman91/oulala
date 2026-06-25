import type { Curriculum } from './curriculum'

/* ============================================================
   CONTENU — CE1 (7–8 ans)
   ------------------------------------------------------------
   Objectif : CONSOLIDER la lecture et entrer dans la grammaire.
   On élargit le vocabulaire, on lit des phrases plus longues,
   on découvre la CONJUGAISON (être, avoir, verbes en -er au
   présent) et on s'entraîne à la DICTÉE de mots.
   ============================================================ */

export const ce1: Curriculum = {
  level: 'ce1',
  islands: [
    /* -------------------------------------------------- LA FAMILLE */
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
            { type: 'buildSentence', sentence: 'J’aime ma grande sœur', emoji: '👧' },
            { type: 'buildSentence', sentence: 'Mon papa est très grand', emoji: '👨' },
            { type: 'spell', word: { fr: 'frère', emoji: '👦' }, missing: [2, 3] },
          ],
        },
        {
          id: 'ce1-famille-2',
          title: 'Les grands-parents',
          emoji: '👵',
          exercises: [
            { type: 'flashcard', word: { fr: 'la grand-mère', emoji: '👵' } },
            { type: 'flashcard', word: { fr: 'le grand-père', emoji: '👴' } },
            { type: 'flashcard', word: { fr: 'le cousin', emoji: '🧒' } },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'la grand-mère', emoji: '👵' },
                { fr: 'le grand-père', emoji: '👴' },
                { fr: 'le bébé', emoji: '👶' },
              ],
            },
            { type: 'reading', text: 'Ma grand-mère fait un gâteau.', emoji: '🍰', question: 'Que fait grand-mère ?', options: [{ fr: 'un gâteau', emoji: '🍰' }, { fr: 'un dessin', emoji: '🖍️' }], answer: 'un gâteau' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LES ACTIONS */
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
            { type: 'buildSentence', sentence: 'Je joue dans le jardin', emoji: '⚽' },
            { type: 'buildSentence', sentence: 'Le chat aime dormir', emoji: '😴' },
          ],
        },
        {
          id: 'ce1-verbes-2',
          title: 'D’autres actions',
          emoji: '🎨',
          exercises: [
            { type: 'flashcard', word: { fr: 'chanter', emoji: '🎤' } },
            { type: 'flashcard', word: { fr: 'danser', emoji: '💃' } },
            { type: 'flashcard', word: { fr: 'dessiner', emoji: '🖍️' } },
            { type: 'flashcard', word: { fr: 'lire', emoji: '📖' } },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'chanter', emoji: '🎤' },
                { fr: 'danser', emoji: '💃' },
                { fr: 'dessiner', emoji: '🖍️' },
                { fr: 'lire', emoji: '📖' },
              ],
            },
            { type: 'buildSentence', sentence: 'Elle chante une jolie chanson', emoji: '🎤' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LA CONJUGAISON */
    {
      id: 'ce1-conjugaison',
      title: 'La conjugaison',
      emoji: '🧩',
      color: 'var(--grape)',
      lessons: [
        {
          id: 'ce1-conj-er',
          title: 'Les verbes en -er',
          emoji: '🗣️',
          exercises: [
            { type: 'conjugate', pronoun: 'je', verb: 'manger', answer: 'mange', options: ['mange', 'manges', 'mangent'], emoji: '🍽️' },
            { type: 'conjugate', pronoun: 'tu', verb: 'manger', answer: 'manges', options: ['mange', 'manges', 'mangez'], emoji: '🍽️' },
            { type: 'conjugate', pronoun: 'il', verb: 'jouer', answer: 'joue', options: ['joue', 'joues', 'jouons'], emoji: '⚽' },
            { type: 'conjugate', pronoun: 'tu', verb: 'chanter', answer: 'chantes', options: ['chante', 'chantes', 'chantent'], emoji: '🎤' },
            { type: 'conjugate', pronoun: 'nous', verb: 'jouer', answer: 'jouons', options: ['jouons', 'jouez', 'joue'], emoji: '⚽' },
            { type: 'buildSentence', sentence: 'Tu joues avec le chien', emoji: '🐶' },
          ],
        },
        {
          id: 'ce1-conj-etre',
          title: 'Le verbe « être »',
          emoji: '🌟',
          exercises: [
            { type: 'conjugate', pronoun: 'je', verb: 'être', answer: 'suis', options: ['suis', 'es', 'est'], emoji: '😊' },
            { type: 'conjugate', pronoun: 'tu', verb: 'être', answer: 'es', options: ['es', 'est', 'suis'], emoji: '😊' },
            { type: 'conjugate', pronoun: 'il', verb: 'être', answer: 'est', options: ['est', 'es', 'sont'], emoji: '😊' },
            { type: 'conjugate', pronoun: 'nous', verb: 'être', answer: 'sommes', options: ['sommes', 'êtes', 'sont'], emoji: '😊' },
            { type: 'buildSentence', sentence: 'Je suis très content', emoji: '😄' },
          ],
        },
        {
          id: 'ce1-conj-avoir',
          title: 'Le verbe « avoir »',
          emoji: '🎁',
          exercises: [
            { type: 'conjugate', pronoun: 'j’', verb: 'avoir', answer: 'ai', options: ['ai', 'as', 'a'], emoji: '🎁' },
            { type: 'conjugate', pronoun: 'tu', verb: 'avoir', answer: 'as', options: ['as', 'a', 'ai'], emoji: '🎁' },
            { type: 'conjugate', pronoun: 'elle', verb: 'avoir', answer: 'a', options: ['a', 'as', 'ont'], emoji: '🎁' },
            { type: 'conjugate', pronoun: 'nous', verb: 'avoir', answer: 'avons', options: ['avons', 'avez', 'ont'], emoji: '🎁' },
            { type: 'buildSentence', sentence: 'J’ai un beau cadeau', emoji: '🎁' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- À L'ÉCOLE */
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
            { type: 'flashcard', word: { fr: 'le cahier', emoji: '📓' } },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'le crayon', emoji: '✏️' },
                { fr: 'le livre', emoji: '📕' },
                { fr: 'la gomme', emoji: '🧽' },
                { fr: 'le cahier', emoji: '📓' },
              ],
            },
            { type: 'spell', word: { fr: 'livre', emoji: '📕' }, missing: [0, 3] },
            { type: 'buildSentence', sentence: 'Je lis un grand livre', emoji: '📕' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LA NATURE */
    {
      id: 'ce1-nature',
      title: 'La nature',
      emoji: '🌳',
      color: 'var(--good)',
      lessons: [
        {
          id: 'ce1-nature-1',
          title: 'Dehors',
          emoji: '🌞',
          exercises: [
            { type: 'flashcard', word: { fr: 'le soleil', emoji: '☀️' } },
            { type: 'flashcard', word: { fr: 'l’arbre', emoji: '🌳' } },
            { type: 'flashcard', word: { fr: 'la fleur', emoji: '🌸' } },
            { type: 'flashcard', word: { fr: 'la pluie', emoji: '🌧️' } },
            {
              type: 'pickImage',
              prompt: { fr: 'la fleur', emoji: '🌸' },
              options: [
                { fr: 'le soleil', emoji: '☀️' },
                { fr: 'la fleur', emoji: '🌸' },
                { fr: 'l’arbre', emoji: '🌳' },
                { fr: 'la pluie', emoji: '🌧️' },
              ],
            },
            { type: 'reading', text: 'Il pleut sur le jardin.', emoji: '🌧️', question: 'Quel temps fait-il ?', options: [{ fr: 'il pleut', emoji: '🌧️' }, { fr: 'il fait soleil', emoji: '☀️' }], answer: 'il pleut' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LECTURE */
    {
      id: 'ce1-lecture',
      title: 'Je lis des histoires',
      emoji: '📖',
      color: 'var(--sky)',
      lessons: [
        {
          id: 'ce1-lecture-1',
          title: 'Petites histoires',
          emoji: '✨',
          exercises: [
            { type: 'reading', text: 'Léa mange une pomme rouge.', emoji: '🍎', question: 'Que mange Léa ?', options: [{ fr: 'une pomme', emoji: '🍎' }, { fr: 'une banane', emoji: '🍌' }], answer: 'une pomme' },
            { type: 'reading', text: 'Tom joue au football avec son ami.', emoji: '⚽', question: 'À quoi joue Tom ?', options: [{ fr: 'au football', emoji: '⚽' }, { fr: 'au tennis', emoji: '🎾' }], answer: 'au football' },
            { type: 'buildSentence', sentence: 'Le petit chien dort dans la niche', emoji: '🐶' },
            { type: 'reading', text: 'La maîtresse écrit au tableau.', emoji: '🧑‍🏫', question: 'Où écrit la maîtresse ?', options: [{ fr: 'au tableau', emoji: '📝' }, { fr: 'sur la main', emoji: '✋' }], answer: 'au tableau' },
            { type: 'buildSentence', sentence: 'Nous allons à la plage demain', emoji: '🏖️' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- DICTÉE */
    {
      id: 'ce1-dictee',
      title: 'La dictée',
      emoji: '✏️',
      color: 'var(--grape)',
      lessons: [
        {
          id: 'ce1-dictee-1',
          title: 'J’écris des mots',
          emoji: '🔤',
          exercises: [
            { type: 'spell', word: { fr: 'maison', emoji: '🏠' }, missing: [0, 1, 4, 5] },
            { type: 'spell', word: { fr: 'soleil', emoji: '☀️' }, missing: [0, 1, 2, 3, 4, 5] },
            { type: 'spell', word: { fr: 'cahier', emoji: '📓' }, missing: [0, 1, 4, 5] },
            { type: 'spell', word: { fr: 'fleur', emoji: '🌸' }, missing: [0, 1, 2, 3, 4] },
            { type: 'spell', word: { fr: 'crayon', emoji: '✏️' }, missing: [0, 1, 2, 4, 5] },
          ],
        },
      ],
    },
  ],
}
