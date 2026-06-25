# ⭐ Lumi — J'apprends le français

Une webapp ludique pour aider les **enfants du CP au CM2 vivant à l'étranger**
(familles franco-étrangères, expatriés, binationaux) à **apprendre et
consolider le français** en s'amusant.

> Démarre en un clic, sans compte. Joue avec **Lumi**, le petit renard, à
> travers des îles de mini-jeux courts. 100 % jouable **sans aucune clé API**.

---

## 🎯 Le parti pris pédagogique

Ces enfants comprennent souvent le français à l'oral mais manquent de pratique
en lecture, sons, orthographe et vocabulaire. L'app est conçue autour de
principes adaptés au **jeune apprenant** :

| Principe | Comment c'est appliqué |
| --- | --- |
| **Temps d'attention court** | Leçons de **3–5 min** (4–7 micro-exercices), pas de murs de texte. |
| **Audio d'abord** | Tout se prononce : un enfant peut **réécouter** chaque mot à volonté. |
| **Multi-méthodes** | 8 types d'exercices pour varier les stimuli et éviter la lassitude. |
| **Feedback positif** | Erreurs non punitives (son doux, on réessaie), encouragements constants. |
| **Gamification douce** | Étoiles, points (XP), **série de jours** 🔥, carte d'îles à débloquer. |
| **Mascotte affective** | **Lumi** rassure, guide et félicite — un compagnon, pas un prof. |
| **Grandes cibles tactiles** | Boutons ≥ 64 px, formes très arrondies, fort contraste, pensé mobile. |

### Les 8 méthodes d'apprentissage (= types d'exercices)

1. **Flashcard** — découverte multisensorielle (voir + lire + entendre + répéter).
2. **J'écoute, je choisis l'image** — compréhension orale (son → sens).
3. **Quel mot entends-tu ?** — discrimination des sons & lecture (chat / rat…).
4. **Remets la phrase dans l'ordre** — syntaxe et structure de la phrase.
5. **Associe mot & image** — mémoire et lien graphie ↔ image.
6. **Complète le mot** — orthographe / dictée, sans clavier (adapté aux plus jeunes).
7. **Conjugaison** — choisir la bonne forme du verbe (CE1 : être, avoir, verbes -er).
8. **Lecture & compréhension** — lire une phrase, puis répondre à une question illustrée.

### Couverture du contenu

- **CP** — très complet : les sons (voyelles, *ou*, *ch*, *on*), animaux (ferme,
  sauvages), couleurs, nombres jusqu'à 10, famille, corps, aliments, premières
  phrases (lecture) et dictée. **~9 îles.**
- **CE1** — très complet : famille, actions, **conjugaison** (verbes -er, *être*,
  *avoir*), école, nature, lecture d'histoires et dictée. **~7 îles.**
- **CE2 → CM2** — gabarits prêts à remplir dans `src/data/`.

### « Parle avec Lumi » 🎙️ (expression orale)

L'écran de conversation travaille la compétence la plus difficile : **oser
parler**. Il fonctionne en deux modes :

- **Mode guidé** (par défaut, sans clé) : Lumi pose une question à voix haute,
  l'enfant répond, puis écoute des réponses modèles.
- **Mode agent vocal temps réel** : si un agent **ElevenLabs Conversational AI**
  est configuré, le widget se charge et l'enfant **discute réellement** avec Lumi.

---

## 🧱 Stack technique

- **React 18 + TypeScript + Vite** (SPA légère, ~100 kB gzip).
- **framer-motion** pour des animations douces et réactives (essentiel pour les enfants).
- **react-router-dom** pour la navigation.
- **Service audio** abstrait : voix premium **ElevenLabs** si configurée, sinon
  **Web Speech API** du navigateur (gratuite, hors-ligne). Effets sonores
  générés via la Web Audio API (aucun fichier binaire).
- **Progression** persistée en `localStorage` (pas de backend nécessaire).

Architecture :

```
src/
  data/curriculum.ts      # types + registre des niveaux
  data/cp.ts, data/ce1.ts # contenu (îles → leçons → exercices) par niveau
  state/ProfileContext.tsx# profil, XP, étoiles, série (localStorage)
  services/audio.ts       # TTS (ElevenLabs / navigateur) + sons de feedback
  components/Mascot.tsx    # Lumi et ses humeurs
  exercises/              # les 6 types de jeux + répartiteur
  screens/                # Onboarding, Home (carte), Lesson, Chat
```

---

## 🚀 Démarrage

```bash
npm install
npm run dev        # http://localhost:5173
```

Build de production + serveur :

```bash
npm run build      # typecheck + bundle dans dist/
npm start          # sert dist/ sur $PORT (défaut 3000), avec fallback SPA
```

---

## ☁️ Déploiement sur Railway

Le projet est prêt pour Railway (config dans `railway.json`) :

- **Build** : `npm run build`
- **Start** : `npm start` — un petit serveur Node (`server.js`, sans dépendance)
  sert `dist/`, écoute sur `$PORT` et gère le routing SPA.

Étapes : créez un projet Railway depuis ce dépôt → Railway détecte Node →
build & deploy automatiques. Aucune variable d'environnement n'est requise pour
que l'app fonctionne.

---

## 🔑 Variables d'environnement (optionnelles)

Copiez `.env.example` en `.env` et renseignez ce que vous voulez activer.
**Toutes sont facultatives** — sans elles, l'app utilise les voix du navigateur.

| Variable | Rôle |
| --- | --- |
| `VITE_ELEVENLABS_API_KEY` | Voix premium ElevenLabs (TTS des mots). |
| `VITE_ELEVENLABS_VOICE_ID` | Voix française à utiliser pour Lumi. |
| `VITE_ELEVENLABS_AGENT_ID` | Active l'agent conversationnel temps réel dans « Parle avec Lumi ». |

> ⚠️ Ces variables `VITE_*` sont **exposées au client**. Pour le TTS, utilisez
> une clé ElevenLabs **restreinte**. L'agent conversationnel, lui, est conçu
> pour être intégré côté client via son `agent-id`.

---

## 🗺️ Pistes d'évolution

- Contenu CE2 → CM2 (gabarits déjà en place dans `curriculum.ts`).
- Dictée vocale (reconnaissance) pour valider la prononciation de l'enfant.
- Espace parents (suivi des progrès, durée de jeu, objectifs hebdo).
- Plus d'illustrations dédiées (remplacer les emojis par des assets maison).
- Mode hors-ligne complet (PWA) pour les longs trajets.
