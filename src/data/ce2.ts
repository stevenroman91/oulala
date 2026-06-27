import type { Curriculum } from './curriculum'

/* ============================================================
   CONTENU — CE2 (8–9 ans)
   ------------------------------------------------------------
   On entre dans le passé (passé composé avec « avoir »), on
   enrichit le vocabulaire (la ville, les transports) et on lit
   des textes un peu plus longs.
   ============================================================ */

export const ce2: Curriculum = {
  level: 'ce2',
  islands: [
    /* -------------------------------------------------- PASSÉ COMPOSÉ */
    {
      id: 'ce2-passe',
      title: 'Hier… (le passé)',
      emoji: '⏳',
      color: 'var(--grape)',
      lessons: [
        {
          id: 'ce2-passe-1',
          title: 'J’ai fait, tu as fait',
          emoji: '📅',
          exercises: [
            { type: 'conjugate', pronoun: 'j’', verb: 'manger (hier)', answer: 'ai mangé', options: ['ai mangé', 'as mangé', 'a mangé'], emoji: '🍽️' },
            { type: 'conjugate', pronoun: 'tu', verb: 'jouer (hier)', answer: 'as joué', options: ['as joué', 'ai joué', 'a joué'], emoji: '⚽' },
            { type: 'conjugate', pronoun: 'il', verb: 'chanter (hier)', answer: 'a chanté', options: ['a chanté', 'as chanté', 'ai chanté'], emoji: '🎤' },
            { type: 'conjugate', pronoun: 'nous', verb: 'danser (hier)', answer: 'avons dansé', options: ['avons dansé', 'avez dansé', 'ont dansé'], emoji: '💃' },
            { type: 'buildSentence', sentence: 'Hier j’ai mangé une pomme', emoji: '🍎' },
            { type: 'buildSentence', sentence: 'Tu as joué dans le jardin', emoji: '⚽' },
          ],
        },
        {
          id: 'ce2-passe-2',
          title: 'Raconter sa journée',
          emoji: '🌙',
          exercises: [
            { type: 'conjugate', pronoun: 'elle', verb: 'dessiner (hier)', answer: 'a dessiné', options: ['a dessiné', 'as dessiné', 'ai dessiné'], emoji: '🖍️' },
            { type: 'conjugate', pronoun: 'ils', verb: 'regarder (hier)', answer: 'ont regardé', options: ['ont regardé', 'avons regardé', 'a regardé'], emoji: '📺' },
            { type: 'reading', text: 'Hier, Léa a mangé une glace.', emoji: '🍦', question: 'Qu’a mangé Léa ?', options: [{ fr: 'une glace', emoji: '🍦' }, { fr: 'une pomme', emoji: '🍎' }], answer: 'une glace' },
            { type: 'buildSentence', sentence: 'Nous avons chanté une belle chanson', emoji: '🎤' },
            { type: 'reading', text: 'Tom a joué au foot avec papa.', emoji: '⚽', question: 'Avec qui a joué Tom ?', options: [{ fr: 'avec papa', emoji: '👨' }, { fr: 'avec le chat', emoji: '🐱' }], answer: 'avec papa' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LA VILLE */
    {
      id: 'ce2-ville',
      title: 'La ville',
      emoji: '🏙️',
      color: 'var(--sky)',
      lessons: [
        {
          id: 'ce2-ville-1',
          title: 'Les transports',
          emoji: '🚌',
          exercises: [
            { type: 'flashcard', word: { fr: 'la voiture', emoji: '🚗' } },
            { type: 'flashcard', word: { fr: 'le bus', emoji: '🚌' } },
            { type: 'flashcard', word: { fr: 'le train', emoji: '🚆' } },
            { type: 'flashcard', word: { fr: 'le vélo', emoji: '🚲' } },
            { type: 'flashcard', word: { fr: 'l’avion', emoji: '✈️' } },
            {
              type: 'memory',
              pairs: [
                { fr: 'la voiture', emoji: '🚗' },
                { fr: 'le bus', emoji: '🚌' },
                { fr: 'le train', emoji: '🚆' },
                { fr: 'le vélo', emoji: '🚲' },
              ],
            },
            {
              type: 'intruder',
              prompt: 'Lequel ne roule pas par terre ?',
              options: [
                { fr: 'la voiture', emoji: '🚗' },
                { fr: 'le bus', emoji: '🚌' },
                { fr: 'le vélo', emoji: '🚲' },
                { fr: 'l’avion', emoji: '✈️' },
              ],
              answer: 'l’avion',
            },
            { type: 'buildSentence', sentence: 'Je vais à l’école en bus', emoji: '🚌' },
          ],
        },
        {
          id: 'ce2-ville-2',
          title: 'Dans la rue',
          emoji: '🏬',
          exercises: [
            { type: 'flashcard', word: { fr: 'la rue', emoji: '🛣️' } },
            { type: 'flashcard', word: { fr: 'le magasin', emoji: '🏬' } },
            { type: 'flashcard', word: { fr: 'l’école', emoji: '🏫' } },
            { type: 'flashcard', word: { fr: 'le parc', emoji: '🌳' } },
            {
              type: 'pickImage',
              prompt: { fr: 'l’école', emoji: '🏫' },
              options: [
                { fr: 'la rue', emoji: '🛣️' },
                { fr: 'l’école', emoji: '🏫' },
                { fr: 'le magasin', emoji: '🏬' },
                { fr: 'le parc', emoji: '🌳' },
              ],
            },
            { type: 'spell', word: { fr: 'parc', emoji: '🌳' }, missing: [0, 2] },
            { type: 'reading', text: 'Le matin, je marche dans la rue.', emoji: '🚶', question: 'Où je marche ?', options: [{ fr: 'dans la rue', emoji: '🛣️' }, { fr: 'dans l’eau', emoji: '💧' }], answer: 'dans la rue' },
          ],
        },
      ],
    },

    /* -------------------------------------------------- LECTURE */
    {
      id: 'ce2-lecture',
      title: 'Je lis des textes',
      emoji: '📚',
      color: 'var(--teal)',
      lessons: [
        {
          id: 'ce2-lecture-1',
          title: 'Une petite histoire',
          emoji: '✨',
          exercises: [
            { type: 'reading', text: 'Le matin, le coq chante très fort.', emoji: '🐓', question: 'Qui chante le matin ?', options: [{ fr: 'le coq', emoji: '🐓' }, { fr: 'le chien', emoji: '🐶' }], answer: 'le coq' },
            { type: 'reading', text: 'La petite fille cueille une fleur rouge.', emoji: '🌹', question: 'De quelle couleur est la fleur ?', options: [{ fr: 'rouge', emoji: '🔴' }, { fr: 'bleue', emoji: '🔵' }], answer: 'rouge' },
            { type: 'buildSentence', sentence: 'Le soir nous regardons les étoiles', emoji: '⭐' },
            { type: 'reading', text: 'En hiver, il neige sur la montagne.', emoji: '🏔️', question: 'Quelle saison est-ce ?', options: [{ fr: 'l’hiver', emoji: '❄️' }, { fr: 'l’été', emoji: '☀️' }], answer: 'l’hiver' },
            { type: 'buildSentence', sentence: 'Mon ami a un grand chien noir', emoji: '🐕' },
          ],
        },
      ],
    },
  ],
}
