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
| **Audio d'abord** | Tout se prononce : un enfant peut **réécouter** chaque mot à volonté, et la **vitesse de lecture** est réglable (🐢 / 🙂 / 🐇). La voix laisse toujours finir la phrase avant de passer à la suite. |
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

**Côté client** (exposé au navigateur — préfixe `VITE_`) :

| Variable | Rôle |
| --- | --- |
| `VITE_ELEVENLABS_AGENT_ID` | Active l'agent conversationnel temps réel dans « Parle avec Lumi ». L'`agent-id` est public/intégrable : OK côté client. |

**Côté serveur** (SECRET — jamais envoyé au navigateur, lu par `server.js`) :

| Variable | Rôle |
| --- | --- |
| `ELEVENLABS_API_KEY` | Clé API ElevenLabs pour le proxy de synthèse vocale `/api/tts`. **Reste sur le serveur.** |
| `ELEVENLABS_VOICE_ID` | Voix utilisée pour prononcer les mots. **Mettez la MÊME que celle de votre agent** pour que la voix de l'app « colle » à celle de la conversation. |
| `ELEVENLABS_MODEL_ID` | (Optionnel) modèle TTS. Défaut : `eleven_multilingual_v2`. |

> ✅ **Pourquoi un proxy serveur ?** Mettre une clé API dans une variable `VITE_*`
> l'exposerait en clair dans le navigateur. Ici, le client appelle `/api/tts` ;
> `server.js` ajoute la clé **côté serveur** et renvoie l'audio. La clé ne quitte
> jamais le serveur. Et comme on réutilise le même `ELEVENLABS_VOICE_ID` que
> l'agent, la voix des mots et la voix de la conversation sont **identiques**.
>
> En dev (`npm run dev`), ce proxy n'existe pas : l'app utilise alors la voix du
> navigateur. La voix premium s'active en production (`npm start` / Railway) une
> fois les variables renseignées.

---

## 🗺️ Pistes d'évolution

- Contenu CE2 → CM2 (ajouter `src/data/ce2.ts`… sur le modèle de `cp.ts`).
- Dictée vocale (reconnaissance) pour valider la prononciation de l'enfant.
- Espace parents (suivi des progrès, durée de jeu, objectifs hebdo).
- Plus d'illustrations dédiées (remplacer les emojis par des assets maison).
- Mode hors-ligne complet (PWA) pour les longs trajets.
