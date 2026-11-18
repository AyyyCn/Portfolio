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
      "Adam Ladhari, ingénieur IA appliquée à Paris. Je conçois des agents IA pour la 3D interactive et le jeu vidéo, et je mène chaque sujet du problème au résultat mesuré. Études de cas : benchmarks d’agents, observabilité, multijoueur en ligne, 3D, effets et sons générés.",
  },
  nav: { work: 'Études de cas', projects: 'Projets', toolbox: 'Outils', contact: 'Contact', skip: 'Aller au contenu' },
  hero: {
    "role": "Ingénieur IA appliquée",
    "location": "Paris, France",
    "lead": "Je conçois des agents IA pour la 3D interactive et le jeu vidéo, et je mesure qu’ils fonctionnent",
    "profile": "Je suis ingénieur IA appliquée. Je prends un sujet de bout en bout : cadrer le problème, construire la solution, l’instrumenter, la mesurer et la livrer. Mon terrain est la rencontre entre les agents IA et la 3D temps réel : systèmes d’agents, moteurs de jeu, multijoueur en ligne, 3D, effets et sons générés. Aujourd’hui, je le fais chez Arcade AI, sur les agents qui transforment une idée écrite en jeu multijoueur jouable et sur le moteur qu’ils pilotent.",
    "cta": "Voir les réalisations",
    "what": [
      {
        "title": "Agents IA",
        "text": "Des programmes bâtis sur de grands modèles de langage (GPT, Gemini, Claude) qui planifient, utilisent des outils et vérifient leur propre travail, au lieu de répondre une seule fois."
      },
      {
        "title": "Moteur de jeu et 3D",
        "text": "Le logiciel qui fait tourner un jeu : mondes 3D, physique, personnages, effets visuels, son et multijoueur en ligne."
      },
      {
        "title": "Résultats mesurés",
        "text": "Benchmarks, profileurs et tests automatisés, pour que les décisions reposent sur des chiffres et non sur des impressions."
      }
    ]
  },
  headline: [
    {
      "value": "8 % → 92 %",
      "label": "des fonctionnalités demandées par le joueur se retrouvent dans le jeu généré : une sortie qui passe seulement les contrôles de format, puis la stratégie par checklist"
    },
    {
      "value": "7",
      "label": "façons d’organiser les agents IA, comparées sur le même banc d’essai"
    },
    {
      "value": "≈100",
      "label": "personnages pilotés par l’ordinateur à 60 images par seconde, limite mesurée"
    },
    {
      "value": "250 ms",
      "label": "de délai réseau absorbé sans fausser les tirs en ligne"
    },
    {
      "value": "10+",
      "label": "jeux et cartes complets livrés en production"
    }
  ],
  workHeading: "Études de cas",
  workIntro: "Chaque cas suit les mêmes quatre étapes : le problème, ce que j’ai construit, comment je l’ai mesuré, et le résultat. Le panneau 3D le rejoue au fil du défilement.",
  phases: [
    "Problème",
    "Ce que j’ai construit",
    "Comment j’ai mesuré",
    "Résultat"
  ],
  work: [
    {
      "org": "Arcade AI · Moteur de jeu natif IA",
      "role": "Ingénieur IA appliquée",
      "dates": "Fév. 2026 – présent · Paris",
      "intro": "Arcade AI est un moteur de jeu où les jeux se créent par la conversation : on décrit le jeu voulu, et des agents IA construisent un jeu 3D multijoueur jouable. Je suis ingénieur central sur ce système d’agents et sur le moteur en dessous. Le système est un agent qui travaille en boucle (réfléchir, utiliser un outil, vérifier le résultat), aidé par des agents spécialistes pour le monde, les règles du jeu, les effets visuels, l’interface et le son, avec une mémoire par niveau. Sa fiabilité vient de contrôles intégrés au système, pas de l’espoir que l’IA se comporte bien : formats de sortie stricts, étapes de validation, plafonds de coût et arrêts automatiques en cas d’échecs répétés. Cinq sujets que j’y ai portés :",
      "cases": [
        {
          "id": "benchmark",
          "kicker": "Benchmark d’architectures d’agents IA",
          "title": "L’IA construit-elle le jeu qui a été demandé ?",
          "summary": "J’ai mené l’étude montrant qu’un jeu généré peut passer tous les contrôles automatiques et ne contenir que 8 % de ce qui était demandé, et qu’une approche par checklist atteint 92 %.",
          "problem": "Quand une IA génère un jeu, des contrôles automatiques vérifient que la sortie a le bon format. Mais un jeu peut avoir le bon format et être presque vide. Il fallait savoir quelle façon d’organiser les agents livre réellement ce que le joueur a décrit, et à quel coût en temps et en appels au modèle d’IA.",
          "built": "J’ai cadré et mené une étude comparant 7 architectures d’agents, c’est-à-dire 7 façons différentes d’organiser les agents, à la version en production. J’ai construit ce qu’il fallait pour cela : le banc d’essai qui les exécute toutes, un score qui compte combien de fonctionnalités demandées sont réellement présentes dans le jeu final, et le rapport de résultats.",
          "measured": "La version en production demandait en médiane 4,6 minutes et 21 appels au modèle d’IA pour produire un premier jeu. Chaque architecture a été notée de la même façon : la part des fonctionnalités demandées présentes dans le jeu final.",
          "result": "Une sortie qui passe les contrôles de format peut rester un jeu creux, avec seulement 8 % des fonctionnalités demandées. Une stratégie par checklist atteint 92 %.",
          "metrics": [
            {
              "value": "7",
              "label": "architectures d’agents comparées"
            },
            {
              "value": "4,6 min",
              "label": "temps médian pour un premier jeu, version en production"
            },
            {
              "value": "21",
              "label": "appels au modèle d’IA, version en production"
            }
          ],
          "bar": {
            "before": 8,
            "after": 92,
            "beforeLabel": "passe les contrôles de format",
            "afterLabel": "stratégie par checklist"
          }
        },
        {
          "id": "profiler",
          "kicker": "Observabilité",
          "title": "Voir ce que font réellement l’IA et le moteur",
          "summary": "J’ai construit les outils qui montrent, étape par étape, ce qu’un agent IA a fait, et combien de temps de calcul coûte chaque partie du jeu.",
          "problem": "Quand un agent IA donne un mauvais résultat, ou qu’un jeu rame, la première explication est souvent une supposition. Sans instruments, personne ne peut dire où cela a dérapé ni quelle partie est lente.",
          "built": "Deux outils. Un débogueur de traces, qui enregistre chaque étape d’un agent et permet de les inspecter ensuite. Et un panneau de profilage dans le moteur, qui montre combien de temps chaque système du jeu consomme à chaque image affichée.",
          "measured": "Un test de charge, le benchmark de horde : ajouter de plus en plus de personnages pilotés par l’ordinateur (PNJ) et lire sur le profileur ce que coûte chaque système.",
          "result": "Une limite mesurée à la place d’une impression : environ 100 PNJ actifs alors que le jeu tourne encore à 60 images par seconde.",
          "metrics": [
            {
              "value": "≈100",
              "label": "PNJ actifs à 60 images par seconde"
            },
            {
              "value": "par système",
              "label": "coût de chaque image, affiché dans le profileur"
            }
          ]
        },
        {
          "id": "netcode",
          "kicker": "Multijoueur en ligne",
          "title": "Rendre un jeu en ligne immédiat et équitable",
          "summary": "J’ai construit la couche réseau qui garde un jeu en ligne réactif et équitable quand les joueurs ont une connexion lente, et je l’ai prouvé par des sessions de jeu automatisées.",
          "problem": "En ligne, chaque message met du temps à voyager : chaque joueur voit donc une version légèrement ancienne du jeu. Sans précaution, le personnage réagit en retard et des tirs qui semblaient justes manquent leur cible. Et seul le serveur doit décider de ce qui s’est réellement passé.",
          "built": "Un déplacement et un tir où le serveur a le dernier mot (server-authoritative), avec Node.js, Colyseus et Rapier. L’appareil du joueur affiche tout de suite le résultat d’une action, puis se corrige si le serveur n’est pas d’accord (prédiction client et réconciliation). Pour les tirs, le serveur remonte dans le temps jusqu’à la position de la cible au moment où le joueur a tiré (compensation de latence).",
          "measured": "Des sessions de jeu automatisées à deux clients, avec un délai réseau injecté volontairement : le comportement est vérifié par une exécution, pas au ressenti.",
          "result": "La compensation de latence remonte jusqu’à 250 ms, vérifiée par ces sessions automatisées.",
          "metrics": [
            {
              "value": "250 ms",
              "label": "de délai que le serveur peut remonter"
            },
            {
              "value": "2 clients",
              "label": "sessions automatisées avec délai injecté"
            }
          ]
        },
        {
          "id": "pipelines",
          "kicker": "Modèles 3D, effets et sons générés",
          "title": "Trois pipelines de contenu montés seul, de zéro",
          "summary": "J’ai construit, sans relais, les systèmes qui génèrent les modèles 3D, les effets visuels et les sons d’un jeu, chacun contrôlant sa propre sortie.",
          "problem": "Un jeu généré a besoin d’objets, d’effets visuels et de sons. L’IA peut les générer, mais chaque résultat doit s’intégrer au moteur sans qu’une personne le corrige à la main.",
          "built": "Trois pipelines, c’est-à-dire des chaînes de production automatiques, montés de zéro en autonomie : des modèles d’armes 3D générés à partir d’images, des effets sonores générés et des effets visuels (VFX) générés.",
          "measured": "Chaque pipeline contrôle sa propre sortie. Sons : les candidats sont notés automatiquement, puis nettoyés. Modèles 3D : chacun est aligné automatiquement sur un contrat de prise en main, une règle fixe sur la façon dont un personnage le tient. Effets visuels : l’effet est rendu, un modèle d’IA regarde l’image et la critique, puis l’effet est retouché, en boucle.",
          "result": "97 effets sonores générés et 42 modèles d’armes 3D, tous alignés automatiquement sur le contrat de prise en main.",
          "metrics": [
            {
              "value": "97",
              "label": "effets sonores générés, notés et nettoyés automatiquement"
            },
            {
              "value": "42",
              "label": "modèles d’armes 3D générés à partir d’images, alignés automatiquement"
            }
          ]
        },
        {
          "id": "shipping",
          "kicker": "Livraison",
          "title": "Livrer des jeux complets pour trouver ce qui manque au moteur",
          "summary": "J’ai livré plus de dix jeux et cartes complets en production, et utilisé chacun pour trouver et combler un manque du moteur.",
          "problem": "Un moteur de jeu paraît complet jusqu’à ce qu’on essaie d’y terminer un vrai jeu. Les pièces manquantes n’apparaissent qu’à ce moment-là.",
          "built": "10+ jeux et cartes complets livrés en production : un jeu de tir tactique en ligne avec des adversaires pilotés par l’ordinateur et 34 armes définies par des données, des jeux de kart et des mondes voxel (en blocs). J’ai aussi construit un serveur MCP, une connexion standard qui permet à des assistants de programmation IA externes comme Claude Code ou Codex de construire et d’inspecter des jeux en direct.",
          "measured": "Chaque jeu a servi de sonde de ce que couvre le moteur : chaque manque révélé a été comblé par une brique générique, utilisable par tous les jeux, et non par un correctif propre à ce jeu.",
          "result": "10+ jeux et cartes complets en production, et un moteur enrichi d’une brique générique pour chaque manque révélé.",
          "metrics": [
            {
              "value": "10+",
              "label": "jeux et cartes complets en production"
            },
            {
              "value": "34",
              "label": "armes définies par des données dans le jeu de tir tactique"
            }
          ]
        }
      ]
    },
    {
      "org": "Lanterns Studio · Développement de jeux",
      "role": "Stagiaire Programmeur IA",
      "dates": "Juil. 2025 – Août 2025 · Tunis",
      "intro": "Deux mois de stage dans un studio de jeux, sur un seul sujet : transformer une description écrite en objet 3D utilisable par un jeu.",
      "cases": [
        {
          "id": "textto3d",
          "kicker": "Du texte à la 3D",
          "title": "D’une phrase à un objet 3D prêt pour le jeu",
          "summary": "J’ai construit un outil qui transforme une description écrite en objet 3D avec ses matériaux, dans un fichier qu’un jeu peut charger.",
          "problem": "L’IA sait produire une forme 3D à partir d’une phrase, mais une forme brute n’est pas encore un asset de jeu. Il lui faut des matériaux, un nombre de triangles raisonnable et un format de fichier que le moteur sait charger, et la personne qui utilise l’outil doit pouvoir orienter le résultat.",
          "built": "Un pipeline de génération basé sur EmbodiedGen, un système de génération texte-vers-3D : à partir du texte, il produit un maillage 3D avec des matériaux réalistes (PBR) et exporte un fichier GLB, un format 3D standard. Autour, une application réalisée avec Gradio : modes automatique et manuel, seeds pour reproduire un résultat, suppression de fond et tri des images candidates.",
          "measured": "Des contrôles qualité intégrés à chaque génération, puis un nettoyage automatique dans Blender sans interface graphique : reconstruction d’un maillage plus propre (retopologie), réduction du nombre de triangles (décimation) et export en OBJ ou GLB.",
          "result": "Un pipeline fonctionnel de la phrase au fichier GLB, déployé en ligne sur Hugging Face Spaces avec une image Docker incluant le support GPU et Blender.",
          "metrics": [
            {
              "value": "texte → GLB",
              "label": "maillage et matériaux réalistes dans un seul pipeline"
            },
            {
              "value": "Hugging Face Spaces",
              "label": "déployé en ligne, image Docker GPU + Blender"
            }
          ]
        }
      ]
    },
    {
      "org": "AXIO · Apprentissage interactif piloté par IA",
      "role": "Développeur Fullstack, temps partiel",
      "dates": "Janv. 2025 – Juin 2025 · Tunis",
      "intro": "AXIO est une plateforme d’apprentissage en ligne qui s’adapte à chaque apprenant. J’y ai travaillé à temps partiel pendant mon cycle ingénieur, côté serveur comme côté interface.",
      "cases": [
        {
          "id": "learning",
          "kicker": "Apprentissage adaptatif avec un assistant IA",
          "title": "Repérer l’apprenant bloqué, et l’aider à ce moment-là",
          "summary": "J’ai construit une plateforme d’apprentissage qui adapte le parcours à chaque apprenant et fait intervenir un assistant IA lorsqu’elle détecte qu’il est bloqué.",
          "problem": "Chaque apprenant avance à son rythme, et un apprenant bloqué a besoin d’aide à ce moment-là, pas à la fin du cours.",
          "built": "Une plateforme d’apprentissage adaptatif : elle suit la progression de chaque apprenant et personnalise son parcours en choisissant les leçons suivantes. Elle est construite en modules indépendants, avec un contrôle fin de qui peut accéder à quoi.",
          "measured": "La plateforme détecte la frustration à partir du temps passé sur une tâche. Un agent IA intervient alors et répond à partir des cours eux-mêmes, une technique appelée RAG (génération augmentée par la recherche). Chaque mise en production passe par des tests automatisés, unitaires et de bout en bout (CI/CD).",
          "result": "Une plateforme qui réagit à chaque apprenant, et un temps de release réduit de 35 %.",
          "metrics": [
            {
              "value": "−35 %",
              "label": "temps de release, grâce aux tests et à la livraison automatisés"
            },
            {
              "value": "Agent IA + RAG",
              "label": "répond à partir de la documentation des cours"
            }
          ]
        }
      ]
    },
    {
      "org": "Freelance · Upwork et clients directs",
      "role": "Ingénieur Logiciel",
      "dates": "Juin 2023 – Mai 2025 · À distance",
      "intro": "Deux ans de missions freelance pour des clients, en parallèle de mes études : jeux, automatisation et outils de trading.",
      "cases": [
        {
          "id": "emotion",
          "kicker": "Projets clients",
          "title": "Trois clients, trois problèmes, trois systèmes livrés",
          "summary": "En freelance, j’ai livré un système de jeu qui réagit aux émotions du joueur, une automatisation qui a réduit de 75 % les cycles de pré-production, et des outils de trading consommant 70 % de CPU en moins.",
          "problem": "Chaque client est venu avec un besoin différent : un jeu qui s’adapte à ce que ressent le joueur, des fichiers d’images de circuits imprimés (Gerber) traités à la main avant la production, et des programmes de trading automatisé qui sollicitaient trop le processeur.",
          "built": "Un plugin pour le moteur de jeu Unity qui reconnaît en temps réel l’émotion du joueur sur son visage grâce au deep learning et pilote la logique du jeu avec. Un jeu mobile hyper-casual, conçu et livré avec Unity et C#. Un programme Python qui traite automatiquement les images Gerber. Et des expert advisors (programmes de trading automatisé, en MQL4/5) qui gèrent le risque de façon adaptative.",
          "measured": "Un tableau de bord d’analyse des émotions des joueurs pour le plugin de jeu, et des tableaux de bord temps réel pour les programmes de trading.",
          "result": "Des cycles de pré-production réduits de 75 % grâce à l’automatisation Gerber, et une charge CPU réduite de 70 % sur les programmes de trading (multithreading, cache).",
          "metrics": [
            {
              "value": "−75 %",
              "label": "cycles de pré-production, automatisation Gerber"
            },
            {
              "value": "−70 %",
              "label": "charge CPU, programmes de trading"
            }
          ]
        }
      ]
    }
  ],
  projects: {
    "heading": "Projets",
    "intro": "Projets personnels, de game jam et universitaires : là d’où vient le goût du jeu, de l’IA et des outils.",
    "code": "Code",
    "groups": [
      {
        "label": "Jeux",
        "items": [
          {
            "title": "Faysa",
            "image": "faysa",
            "note": "Game jam, 1re place",
            "text": "Un jeu de puzzle temporel où l’on coopère avec ses versions passées pour résoudre des défis de plateforme."
          },
          {
            "title": "Nos · DreamScape: The Lucid Mission",
            "image": "nos",
            "note": "Game jam, 3e place",
            "text": "Une aventure onirique : un rêveur lucide, guidé par un génie, doit sauver le monde des rêves. Chaque mission apporte un nouveau style de jeu."
          },
          {
            "title": "EchoMIDI",
            "image": "echomidi",
            "link": "https://github.com/AyyyCn/EchoMIDI",
            "text": "Un jeu de mémoire rythmique sous Unity URP avec support MIDI : rejouer une séquence de notes qui s’allonge, au clavier MIDI ou au piano virtuel. Mode guidé, vélocité, difficulté dynamique."
          },
          {
            "title": "Fruit Slicer VR",
            "image": "fruit",
            "link": "https://github.com/AyyyCn/FruitSlicerVR",
            "text": "Un jeu VR de découpe de fruits sous Unity, avec physique temps réel et collision de lame."
          },
          {
            "title": "Pencil Sharpener",
            "image": "pencil",
            "text": "Un jeu hyper-casual avec une seule mission : tailler des crayons, vite. Pensé pour des parties courtes façon mobile."
          },
          {
            "title": "The Boiz",
            "image": "theboiz",
            "text": "Un escape game collaboratif fait avec et pour des amis."
          }
        ]
      },
      {
        "label": "IA",
        "items": [
          {
            "title": "Parki",
            "image": "parki",
            "link": "https://github.com/AyyyCn/Parki",
            "text": "Un système de parking intelligent avec reconnaissance de plaques et suivi mobile. Python, Flutter, YOLO."
          },
          {
            "title": "GameDB",
            "image": "gamedb",
            "link": "https://github.com/AyyyCn/Game-DB",
            "text": "Un outil qui collecte les commentaires Reddit et YouTube pour analyser ce que les joueurs aiment ou détestent dans un jeu. Python, BERT, web scraping."
          },
          {
            "title": "Formation Recommender",
            "image": "junior",
            "link": "https://github.com/AyyyCn/JuniorRush_ML",
            "text": "Un système de recommandation multi-label qui propose jusqu’à trois formations par utilisateur, avec seuils de confiance et calibration. Python, XGBoost, scikit-learn."
          }
        ]
      },
      {
        "label": "Outils",
        "items": [
          {
            "title": "Img2Gerber",
            "image": "gerber",
            "text": "Un pipeline d’automatisation qui convertit par lots des designs en couches (PNG/SVG) en fichiers Gerber KiCad prêts pour la production. Python, API KiCad, Inkscape CLI, OpenCV."
          },
          {
            "title": "Gurobi Wrapper",
            "image": "gurobi",
            "text": "Un outil de bureau pour résoudre des problèmes d’optimisation LP/ILP avec Gurobi, avec une interface pour les entrées, sorties et réglages."
          }
        ]
      },
      {
        "label": "Web",
        "items": [
          {
            "title": "Elmarchi",
            "image": "elmarchi",
            "link": "https://github.com/RaedAddala/El-Marchi",
            "text": "Une marketplace en ligne développée en Angular, projet universitaire en équipe."
          },
          {
            "title": "Tuniscape",
            "image": "tuniscape",
            "link": "https://github.com/ElyesBelgouthi/Tuniscape",
            "text": "Le site d’une agence de voyage, développé avec Symfony : réservation, formulaires, rendu côté serveur."
          },
          {
            "title": "InnovaBank",
            "image": "innovabank",
            "text": "Mon premier projet web universitaire : une interface de banque simulée en HTML, CSS et JavaScript."
          }
        ]
      }
    ]
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
    artstation: 'https://www.artstation.com/ayyycn',
    youtube: 'https://www.youtube.com/@acn8713',
  },
  footer:
    'Réalisé avec Three.js et TypeScript. L’île, les karts et les simulations sont générés dans votre navigateur ; rien ici ne provient d’Arcade AI.',
  stage: {
    phases: ['Problème', 'Construction', 'Mesure', 'Résultat'],
    tag: 'Replay',
    aria: 'Replay 3D des études de cas',
    note: 'Les replays sont construits pour ce site afin d’illustrer chaque sujet. Les valeurs en direct décrivent cette page ; les chiffres du texte sont ceux mesurés.',
    scrub: 'Position du replay',
    load: 'Charger le replay 3D',
    loading: 'Chargement du replay 3D…',
    introTitle: 'Un petit monde, huit sujets',
    introHint: 'Faites défiler pour lancer le replay · glissez pour tourner',
    t: {
      prompt: "prompt",
      promptText: "« un rocher moussu »",
      triangles: "triangles",
      qa: "contrôles QA",
      raw: "maillage brut",
      decimated: "décimé",
      textured: "matériaux",
      learners: "apprenants",
      lessons: "leçons terminées",
      timeOnTask: "temps sur la tâche",
      frustration: "frustration",
      detected: "détectée",
      agent: "agent",
      unblocked: "débloqué",
      watching: "surveillance",
      emotionLabel: "émotion",
      pace: "rythme du jeu",
      calm: "calme",
      frustrated: "frustré",
      joy: "joie",
      off: "inactif",
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
