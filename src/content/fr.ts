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
  nav: { about: 'À propos', experience: 'Parcours', work: 'Réalisations', projects: 'Projets', contact: 'Contact', skip: 'Aller au contenu' },
  hero: {
    "greeting": "Bonjour, je suis Adam",
    "role": "Ingénieur IA appliquée",
    "location": "Paris, France",
    "lead": "Je conçois des systèmes d’IA pour la 3D interactive et le jeu vidéo.",
    "intro": "Je suis ingénieur IA appliquée chez Arcade AI, où l’on décrit un jeu avec ses mots et où des agents IA le construisent. Je travaille sur ces agents et sur le moteur de jeu qu’ils pilotent. Avant cela, j’ai construit un outil texte-vers-3D pour un studio de jeux, une plateforme d’apprentissage avec IA, et des jeux et outils pour des clients en freelance.",
    "cta": "Voir mes réalisations",
    "cta2": "Me contacter",
    "viewer": "Un petit monde de jeu, généré dans votre navigateur. Faites-le tourner à la souris"
  },
  about: {
    "heading": "À propos",
    "paragraphs": [
      "Je suis ingénieur logiciel spécialisé en IA appliquée. Diplômé en génie logiciel de l’INSAT à Tunis en 2026, après des stages et des missions freelance dans le jeu vidéo, la 3D et l’IA, je travaille aujourd’hui à Paris chez Arcade AI.",
      "Ce que j’aime le plus, c’est porter un sujet de bout en bout : comprendre le problème, construire la solution, et vérifier par de vrais tests et de vraies mesures qu’elle fonctionne avant de la livrer.",
      "Tout a commencé par le jeu vidéo. J’ai remporté une game jam et terminé troisième d’une autre, et je continue de créer de petits jeux et des expériences d’IA pour comprendre comment les choses fonctionnent."
    ],
    "facts": [
      {
        "label": "Basé à",
        "value": "Paris, France"
      },
      {
        "label": "Actuellement",
        "value": "Ingénieur IA appliquée, Arcade AI"
      },
      {
        "label": "Formation",
        "value": "Diplôme d’ingénieur en génie logiciel, INSAT Tunis, 2026"
      },
      {
        "label": "Domaines",
        "value": "Agents IA, moteurs de jeu, multijoueur en ligne, 3D générée"
      }
    ]
  },
  experience: {
    "heading": "Parcours",
    "jobs": [
      {
        "org": "Arcade AI",
        "orgNote": "Moteur de jeu natif IA",
        "role": "Ingénieur IA appliquée",
        "dates": "Fév. 2026 – présent",
        "place": "Paris",
        "points": [
          "Ingénieur central du système d’agents IA qui transforme une description écrite en jeu 3D multijoueur jouable, et du moteur qu’il pilote.",
          "Mené une étude de 7 architectures d’agents : une stratégie par checklist livre 92 % des fonctionnalités demandées, contre 8 % pour une sortie qui passe seulement les contrôles de format.",
          "Construit le multijoueur en ligne : le serveur décide de ce qui se passe, la vue du joueur réagit immédiatement, et les tirs restent équitables jusqu’à 250 ms de délai réseau.",
          "Construit seul, de zéro, les pipelines qui génèrent modèles 3D, sons et effets visuels, ainsi que les outils pour déboguer les agents et profiler le moteur.",
          "Livré 10+ jeux et cartes complets en production, dont un jeu de tir tactique en ligne avec 34 armes, des jeux de kart et des mondes voxel."
        ]
      },
      {
        "org": "Lanterns Studio",
        "orgNote": "Studio de jeux",
        "role": "Stagiaire Programmeur IA",
        "dates": "Juil. – Août 2025",
        "place": "Tunis",
        "points": [
          "Construit un pipeline texte-vers-3D : d’une phrase à un modèle 3D avec des matériaux réalistes, dans un fichier qu’un jeu peut charger.",
          "Ajouté un nettoyage automatique dans Blender et des contrôles qualité, et déployé l’outil en ligne sur Hugging Face Spaces."
        ]
      },
      {
        "org": "AXIO",
        "orgNote": "Plateforme d’apprentissage avec IA",
        "role": "Développeur Fullstack, temps partiel",
        "dates": "Janv. – Juin 2025",
        "place": "Tunis",
        "points": [
          "Construit une plateforme d’apprentissage adaptatif qui choisit les prochaines leçons de chaque apprenant et fait intervenir un assistant IA quand il bloque.",
          "Mis en place les tests et la livraison automatisés, ce qui a réduit le temps de release de 35 %."
        ]
      },
      {
        "org": "Freelance",
        "orgNote": "Upwork et clients directs",
        "role": "Ingénieur Logiciel",
        "dates": "Juin 2023 – Mai 2025",
        "place": "À distance",
        "points": [
          "Un plugin Unity qui lit en temps réel l’émotion sur le visage du joueur et adapte le gameplay.",
          "Un jeu mobile hyper-casual, conçu et livré sous Unity.",
          "Des automatisations qui ont réduit de 75 % les cycles de pré-production d’un client, et des outils de trading consommant 70 % de CPU en moins."
        ]
      },
      {
        "org": "INSAT",
        "orgNote": "École d’ingénieurs, Tunis",
        "role": "Diplôme National d’Ingénieur en Génie Logiciel",
        "dates": "2021 – 2026",
        "place": "Tunis",
        "points": []
      }
    ]
  },
  workSection: {
    "heading": "Réalisations",
    "intro": "Huit choses que j’ai construites, expliquées simplement. Chacune s’accompagne d’une démo 3D interactive à ouvrir.",
    "demo": "Ouvrir la démo 3D",
    "read": "Lire le détail",
    "close": "Fermer",
    "prev": "Étape précédente",
    "next": "Étape suivante"
  },
  phases: ["Le problème", "Ce que j’ai construit", "Comment je l’ai vérifié", "Le résultat"],
  work: [
    {
      "org": "Arcade AI · Moteur de jeu natif IA",
      "role": "Ingénieur IA appliquée",
      "dates": "Fév. 2026 – présent · Paris",
      "intro": "Arcade AI est un moteur de jeu où les jeux se créent par la conversation : on décrit le jeu voulu, et des agents IA construisent un jeu 3D multijoueur jouable. Je suis ingénieur central sur ce système d’agents et sur le moteur en dessous. Le système est un agent qui travaille en boucle (réfléchir, utiliser un outil, vérifier le résultat), aidé par des agents spécialistes pour le monde, les règles du jeu, les effets visuels, l’interface et le son, avec une mémoire par niveau. Sa fiabilité vient de contrôles intégrés au système, pas de l’espoir que l’IA se comporte bien : formats de sortie stricts, étapes de validation, plafonds de coût et arrêts automatiques en cas d’échecs répétés. Cinq sujets que j’y ai portés :",
      "cases": [
        {
          "id": "benchmark",
          "captions": ["Un agent IA construit un jeu en boucle. Chaque passage du contrôle dit « valide », mais une seule des 12 fonctionnalités demandées existe", "La même boucle avec une checklist : des agents spécialistes ajoutent les fonctionnalités demandées une à une", "Un balayage compte ce qui est réellement dans le jeu, de la même façon pour chaque architecture", "11 fonctionnalités sur 12 livrées : 92 %, contre 8 % avant"],
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
          "captions": ["Une foule de personnages poursuit une cible. Y en a-t-il trop ? Sans instruments, impossible à dire", "Deux instruments apparaissent : l’enregistrement pas à pas d’un agent, et le coût de chaque système", "On ajoute des personnages pendant que les barres montrent le coût de chaque système. Ces temps sont mesurés en direct sur cette page", "La réponse devient un chiffre : environ 100 personnages à 60 images par seconde dans le moteur d’Arcade"],
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
          "captions": ["Trois vues du même jeu. Avec le délai réseau, le joueur A voit son propre personnage en retard : le point creux", "Prédiction : le personnage de A bouge tout de suite, puis se corrige quand le serveur n’est pas d’accord", "A tire. Le serveur ramène la cible là où A la voyait, puis juge le tir. Essayez le curseur de latence", "À 250 ms de délai, les tirs touchent encore"],
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
          "captions": ["Du contenu généré brut : une image, des sons candidats, un premier effet approximatif", "Trois chaînes de production démarrent : les images deviennent des modèles 3D, sons et effets sont générés", "Chaque chaîne se contrôle : les modèles s’alignent sur la règle de prise en main, les sons faibles sont écartés, un critique renvoie l’effet", "En sortie : des modèles alignés, les sons retenus, un effet à sa troisième révision"],
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
          "captions": ["Trois jeux très différents, chacun privé de ce qu’il lui faut pour tourner", "Les systèmes partagés s’activent un à un. Les lignes montrent quels jeux utilisent chacun", "Les jeux tournent, couverts par des tests automatisés et des sessions de jeu lancées toutes seules", "Quatre systèmes partagés portent les trois jeux"],
          "kicker": "Systèmes de gameplay",
          "title": "Les systèmes moteur derrière dix jeux livrés",
          "summary": "J’ai construit les systèmes de gameplay réutilisables (armes, véhicules, personnages pilotés par l’ordinateur, animation) qui permettent à des jeux très différents de tourner sur un même moteur, et livré plus de dix jeux et cartes complets pour les prouver.",
          "problem": "Un jeu de tir, un jeu de kart et un monde en blocs demandent des choses très différentes à un moteur. Écrire du code spécifique pour chaque jeu ne tient pas à l’échelle, encore moins quand ce sont des agents IA qui assemblent le jeu.",
          "built": "Des briques de gameplay génériques que tout jeu peut combiner : armes, véhicules simulés physiquement, navigation et comportement des personnages pilotés par l’ordinateur (PNJ), personnages et animation. Les agents les utilisent via une spécification de jeu déclarative, une description structurée du jeu qu’ils rédigent, et le même code tourne en solo et en ligne.",
          "measured": "Chaque brique a été prouvée en livrant des jeux complets dessus : un jeu de tir tactique en ligne avec des adversaires pilotés par l’ordinateur et 34 armes définies uniquement par des données, des jeux de kart et des mondes voxel (en blocs). Chaque manque révélé par un jeu a été comblé par une brique générique, pas par un correctif isolé. Le tout est couvert par 600+ tests automatisés et par des sessions de jeu lancées automatiquement avec plusieurs joueurs simulés. J’ai aussi construit un serveur, au standard MCP, par lequel des assistants de programmation IA externes comme Claude Code ou Codex construisent et inspectent des jeux en direct.",
          "result": "10+ jeux et cartes complets en production, et un moteur enrichi d’une brique générique pour chaque manque révélé.",
          "metrics": [
            {
              "value": "10+",
              "label": "jeux et cartes complets en production"
            },
            {
              "value": "34",
              "label": "armes définies par des données dans le jeu de tir tactique"
            },
            {
              "value": "600+",
              "label": "tests automatisés"
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
          "captions": ["Une phrase en entrée. Des images candidates sont générées et la meilleure est retenue", "Un maillage 3D brut : la bonne forme, beaucoup trop de triangles", "Le nettoyage automatique le réduit à une fraction des triangles et lance les contrôles qualité", "Matériaux appliqués : un objet qu’un jeu peut charger"],
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
          "captions": ["Un apprenant avance dans les leçons sur le parcours prévu", "Sur une leçon, il bloque. L’anneau se remplit à mesure que le temps passé augmente", "Frustration détectée : un agent IA va chercher les documents de cours utiles", "Débloqué, et orienté vers une autre leçon que celle prévue"],
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
          "captions": ["Un jeu au rythme fixe, qui ignore le joueur", "La caméra lit l’expression du joueur et le rythme du jeu la suit", "Un tableau de bord récapitule ce que le joueur a ressenti", "Les deux autres projets clients, avant et après"],
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
    "heading": "Autres projets",
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
    heading: 'Compétences',
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
    heading: 'Distinctions et certifications',
    items: [
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
    introCaption: "Un petit monde de jeu, généré dans votre navigateur. Chaque étude de cas ci-dessous y est rejouée",
    prev: "Cas précédent",
    next: "Cas suivant",
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
