import type { Curriculum, Island, LevelId } from './curriculum'

/* ============================================================
   « Le voyage de Lumi en France »
   ------------------------------------------------------------
   L'enfant traverse la FRANCE d'étape en étape sur une vraie
   carte. Chaque étape (région) a sa couleur, un monument, un
   PERSONNAGE qui l'accueille avec une petite HISTOIRE, et un
   COSTUME de Lumi à débloquer quand la région est terminée.
   ============================================================ */

export interface Costume {
  id: string
  emoji: string
  name: string
}

export interface Stop {
  id: string
  region: string
  emoji: string // monument / symbole
  blurb: string // phrase culturelle
  color: string
  coord: { x: number; y: number } // position sur la carte (0–100 %)
  character: { emoji: string; name: string }
  story: string // mini-histoire racontée par le personnage
  costume: Costume // débloqué quand la région est terminée
  islandIds: string[]
}

export const JOURNEY: Record<LevelId, Stop[]> = {
  cp: [
    {
      id: 'cp-paris',
      region: 'Paris',
      emoji: '🗼',
      blurb: 'On commence dans la capitale, près de la tour Eiffel !',
      color: 'var(--coral)',
      coord: { x: 52, y: 28 },
      character: { emoji: '👮', name: 'Gaspard le gendarme' },
      story:
        'Bonjour ! Bienvenue à Paris. Ici il y a la tour Eiffel, tout en haut du ciel. Tu viens visiter avec moi ?',
      costume: { id: 'beret', emoji: '🎩', name: 'le chapeau chic' },
      islandIds: ['cp-sons', 'cp-sons2', 'cp-nombres', 'cp-lecture', 'cp-dictee'],
    },
    {
      id: 'cp-bretagne',
      region: 'La Bretagne',
      emoji: '🌊',
      blurb: 'Direction la mer, les vagues et les animaux marins.',
      color: 'var(--sky)',
      coord: { x: 16, y: 40 },
      character: { emoji: '🧑‍✈️', name: 'Yann le marin' },
      story:
        'Salut moussaillon ! En Bretagne, il y a la mer, les bateaux et de bonnes crêpes. On part en mer ?',
      costume: { id: 'cire', emoji: '🧥', name: 'le ciré jaune' },
      islandIds: ['cp-mer', 'cp-animaux', 'cp-sens'],
    },
    {
      id: 'cp-provence',
      region: 'La Provence',
      emoji: '🌻',
      blurb: 'Au soleil, dans les champs de tournesols et de couleurs.',
      color: 'var(--sun-deep)',
      coord: { x: 66, y: 80 },
      character: { emoji: '🦗', name: 'Lila la cigale' },
      story:
        'Coucou ! En Provence, il fait chaud et ça sent la lavande. Les cigales chantent tout l’été !',
      costume: { id: 'paille', emoji: '👒', name: 'le chapeau de paille' },
      islandIds: ['cp-couleurs', 'cp-aliments', 'cp-emotions'],
    },
    {
      id: 'cp-alpes',
      region: 'Les Alpes',
      emoji: '🏔️',
      blurb: 'À la montagne, bien au chaud avec la famille.',
      color: 'var(--teal)',
      coord: { x: 80, y: 56 },
      character: { emoji: '🐿️', name: 'Marius la marmotte' },
      story:
        'Brrr ! Dans les Alpes, il y a la neige et de grandes montagnes. On se réchauffe ensemble ?',
      costume: { id: 'echarpe', emoji: '🧣', name: 'l’écharpe douillette' },
      islandIds: ['cp-corps', 'cp-vetements', 'cp-maison', 'cp-jouets', 'cp-famille'],
    },
  ],
  ce1: [
    {
      id: 'ce1-paris',
      region: 'Paris',
      emoji: '🗼',
      blurb: 'À l’école de la grande ville !',
      color: 'var(--coral)',
      coord: { x: 52, y: 28 },
      character: { emoji: '🧑‍🏫', name: 'Madame Hibou' },
      story: 'Bienvenue à l’école de Paris ! Aujourd’hui, on apprend plein de nouveaux mots.',
      costume: { id: 'lunettes', emoji: '🕶️', name: 'les lunettes de star' },
      islandIds: ['ce1-ecole', 'ce1-lecture', 'ce1-dictee', 'ce1-metiers'],
    },
    {
      id: 'ce1-campagne',
      region: 'La campagne',
      emoji: '🌳',
      blurb: 'À la campagne, en famille et dans la nature.',
      color: 'var(--good)',
      coord: { x: 44, y: 56 },
      character: { emoji: '🧑‍🌾', name: 'Bertrand le fermier' },
      story: 'Bonjour ! À la campagne, il y a des fleurs, des animaux et du grand air. Suis-moi !',
      costume: { id: 'bottes', emoji: '👢', name: 'les bottes de fermier' },
      islandIds: ['ce1-nature', 'ce1-famille', 'ce1-contraires'],
    },
    {
      id: 'ce1-verbes',
      region: 'Le pays des verbes',
      emoji: '🧩',
      blurb: 'Une région magique où l’on apprend à conjuguer.',
      color: 'var(--grape)',
      coord: { x: 34, y: 72 },
      character: { emoji: '🧙', name: 'Merlin le magicien' },
      story: 'Abracadabra ! Ici, les verbes changent de forme. Je vais t’apprendre la magie de conjuguer !',
      costume: { id: 'baguette', emoji: '🪄', name: 'la baguette magique' },
      islandIds: ['ce1-verbes', 'ce1-conjugaison', 'ce1-conjugaison2'],
    },
  ],
  ce2: [
    {
      id: 'ce2-ville',
      region: 'La grande ville',
      emoji: '🏙️',
      blurb: 'On explore la ville, ses rues et ses transports.',
      color: 'var(--sky)',
      coord: { x: 52, y: 30 },
      character: { emoji: '🧑‍🎤', name: 'Sofia la guide' },
      story: 'Bienvenue en ville ! On prend le bus, le métro, et on découvre les rues ensemble.',
      costume: { id: 'sac', emoji: '🎒', name: 'le sac à dos d’explorateur' },
      islandIds: ['ce2-ville', 'ce2-lecture'],
    },
    {
      id: 'ce2-passe',
      region: 'Le temps qui passe',
      emoji: '⏳',
      blurb: 'On raconte hier : bienvenue au passé composé !',
      color: 'var(--grape)',
      coord: { x: 64, y: 58 },
      character: { emoji: '🦉', name: 'Chouette du temps' },
      story: 'Hou hou ! Je connais toutes les histoires d’hier. On apprend à parler du passé ?',
      costume: { id: 'montre', emoji: '⌚', name: 'la montre du temps' },
      islandIds: ['ce2-passe'],
    },
  ],
  cm1: [],
  cm2: [],
}

export function journeyStops(
  level: LevelId,
  curriculum: Curriculum,
): { stop: Stop; islands: Island[] }[] {
  const byId = new Map(curriculum.islands.map((i) => [i.id, i]))
  const stops = JOURNEY[level] || []
  const used = new Set<string>()
  const groups = stops.map((stop) => {
    const islands = stop.islandIds
      .map((id) => {
        used.add(id)
        return byId.get(id)
      })
      .filter((i): i is Island => Boolean(i))
    return { stop, islands }
  })
  const orphans = curriculum.islands.filter((i) => !used.has(i.id))
  if (orphans.length) {
    groups.push({
      stop: {
        id: `${level}-ailleurs`,
        region: 'Ailleurs en France',
        emoji: '🧭',
        blurb: 'D’autres découvertes t’attendent !',
        color: 'var(--sun-deep)',
        coord: { x: 50, y: 92 },
        character: { emoji: '🦊', name: 'Lumi' },
        story: 'Par ici, il reste encore des choses à découvrir !',
        costume: { id: 'boussole', emoji: '🧭', name: 'la boussole' },
        islandIds: orphans.map((i) => i.id),
      },
      islands: orphans,
    })
  }
  return groups
}

/** Toutes les régions d'un niveau, à plat (pour costumes & célébrations). */
export function levelStops(level: LevelId): Stop[] {
  return JOURNEY[level] || []
}

const ALL_COSTUMES: Costume[] = Object.values(JOURNEY)
  .flat()
  .map((s) => s.costume)

/** Retrouve un costume par son id (toutes régions confondues). */
export function costumeById(id: string | null): Costume | undefined {
  if (!id) return undefined
  return ALL_COSTUMES.find((c) => c.id === id)
}
