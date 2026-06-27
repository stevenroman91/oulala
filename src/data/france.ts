import type { Curriculum, Island, LevelId } from './curriculum'

/* ============================================================
   « Le voyage de Lumi en France »
   ------------------------------------------------------------
   Au lieu d'une grille d'îles abstraites, l'enfant traverse la
   FRANCE d'étape en étape. Chaque étape (une région/ville) a sa
   couleur culturelle et regroupe plusieurs leçons. On découvre
   le pays en apprenant la langue — du sens pour un enfant
   expatrié ou franco-étranger.
   ============================================================ */

export interface Stop {
  id: string
  region: string // ex. « Paris », « La Bretagne »
  emoji: string // un monument / symbole de la région
  blurb: string // une petite phrase culturelle
  color: string
  islandIds: string[] // les îles (thèmes) regroupées dans cette étape
}

/** Le parcours, étape par étape, pour chaque niveau. */
export const JOURNEY: Record<LevelId, Stop[]> = {
  cp: [
    {
      id: 'cp-paris',
      region: 'Paris',
      emoji: '🗼',
      blurb: 'On commence dans la capitale, près de la tour Eiffel !',
      color: 'var(--coral)',
      islandIds: ['cp-sons', 'cp-sons2', 'cp-nombres', 'cp-lecture', 'cp-dictee'],
    },
    {
      id: 'cp-bretagne',
      region: 'La Bretagne',
      emoji: '🌊',
      blurb: 'Direction la mer, les vagues et les animaux marins.',
      color: 'var(--sky)',
      islandIds: ['cp-mer', 'cp-animaux', 'cp-sens'],
    },
    {
      id: 'cp-provence',
      region: 'La Provence',
      emoji: '🌻',
      blurb: 'Au soleil, dans les champs de tournesols et de couleurs.',
      color: 'var(--sun-deep)',
      islandIds: ['cp-couleurs', 'cp-aliments', 'cp-emotions'],
    },
    {
      id: 'cp-alpes',
      region: 'Les Alpes',
      emoji: '🏔️',
      blurb: 'À la montagne, bien au chaud avec la famille.',
      color: 'var(--teal)',
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
      islandIds: ['ce1-ecole', 'ce1-lecture', 'ce1-dictee', 'ce1-metiers'],
    },
    {
      id: 'ce1-campagne',
      region: 'La campagne',
      emoji: '🌳',
      blurb: 'À la campagne, en famille et dans la nature.',
      color: 'var(--good)',
      islandIds: ['ce1-nature', 'ce1-famille', 'ce1-contraires'],
    },
    {
      id: 'ce1-verbes',
      region: 'Le pays des verbes',
      emoji: '🧩',
      blurb: 'Une région magique où l’on apprend à conjuguer.',
      color: 'var(--grape)',
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
      islandIds: ['ce2-ville', 'ce2-lecture'],
    },
    {
      id: 'ce2-passe',
      region: 'Le temps qui passe',
      emoji: '⏳',
      blurb: 'On raconte hier : bienvenue au passé composé !',
      color: 'var(--grape)',
      islandIds: ['ce2-passe'],
    },
  ],
  cm1: [],
  cm2: [],
}

/** Regroupe les îles d'un niveau par étape du voyage (dans l'ordre). */
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
  // Filet de sécurité : toute île non rattachée à une étape reste visible.
  const orphans = curriculum.islands.filter((i) => !used.has(i.id))
  if (orphans.length) {
    groups.push({
      stop: {
        id: `${level}-ailleurs`,
        region: 'Ailleurs en France',
        emoji: '🧭',
        blurb: 'D’autres découvertes t’attendent !',
        color: 'var(--sun-deep)',
        islandIds: orphans.map((i) => i.id),
      },
      islands: orphans,
    })
  }
  return groups
}
