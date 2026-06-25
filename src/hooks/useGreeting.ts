import { useEffect } from 'react'
import { speak } from '../services/audio'

/** Phrase de présentation de Lumi, jouée à l'arrivée sur le jeu. */
export const LUMI_INTRO =
  'Bonjour ! Moi, c’est Lumi. On va apprendre le français en s’amusant !'

/* ============================================================
   Les navigateurs bloquent le son tant que l'enfant n'a pas
   interagi (politique « autoplay »). Pour que Lumi se présente
   de façon FIABLE, on déclenche la phrase d'accueil au tout
   premier contact (tap ou touche), une seule fois par session.
   ============================================================ */

let greetedThisLoad = false

export function useGreeting(text: string, enabled = true) {
  useEffect(() => {
    if (!enabled || greetedThisLoad || !text) return

    const greet = () => {
      if (greetedThisLoad) return
      greetedThisLoad = true
      void speak(text)
      cleanup()
    }
    const cleanup = () => {
      document.removeEventListener('pointerdown', greet)
      document.removeEventListener('keydown', greet)
    }

    // Au tout premier contact (tap/touche) — fiable sur tous les navigateurs,
    // et sans risque de double accueil.
    document.addEventListener('pointerdown', greet, { once: true })
    document.addEventListener('keydown', greet, { once: true })
    return cleanup
  }, [text, enabled])
}
