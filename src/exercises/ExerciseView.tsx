import type { Exercise } from '../data/curriculum'
import { Flashcard } from './Flashcard'
import { PickImage } from './PickImage'
import { ListenWord } from './ListenWord'
import { BuildSentence } from './BuildSentence'
import { MatchPairs } from './MatchPairs'
import { Spell } from './Spell'
import { Conjugate } from './Conjugate'
import { Reading } from './Reading'
import { Memory } from './Memory'
import { Sort } from './Sort'
import { Intruder } from './Intruder'
import type { ExerciseProps } from './shared'

/** Aiguille chaque exercice vers le bon composant de jeu. */
export function ExerciseView({
  exercise,
  ...props
}: ExerciseProps & { exercise: Exercise }) {
  switch (exercise.type) {
    case 'flashcard':
      return <Flashcard exercise={exercise} {...props} />
    case 'pickImage':
      return <PickImage exercise={exercise} {...props} />
    case 'listenWord':
      return <ListenWord exercise={exercise} {...props} />
    case 'buildSentence':
      return <BuildSentence exercise={exercise} {...props} />
    case 'matchPairs':
      return <MatchPairs exercise={exercise} {...props} />
    case 'spell':
      return <Spell exercise={exercise} {...props} />
    case 'conjugate':
      return <Conjugate exercise={exercise} {...props} />
    case 'reading':
      return <Reading exercise={exercise} {...props} />
    case 'memory':
      return <Memory exercise={exercise} {...props} />
    case 'sort':
      return <Sort exercise={exercise} {...props} />
    case 'intruder':
      return <Intruder exercise={exercise} {...props} />
  }
}
