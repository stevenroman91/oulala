import type { Curriculum } from './curriculum'

/* ============================================================
   CONTENU — CP (6–7 ans)
   ------------------------------------------------------------
   Objectif de l'année : APPRENDRE À LIRE. On travaille donc
   beaucoup les sons (phonologie), le décodage, un vocabulaire
   concret du quotidien, les premières phrases et la dictée de
   mots simples. Chaque leçon = 3–5 min, plusieurs méthodes.
   ============================================================ */

export const cp: Curriculum = {
  level: 'cp',
  islands: [
    /* -------------------------------------------------- LES SONS */
    {
      id: 'cp-sons',
      title: 'Les sons',
      emoji: '👂',
      color: 'var(--teal)',
      lessons: [
        {
          id: 'cp-sons-1',
          title: 'Les voyelles a, i, o',
          emoji: '🅰️',
          exercises: [
            { type: 'flashcard', word: { fr: 'a', emoji: '🍍' }, hint: 'a comme dans « ananas »' },
            { type: 'flashcard', word: { fr: 'i', emoji: '🏝️' }, hint: 'i comme dans « île »' },
            { type: 'flashcard', word: { fr: 'o', emoji: '🦴' }, hint: 'o comme dans « os »' },
            { type: 'listenWord', answer: 'ami', options: ['ami', 'oma'] },
            { type: 'listenWord', answer: 'lila', options: ['lila', 'lilo', 'lola'] },
            { type: 'spell', word: { fr: 'ami', emoji: '🧑‍🤝‍🧑' }, missing: [0, 2] },
          ],
        },
        {
          id: 'cp-sons-2',
          title: 'Le son « ou »',
          emoji: '🦉',
          exercises: [
            { type: 'flashcard', word: { fr: 'la roue', emoji: '🛞' } },
            { type: 'flashcard', word: { fr: 'le hibou', emoji: '🦉' } },
            { type: 'flashcard', word: { fr: 'la poule', emoji: '🐔' } },
            { type: 'listenWord', answer: 'poule', options: ['poule', 'boule', 'roule'] },
            { type: 'listenWord', answer: 'loup', options: ['loup', 'lit'] },
            {
              type: 'pickImage',
              prompt: { fr: 'le hibou', emoji: '🦉' },
              options: [
                { fr: 'le hibou', emoji: '🦉' },
                { fr: 'la poule', emoji: '🐔' },
                { fr: 'la roue', emoji: '🛞' },
              ],
            },
            { type: 'spell', word: { fr: 'poule', emoji: '🐔' }, missing: [1, 2] },
          ],
        },
        {
          id: 'cp-sons-3',
          title: 'Le son « ch »',
          emoji: '🐱',
          exercises: [
            { type: 'flashcard', word: { fr: 'le chat', emoji: '🐱' } },
            { type: 'flashcard', word: { fr: 'le château', emoji: '🏰' } },
            { type: 'flashcard', word: { fr: 'le chocolat', emoji: '🍫' } },
            { type: 'listenWord', answer: 'chat', options: ['chat', 'rat'] },
            { type: 'listenWord', answer: 'vache', options: ['vache', 'bague'] },
            { type: 'spell', word: { fr: 'chat', emoji: '🐱' }, missing: [0, 1] },
            { type: 'reading', text: 'Le chat dort.', emoji: '😴', question: 'Qui dort ?', options: [{ fr: 'le chat', emoji: '🐱' }, { fr: 'le chien', emoji: '🐶' }], answer: 'le chat' },
          ],
        },
        {
          id: 'cp-sons-4',
          title: 'Le son « on »',
          emoji: '🎈',
          exercises: [
            { type: 'flashcard', word: { fr: 'le ballon', emoji: '🎈' } },
            { type: 'flashcard', word: { fr: 'le pont', emoji: '🌉' } },
            { type: 'flashcard', word: { fr: 'le mouton', emoji: '🐑' } },
            { type: 'listenWord', answer: 'pont', options: ['pont', 'pain', 'pin'] },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'le ballon', emoji: '🎈' },
                { fr: 'le pont', emoji: '🌉' },
                { fr: 'le mouton', emoji: '🐑' },
              ],
            },
            { type: 'spell', word: { fr: 'ballon', emoji: '🎈' }, missing: [4, 5] },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LES ANIMAUX */
    {
      id: 'cp-animaux',
      title: 'Les animaux',
      emoji: '🐾',
      color: 'var(--coral)',
      lessons: [
        {
          id: 'cp-animaux-1',
          title: 'À la ferme',
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
              type: 'memory',
              pairs: [
                { fr: 'le chat', emoji: '🐱' },
                { fr: 'le chien', emoji: '🐶' },
                { fr: 'la vache', emoji: '🐮' },
              ],
            },
            {
              type: 'intruder',
              prompt: 'Lequel n’est pas un animal ?',
              options: [
                { fr: 'le chat', emoji: '🐱' },
                { fr: 'le chien', emoji: '🐶' },
                { fr: 'la vache', emoji: '🐮' },
                { fr: 'la pomme', emoji: '🍎' },
              ],
              answer: 'la pomme',
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
            { type: 'spell', word: { fr: 'lapin', emoji: '🐰' }, missing: [0, 3] },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'le lapin', emoji: '🐰' },
                { fr: 'le poisson', emoji: '🐟' },
                { fr: 'l’oiseau', emoji: '🐦' },
              ],
            },
            { type: 'reading', text: 'Le lapin saute.', emoji: '🐰', question: 'Qui saute ?', options: [{ fr: 'le lapin', emoji: '🐰' }, { fr: 'le poisson', emoji: '🐟' }], answer: 'le lapin' },
          ],
        },
        {
          id: 'cp-animaux-3',
          title: 'Les animaux sauvages',
          emoji: '🦁',
          exercises: [
            { type: 'flashcard', word: { fr: 'le lion', emoji: '🦁' } },
            { type: 'flashcard', word: { fr: 'l’éléphant', emoji: '🐘' } },
            { type: 'flashcard', word: { fr: 'le singe', emoji: '🐒' } },
            { type: 'flashcard', word: { fr: 'la girafe', emoji: '🦒' } },
            {
              type: 'pickImage',
              prompt: { fr: 'la girafe', emoji: '🦒' },
              options: [
                { fr: 'le lion', emoji: '🦁' },
                { fr: 'la girafe', emoji: '🦒' },
                { fr: 'le singe', emoji: '🐒' },
                { fr: 'l’éléphant', emoji: '🐘' },
              ],
            },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'le lion', emoji: '🦁' },
                { fr: 'le singe', emoji: '🐒' },
                { fr: 'la girafe', emoji: '🦒' },
              ],
            },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LES COULEURS */
    {
      id: 'cp-couleurs',
      title: 'Les couleurs',
      emoji: '🎨',
      color: 'var(--grape)',
      lessons: [
        {
          id: 'cp-couleurs-1',
          title: 'Rouge, bleu, jaune, vert',
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
            { type: 'buildSentence', sentence: 'Le ballon est rouge', emoji: '🔴' },
          ],
        },
        {
          id: 'cp-couleurs-2',
          title: 'Encore des couleurs',
          emoji: '🟣',
          exercises: [
            { type: 'flashcard', word: { fr: 'orange', emoji: '🟠' } },
            { type: 'flashcard', word: { fr: 'violet', emoji: '🟣' } },
            { type: 'flashcard', word: { fr: 'noir', emoji: '⚫' } },
            { type: 'flashcard', word: { fr: 'blanc', emoji: '⚪' } },
            {
              type: 'pickImage',
              prompt: { fr: 'violet', emoji: '🟣' },
              options: [
                { fr: 'orange', emoji: '🟠' },
                { fr: 'violet', emoji: '🟣' },
                { fr: 'noir', emoji: '⚫' },
              ],
            },
            { type: 'buildSentence', sentence: 'Le chat est noir', emoji: '🐈‍⬛' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LES NOMBRES */
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
            { type: 'flashcard', word: { fr: 'quatre', emoji: '4️⃣' } },
            { type: 'flashcard', word: { fr: 'cinq', emoji: '5️⃣' } },
            {
              type: 'pickImage',
              prompt: { fr: 'trois', emoji: '3️⃣' },
              options: [
                { fr: 'un', emoji: '1️⃣' },
                { fr: 'deux', emoji: '2️⃣' },
                { fr: 'trois', emoji: '3️⃣' },
                { fr: 'cinq', emoji: '5️⃣' },
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
        {
          id: 'cp-nombres-2',
          title: 'Compter jusqu’à 10',
          emoji: '🔟',
          exercises: [
            { type: 'flashcard', word: { fr: 'six', emoji: '6️⃣' } },
            { type: 'flashcard', word: { fr: 'sept', emoji: '7️⃣' } },
            { type: 'flashcard', word: { fr: 'huit', emoji: '8️⃣' } },
            { type: 'flashcard', word: { fr: 'neuf', emoji: '9️⃣' } },
            { type: 'flashcard', word: { fr: 'dix', emoji: '🔟' } },
            {
              type: 'pickImage',
              prompt: { fr: 'huit', emoji: '8️⃣' },
              options: [
                { fr: 'six', emoji: '6️⃣' },
                { fr: 'huit', emoji: '8️⃣' },
                { fr: 'dix', emoji: '🔟' },
              ],
            },
            { type: 'spell', word: { fr: 'dix', emoji: '🔟' }, missing: [0, 2] },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LA FAMILLE */
    {
      id: 'cp-famille',
      title: 'La famille',
      emoji: '👨‍👩‍👧',
      color: 'var(--sun-deep)',
      lessons: [
        {
          id: 'cp-famille-1',
          title: 'Ma famille',
          emoji: '🏠',
          exercises: [
            { type: 'flashcard', word: { fr: 'la maman', emoji: '👩' } },
            { type: 'flashcard', word: { fr: 'le papa', emoji: '👨' } },
            { type: 'flashcard', word: { fr: 'le bébé', emoji: '👶' } },
            { type: 'flashcard', word: { fr: 'le chien', emoji: '🐶' } },
            {
              type: 'pickImage',
              prompt: { fr: 'le bébé', emoji: '👶' },
              options: [
                { fr: 'la maman', emoji: '👩' },
                { fr: 'le bébé', emoji: '👶' },
                { fr: 'le papa', emoji: '👨' },
              ],
            },
            { type: 'buildSentence', sentence: 'J’aime ma maman', emoji: '❤️' },
            { type: 'reading', text: 'Le bébé rit.', emoji: '😄', question: 'Qui rit ?', options: [{ fr: 'le bébé', emoji: '👶' }, { fr: 'le papa', emoji: '👨' }], answer: 'le bébé' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LE CORPS */
    {
      id: 'cp-corps',
      title: 'Le corps',
      emoji: '🧍',
      color: 'var(--teal)',
      lessons: [
        {
          id: 'cp-corps-1',
          title: 'Mon corps',
          emoji: '👀',
          exercises: [
            { type: 'flashcard', word: { fr: 'la main', emoji: '✋' } },
            { type: 'flashcard', word: { fr: 'le pied', emoji: '🦶' } },
            { type: 'flashcard', word: { fr: 'l’œil', emoji: '👁️' } },
            { type: 'flashcard', word: { fr: 'la bouche', emoji: '👄' } },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'la main', emoji: '✋' },
                { fr: 'le pied', emoji: '🦶' },
                { fr: 'la bouche', emoji: '👄' },
              ],
            },
            { type: 'spell', word: { fr: 'main', emoji: '✋' }, missing: [0, 1] },
          ],
        },
        {
          id: 'cp-corps-2',
          title: 'La tête et le reste',
          emoji: '🧠',
          exercises: [
            { type: 'flashcard', word: { fr: 'la tête', emoji: '🗣️' } },
            { type: 'flashcard', word: { fr: 'le nez', emoji: '👃' } },
            { type: 'flashcard', word: { fr: 'le bras', emoji: '💪' } },
            { type: 'flashcard', word: { fr: 'la jambe', emoji: '🦵' } },
            {
              type: 'memory',
              pairs: [
                { fr: 'le nez', emoji: '👃' },
                { fr: 'le bras', emoji: '💪' },
                { fr: 'la jambe', emoji: '🦵' },
              ],
            },
            {
              type: 'intruder',
              prompt: 'Lequel n’est pas une partie du corps ?',
              options: [
                { fr: 'le nez', emoji: '👃' },
                { fr: 'le bras', emoji: '💪' },
                { fr: 'la jambe', emoji: '🦵' },
                { fr: 'la voiture', emoji: '🚗' },
              ],
              answer: 'la voiture',
            },
            { type: 'spell', word: { fr: 'nez', emoji: '👃' }, missing: [0, 2] },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LES ALIMENTS */
    {
      id: 'cp-aliments',
      title: 'Les aliments',
      emoji: '🍎',
      color: 'var(--coral)',
      lessons: [
        {
          id: 'cp-aliments-1',
          title: 'Les fruits',
          emoji: '🍓',
          exercises: [
            { type: 'flashcard', word: { fr: 'la pomme', emoji: '🍎' } },
            { type: 'flashcard', word: { fr: 'la banane', emoji: '🍌' } },
            { type: 'flashcard', word: { fr: 'la fraise', emoji: '🍓' } },
            { type: 'flashcard', word: { fr: 'le raisin', emoji: '🍇' } },
            {
              type: 'pickImage',
              prompt: { fr: 'la fraise', emoji: '🍓' },
              options: [
                { fr: 'la pomme', emoji: '🍎' },
                { fr: 'la fraise', emoji: '🍓' },
                { fr: 'la banane', emoji: '🍌' },
                { fr: 'le raisin', emoji: '🍇' },
              ],
            },
            { type: 'spell', word: { fr: 'pomme', emoji: '🍎' }, missing: [0, 4] },
            {
              type: 'intruder',
              prompt: 'Lequel n’est pas un fruit ?',
              options: [
                { fr: 'la pomme', emoji: '🍎' },
                { fr: 'la fraise', emoji: '🍓' },
                { fr: 'le raisin', emoji: '🍇' },
                { fr: 'le chien', emoji: '🐶' },
              ],
              answer: 'le chien',
            },
            { type: 'buildSentence', sentence: 'Je mange une pomme', emoji: '🍎' },
          ],
        },
        {
          id: 'cp-aliments-2',
          title: 'À table',
          emoji: '🍽️',
          exercises: [
            { type: 'flashcard', word: { fr: 'le pain', emoji: '🍞' } },
            { type: 'flashcard', word: { fr: 'le lait', emoji: '🥛' } },
            { type: 'flashcard', word: { fr: 'l’eau', emoji: '💧' } },
            { type: 'flashcard', word: { fr: 'le gâteau', emoji: '🍰' } },
            { type: 'listenWord', answer: 'pain', options: ['pain', 'bain', 'main'] },
            {
              type: 'pickImage',
              prompt: { fr: 'le gâteau', emoji: '🍰' },
              options: [
                { fr: 'le pain', emoji: '🍞' },
                { fr: 'le gâteau', emoji: '🍰' },
                { fr: 'le lait', emoji: '🥛' },
              ],
            },
          ],
        },
      ],
    },

    /* -------------------------------------------------- PREMIÈRES PHRASES */
    {
      id: 'cp-lecture',
      title: 'Je lis des phrases',
      emoji: '📖',
      color: 'var(--grape)',
      lessons: [
        {
          id: 'cp-lecture-1',
          title: 'Mes premières phrases',
          emoji: '✨',
          exercises: [
            { type: 'reading', text: 'Le chien court.', emoji: '🐶', question: 'Qui court ?', options: [{ fr: 'le chien', emoji: '🐶' }, { fr: 'le chat', emoji: '🐱' }], answer: 'le chien' },
            { type: 'reading', text: 'Le soleil brille.', emoji: '☀️', question: 'Qu’est-ce qui brille ?', options: [{ fr: 'le soleil', emoji: '☀️' }, { fr: 'la lune', emoji: '🌙' }], answer: 'le soleil' },
            { type: 'buildSentence', sentence: 'Le chat boit le lait', emoji: '🥛' },
            { type: 'buildSentence', sentence: 'La fille joue au ballon', emoji: '🎈' },
            { type: 'reading', text: 'Maman lit un livre.', emoji: '📕', question: 'Que fait maman ?', options: [{ fr: 'elle lit', emoji: '📕' }, { fr: 'elle dort', emoji: '😴' }], answer: 'elle lit' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- DICTÉE */
    {
      id: 'cp-dictee',
      title: 'La dictée',
      emoji: '✏️',
      color: 'var(--sky)',
      lessons: [
        {
          id: 'cp-dictee-1',
          title: 'J’écris les mots',
          emoji: '🔤',
          exercises: [
            { type: 'spell', word: { fr: 'chat', emoji: '🐱' }, missing: [0, 1, 2, 3] },
            { type: 'spell', word: { fr: 'lune', emoji: '🌙' }, missing: [0, 1, 2, 3] },
            { type: 'spell', word: { fr: 'pomme', emoji: '🍎' }, missing: [0, 1, 4] },
            { type: 'spell', word: { fr: 'main', emoji: '✋' }, missing: [0, 1, 2, 3] },
            { type: 'spell', word: { fr: 'poule', emoji: '🐔' }, missing: [0, 1, 2, 3, 4] },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LES VÊTEMENTS */
    {
      id: 'cp-vetements',
      title: 'Les vêtements',
      emoji: '👕',
      color: 'var(--grape)',
      lessons: [
        {
          id: 'cp-vetements-1',
          title: 'Je m’habille',
          emoji: '🧥',
          exercises: [
            { type: 'flashcard', word: { fr: 'le pull', emoji: '🧥' } },
            { type: 'flashcard', word: { fr: 'le pantalon', emoji: '👖' } },
            { type: 'flashcard', word: { fr: 'la robe', emoji: '👗' } },
            { type: 'flashcard', word: { fr: 'le chapeau', emoji: '🎩' } },
            {
              type: 'memory',
              pairs: [
                { fr: 'le pull', emoji: '🧥' },
                { fr: 'le pantalon', emoji: '👖' },
                { fr: 'la robe', emoji: '👗' },
              ],
            },
            {
              type: 'pickImage',
              prompt: { fr: 'le chapeau', emoji: '🎩' },
              options: [
                { fr: 'la robe', emoji: '👗' },
                { fr: 'le chapeau', emoji: '🎩' },
                { fr: 'le pull', emoji: '🧥' },
              ],
            },
            { type: 'buildSentence', sentence: 'Je mets un beau chapeau', emoji: '🎩' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LA MAISON */
    {
      id: 'cp-maison',
      title: 'La maison',
      emoji: '🏠',
      color: 'var(--sun-deep)',
      lessons: [
        {
          id: 'cp-maison-1',
          title: 'Dans ma maison',
          emoji: '🛋️',
          exercises: [
            { type: 'flashcard', word: { fr: 'la porte', emoji: '🚪' } },
            { type: 'flashcard', word: { fr: 'la fenêtre', emoji: '🪟' } },
            { type: 'flashcard', word: { fr: 'la table', emoji: '🪑' } },
            { type: 'flashcard', word: { fr: 'la clé', emoji: '🔑' } },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'la porte', emoji: '🚪' },
                { fr: 'la fenêtre', emoji: '🪟' },
                { fr: 'la clé', emoji: '🔑' },
              ],
            },
            { type: 'spell', word: { fr: 'porte', emoji: '🚪' }, missing: [0, 4] },
            {
              type: 'intruder',
              prompt: 'Lequel n’est pas dans la maison ?',
              options: [
                { fr: 'la porte', emoji: '🚪' },
                { fr: 'la table', emoji: '🪑' },
                { fr: 'la fenêtre', emoji: '🪟' },
                { fr: 'le poisson', emoji: '🐟' },
              ],
              answer: 'le poisson',
            },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LES JOUETS */
    {
      id: 'cp-jouets',
      title: 'Les jouets',
      emoji: '🧸',
      color: 'var(--coral)',
      lessons: [
        {
          id: 'cp-jouets-1',
          title: 'Je joue',
          emoji: '🪀',
          exercises: [
            { type: 'flashcard', word: { fr: 'le ballon', emoji: '⚽' } },
            { type: 'flashcard', word: { fr: 'la poupée', emoji: '🪆' } },
            { type: 'flashcard', word: { fr: 'le vélo', emoji: '🚲' } },
            { type: 'flashcard', word: { fr: 'l’ours', emoji: '🧸' } },
            {
              type: 'memory',
              pairs: [
                { fr: 'le ballon', emoji: '⚽' },
                { fr: 'la poupée', emoji: '🪆' },
                { fr: 'le vélo', emoji: '🚲' },
                { fr: 'l’ours', emoji: '🧸' },
              ],
            },
            { type: 'buildSentence', sentence: 'Je joue avec mon ballon', emoji: '⚽' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- ENCORE DES SONS */
    {
      id: 'cp-sons2',
      title: 'Les sons (suite)',
      emoji: '🔡',
      color: 'var(--teal)',
      lessons: [
        {
          id: 'cp-sons-oi',
          title: 'Le son « oi »',
          emoji: '⭐',
          exercises: [
            { type: 'flashcard', word: { fr: 'l’oiseau', emoji: '🐦' } },
            { type: 'flashcard', word: { fr: 'la poire', emoji: '🍐' } },
            { type: 'flashcard', word: { fr: 'le roi', emoji: '🤴' } },
            { type: 'listenWord', answer: 'roi', options: ['roi', 'rat'] },
            { type: 'listenWord', answer: 'poire', options: ['poire', 'porte'] },
            { type: 'spell', word: { fr: 'roi', emoji: '🤴' }, missing: [1, 2] },
          ],
        },
        {
          id: 'cp-sons-an',
          title: 'Le son « an »',
          emoji: '🐘',
          exercises: [
            { type: 'flashcard', word: { fr: 'l’éléphant', emoji: '🐘' } },
            { type: 'flashcard', word: { fr: 'le gant', emoji: '🧤' } },
            { type: 'flashcard', word: { fr: 'la dent', emoji: '🦷' } },
            { type: 'listenWord', answer: 'gant', options: ['gant', 'gâteau'] },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'l’éléphant', emoji: '🐘' },
                { fr: 'le gant', emoji: '🧤' },
                { fr: 'la dent', emoji: '🦷' },
              ],
            },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LES ÉMOTIONS */
    {
      id: 'cp-emotions',
      title: 'Les émotions',
      emoji: '😀',
      color: 'var(--sun-deep)',
      lessons: [
        {
          id: 'cp-emotions-1',
          title: 'Comment je me sens ?',
          emoji: '🥰',
          exercises: [
            { type: 'flashcard', word: { fr: 'content', emoji: '😀' } },
            { type: 'flashcard', word: { fr: 'triste', emoji: '😢' } },
            { type: 'flashcard', word: { fr: 'fâché', emoji: '😠' } },
            { type: 'flashcard', word: { fr: 'fatigué', emoji: '😴' } },
            { type: 'flashcard', word: { fr: 'surpris', emoji: '😮' } },
            {
              type: 'pickImage',
              prompt: { fr: 'triste', emoji: '😢' },
              options: [
                { fr: 'content', emoji: '😀' },
                { fr: 'triste', emoji: '😢' },
                { fr: 'fâché', emoji: '😠' },
                { fr: 'fatigué', emoji: '😴' },
              ],
            },
            {
              type: 'memory',
              pairs: [
                { fr: 'content', emoji: '😀' },
                { fr: 'triste', emoji: '😢' },
                { fr: 'fâché', emoji: '😠' },
              ],
            },
            { type: 'buildSentence', sentence: 'Aujourd’hui je suis content', emoji: '😀' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LES 5 SENS */
    {
      id: 'cp-sens',
      title: 'Les 5 sens',
      emoji: '👀',
      color: 'var(--grape)',
      lessons: [
        {
          id: 'cp-sens-1',
          title: 'Je vois, j’entends…',
          emoji: '🖐️',
          exercises: [
            { type: 'flashcard', word: { fr: 'voir', emoji: '👁️' } },
            { type: 'flashcard', word: { fr: 'entendre', emoji: '👂' } },
            { type: 'flashcard', word: { fr: 'sentir', emoji: '👃' } },
            { type: 'flashcard', word: { fr: 'toucher', emoji: '✋' } },
            { type: 'flashcard', word: { fr: 'goûter', emoji: '👅' } },
            {
              type: 'matchPairs',
              pairs: [
                { fr: 'voir', emoji: '👁️' },
                { fr: 'entendre', emoji: '👂' },
                { fr: 'sentir', emoji: '👃' },
                { fr: 'goûter', emoji: '👅' },
              ],
            },
            {
              type: 'pickImage',
              prompt: { fr: 'toucher', emoji: '✋' },
              options: [
                { fr: 'voir', emoji: '👁️' },
                { fr: 'toucher', emoji: '✋' },
                { fr: 'goûter', emoji: '👅' },
              ],
            },
            { type: 'buildSentence', sentence: 'Avec les yeux je peux voir', emoji: '👁️' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- ANIMAUX DE LA MER */
    {
      id: 'cp-mer',
      title: 'Les animaux de la mer',
      emoji: '🌊',
      color: 'var(--sky)',
      lessons: [
        {
          id: 'cp-mer-1',
          title: 'Dans l’océan',
          emoji: '🐠',
          exercises: [
            { type: 'flashcard', word: { fr: 'le poisson', emoji: '🐟' } },
            { type: 'flashcard', word: { fr: 'le requin', emoji: '🦈' } },
            { type: 'flashcard', word: { fr: 'la baleine', emoji: '🐳' } },
            { type: 'flashcard', word: { fr: 'le crabe', emoji: '🦀' } },
            { type: 'flashcard', word: { fr: 'la pieuvre', emoji: '🐙' } },
            {
              type: 'memory',
              pairs: [
                { fr: 'le requin', emoji: '🦈' },
                { fr: 'la baleine', emoji: '🐳' },
                { fr: 'le crabe', emoji: '🦀' },
                { fr: 'la pieuvre', emoji: '🐙' },
              ],
            },
            {
              type: 'intruder',
              prompt: 'Lequel ne vit pas dans la mer ?',
              options: [
                { fr: 'le poisson', emoji: '🐟' },
                { fr: 'le crabe', emoji: '🦀' },
                { fr: 'la pieuvre', emoji: '🐙' },
                { fr: 'le lapin', emoji: '🐰' },
              ],
              answer: 'le lapin',
            },
            { type: 'spell', word: { fr: 'crabe', emoji: '🦀' }, missing: [0, 2, 4] },
          ],
        },
      ],
    },
  ],
}
