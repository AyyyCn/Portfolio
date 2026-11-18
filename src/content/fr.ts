import type { Content } from './types';

// Source : pfe-report/cv/Adam_Ladhari_CV_fr.yaml. Tous les chiffres viennent du CV.
export const fr: Content = {
  lang: 'fr',
  path: '/fr/',
  altPath: '/',
  altLabel: 'English',
  meta: {
    title: 'Adam Ladhari · Ingénieur IA appliquée, systèmes agentiques pour la 3D interactive',
    description:
      'Ingénieur IA appliquée à Paris. Systèmes agentiques pour la 3D interactive et le jeu : harness d’agents, benchmarks, observabilité, netcode multijoueur, 3D, VFX et audio génératifs. Études de cas avec résultats mesurés.',
  },
  nav: { work: 'Études de cas', earlier: 'Avant Arcade', toolbox: 'Outils', contact: 'Contact', skip: 'Aller au contenu' },
  hero: {
    role: 'Ingénieur IA appliquée',
    location: 'Paris, France',
    lead: 'Systèmes agentiques pour la 3D interactive.',
    profile:
      'Je prends un sujet de bout en bout : cadrer le problème, construire, instrumenter, mesurer, livrer. Chez Arcade AI, cela couvre les agents qui transforment une conversation en jeu multijoueur et le moteur qu’ils pilotent : 3D, gameplay, VFX, audio, UI et réseau.',
    cta: 'Lancer le replay',
  },
  headline: [
    { value: '8 % → 92 %', label: 'des fonctionnalités demandées, stratégie par checklist face à une sortie simplement valide' },
    { value: '7', label: 'architectures d’agents comparées à la production' },
    { value: '≈100', label: 'PNJ actifs à 60 FPS, budget mesuré' },
    { value: '250 ms', label: 'de compensation de latence, vérifiée sous latence injectée' },
    { value: '10+', label: 'jeux et cartes complets livrés en production' },
  ],
  arcade: {
    heading: 'Études de cas',
    role: 'Ingénieur IA appliquée, Arcade AI (moteur de jeu natif IA)',
    dates: 'Fév. 2026 – présent · Paris',
    intro:
      'Ingénieur central du système d’agents qui transforme un prompt en jeu 3D jouable : boucle d’outils unique, compétences à la demande, sous-agents spécialistes (monde, logique, VFX, UI, audio) et mémoire par niveau. La fiabilité vient du système, pas du prompt : contrats typés, portes de validation, plafonds de coût et disjoncteurs d’échecs. Cinq sujets que j’y ai portés, chacun rejoué dans la vue 3D.',
  },
  phases: ['Problème', 'Construction', 'Mesure', 'Résultat'],
  cases: [
    {
      id: 'benchmark',
      kicker: 'Benchmark de génération, mené de bout en bout',
      title: 'Un jeu valide n’est pas le jeu demandé',
      problem:
        'Un agent peut produire une sortie qui passe toutes les validations de schéma et rester un jeu creux. Quelle architecture d’agents construit réellement ce que le joueur a demandé, et à quel coût ?',
      built:
        'J’ai cadré et mené une étude de 7 architectures d’agents face à la référence de production, et construit ce qu’il fallait pour cela : le banc d’essai, un score de couverture fonctionnelle et le rapport de résultats.',
      measured:
        'La référence de production : 4,6 minutes médianes pour un premier jeu, 21 appels modèle. Chaque architecture est notée sur la part des fonctionnalités demandées présentes dans le jeu final.',
      result:
        'Une sortie valide peut rester un jeu creux, avec 8 % des fonctionnalités demandées. Une stratégie par checklist atteint 92 %.',
      metrics: [
        { value: '7', label: 'architectures comparées' },
        { value: '4,6 min', label: 'médiane de référence, premier jeu' },
        { value: '21', label: 'appels modèle de référence' },
      ],
      bar: { before: 8, after: 92, beforeLabel: 'sortie valide', afterLabel: 'stratégie par checklist' },
    },
    {
      id: 'profiler',
      kicker: 'Observabilité',
      title: 'Remplacer les impressions par des chiffres',
      problem:
        'Sans instruments, « l’agent s’est trompé quelque part » et « ça rame » restent des impressions. Les décisions sur les agents comme sur les performances du moteur demandent des chiffres.',
      built:
        'Un débogueur de traces d’agents, et un panneau de profilage dans le moteur qui affiche le coût par système et par image.',
      measured:
        'Un benchmark de horde : augmenter le nombre de PNJ actifs et lire le coût de chaque système sur le profileur.',
      result: 'Un budget mesuré d’environ 100 PNJ actifs à 60 FPS.',
      metrics: [
        { value: '≈100', label: 'PNJ actifs à 60 FPS' },
        { value: 'par système', label: 'coût par image dans le profileur' },
      ],
    },
    {
      id: 'netcode',
      kicker: 'Netcode multijoueur, prouvé sous latence',
      title: 'Déplacement et tir équitables sur un vrai réseau',
      problem:
        'Sur un vrai réseau, chaque joueur voit le passé. Le déplacement doit rester immédiat et les tirs doivent être jugés équitablement, alors que le serveur reste la seule autorité.',
      built:
        'Déplacement et tir server-authoritative sur Node.js, Colyseus et Rapier, avec prédiction client, réconciliation et compensation de latence.',
      measured:
        'Des sessions de jeu automatisées à deux clients avec latence injectée : le comportement est vérifié par une exécution, pas au ressenti.',
      result: 'La compensation de latence remonte jusqu’à 250 ms, vérifiée par ces sessions.',
      metrics: [
        { value: '250 ms', label: 'de compensation de latence' },
        { value: '2 clients', label: 'sessions automatisées, latence injectée' },
      ],
    },
    {
      id: 'pipelines',
      kicker: 'Autonomie multi-domaines',
      title: 'Pipelines 3D, VFX et audio montés de zéro',
      problem:
        'Un jeu généré a besoin de modèles, d’effets et de sons, et chaque asset généré doit s’intégrer au moteur sans retouche manuelle.',
      built:
        'J’ai monté de zéro, sans relais, les pipelines 3D, VFX et audio : modèles d’armes image-vers-3D, sons générés et VFX génératifs.',
      measured:
        'Chaque pipeline contrôle sa propre sortie : sélection et nettoyage automatiques pour les sons, alignement automatique sur un contrat de prise en main pour les modèles, boucle multimodale rendu → critique → retouche pour les VFX.',
      result: '97 sons générés et 42 modèles d’armes image-vers-3D, alignés automatiquement sur le contrat de prise en main.',
      metrics: [
        { value: '97', label: 'sons générés, sélectionnés et nettoyés automatiquement' },
        { value: '42', label: 'modèles d’armes image-vers-3D, alignés automatiquement' },
      ],
    },
    {
      id: 'shipping',
      kicker: 'Livraison',
      title: 'Des jeux complets comme sondes de couverture du moteur',
      problem: 'Un moteur ne révèle ses manques que lorsqu’on y livre un jeu complet.',
      built:
        '10+ jeux et cartes complets livrés en production : un FPS tactique en ligne avec bots et 34 armes pilotées par les données, des jeux de kart, des mondes voxel. Et un serveur MCP pour que des agents de code externes (Claude Code, Codex) construisent et inspectent des jeux en direct.',
      measured:
        'Chaque jeu est une sonde de couverture : chaque manque révélé a été comblé par une primitive générique du moteur, pas par un correctif isolé.',
      result: '10+ jeux et cartes complets en production, et un moteur enrichi d’une primitive générique pour chaque manque révélé.',
      metrics: [
        { value: '10+', label: 'jeux et cartes complets en production' },
        { value: '34', label: 'armes pilotées par les données dans le FPS tactique' },
      ],
    },
  ],
  earlier: {
    heading: 'Avant Arcade',
    jobs: [
      {
        org: 'Lanterns Studio',
        orgNote: 'Développement de jeux',
        role: 'Stagiaire Programmeur IA',
        dates: 'Juil. 2025 – Août 2025',
        place: 'Tunis, Tunisie',
        points: [
          'Pipeline de génération texte-vers-3D (prompt → maillage + matériaux PBR → GLB) basé sur EmbodiedGen, avec une application Gradio (modes auto et manuel, seeds, suppression de fond, tri d’images) et des contrôles QA intégrés.',
          'Post-traitement Blender headless (retopologie, décimation, export OBJ/GLB) ; déploiement sur Hugging Face Spaces avec une image Docker GPU + Blender.',
        ],
        metrics: [],
      },
      {
        org: 'AXIO',
        orgNote: 'Apprentissage interactif piloté par IA',
        role: 'Développeur Fullstack, temps partiel',
        dates: 'Janv. 2025 – Juin 2025',
        place: 'Tunis, Tunisie',
        points: [
          'Plateforme d’apprentissage adaptatif : suivi de la progression de chaque apprenant et parcours personnalisé (choix des leçons suivantes) ; détection de la frustration via le temps passé, puis agent LLM avec RAG sur les cours pour débloquer l’apprenant.',
          'Architecture modulaire avec contrôle d’accès granulaire ; CI/CD avec tests unitaires et E2E.',
        ],
        metrics: [{ value: '−35 %', label: 'temps de release' }],
      },
      {
        org: 'Freelance',
        orgNote: 'Upwork et clients directs',
        role: 'Ingénieur Logiciel',
        dates: 'Juin 2023 – Mai 2025',
        place: 'À distance',
        points: [
          'Gameplay adaptatif piloté par les émotions (plugin Unity, deep learning) : reconnaissance faciale des émotions en temps réel reliée à la logique de jeu, avec tableau de bord d’analyse.',
          'Conception et livraison d’un jeu mobile hyper-casual (Unity, C#) ; automatisation du traitement d’images Gerber en Python.',
          'Automatisation de trading pour IFXSuccess (MQL4/5) : expert advisors de gestion adaptative du risque, tableaux de bord temps réel, multithreading et cache.',
        ],
        metrics: [
          { value: '−75 %', label: 'cycles de pré-production (automatisation Gerber)' },
          { value: '−70 %', label: 'charge CPU (automatisation de trading)' },
        ],
      },
    ],
  },
  toolbox: {
    heading: 'Outils',
    groups: [
      {
        label: 'IA agentique',
        details:
          'Conception de harness d’agents, tool use, MCP, orchestration multi-agents, RAG, mémoire d’agent, context engineering, sorties structurées, garde-fous, benchmarking, évaluation et traçage',
      },
      {
        label: 'IA générative',
        details:
          'GPT, Gemini, Claude, boucles de critique multimodale, texte/image-vers-3D, audio et VFX génératifs, personnalisation de LLM, TensorFlow, deep learning',
      },
      {
        label: 'Moteurs et 3D',
        details: 'PlayCanvas, WebGPU, Unity, Unreal Engine (Blueprints, C++), Three.js, OpenGL, HLSL, Blender',
      },
      {
        label: 'Réseau et backend',
        details: 'Colyseus, Rapier, Node.js, NestJS, Socket.io, PostgreSQL, Prisma, Docker, Cloud Run, CI/CD',
      },
      { label: 'Langages', details: 'TypeScript, JavaScript, Python, C#, C++, Java' },
    ],
  },
  education: {
    heading: 'Formation et distinctions',
    items: [
      { label: 'Formation', details: 'Diplôme National d’Ingénieur en Génie Logiciel, INSAT Tunis (2021 – 2026)' },
      { label: 'NVIDIA', details: 'Certification « Efficient Large Language Model (LLM) Customization » (oct. 2024)' },
      { label: 'Game jams', details: 'Android Club Game Jam, 1re place ; Playground Game Jam, 3e place (2024)' },
      { label: 'CTF', details: 'SparkCTF, 1re place ; Cybersphere CTF, 2e place (2024)' },
    ],
  },
  contact: {
    heading: 'Contact',
    text: 'Basé à Paris. Le plus rapide pour me joindre : l’e-mail.',
    email: 'adamldr3@gmail.com',
    linkedin: 'https://www.linkedin.com/in/adam-ladhari',
    github: 'https://github.com/AyyyCn',
  },
  footer:
    'Réalisé avec Three.js et TypeScript. L’île, les karts et les simulations sont générés dans votre navigateur ; rien ici ne provient d’Arcade AI.',
  stage: {
    tag: 'Replay',
    aria: 'Replay 3D des études de cas',
    note: 'Les replays sont construits pour ce site afin d’illustrer chaque sujet. Les valeurs en direct décrivent cette page ; les chiffres du texte sont ceux mesurés.',
    scrub: 'Position du replay',
    load: 'Charger le replay 3D',
    introTitle: 'Un petit monde, cinq sujets',
    introHint: 'Faites défiler pour lancer le replay · glissez pour tourner',
    t: {
      requested: 'demandées',
      present: 'présentes',
      coverage: 'couverture',
      schema: 'schéma',
      valid: 'valide',
      checklist: 'checklist',
      npcs: 'PNJ',
      sim: 'simulation',
      frame: 'image',
      fps: 'fps',
      live: 'en direct, cette page',
      latency: 'latence',
      correction: 'correction max',
      behind: 'vue naïve en retard de',
      corrections: 'réconciliations',
      naive: 'naïf',
      predicted: 'prédit',
      server: 'serveur',
      aligned: 'alignés sur le contrat',
      revision: 'révision vfx',
      bots: 'bots',
      checkpoints: 'checkpoints franchis',
      laps: 'tours',
      wire: 'fil de fer',
    },
  },
};
