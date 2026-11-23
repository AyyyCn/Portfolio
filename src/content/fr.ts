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
      "Adam Ladhari, ingénieur IA appliquée à Paris. Je conçois des systèmes agentiques pour la 3D interactive : des agents IA qui construisent des jeux, et le moteur qu’ils pilotent, avec ses effets visuels, ses shaders, son multijoueur et ses véhicules.",
  },
  nav: { about: 'À propos', experience: 'Parcours', work: 'Réalisations', projects: 'Projets', contact: 'Contact', skip: 'Aller au contenu' },
  hero: {
    "greeting": "Bonjour, je suis Adam",
    "role": "Ingénieur IA appliquée",
    "location": "Paris, France",
    "lead": "Je conçois des systèmes d’IA pour la 3D interactive et le jeu vidéo.",
    "intro": "Je suis ingénieur IA appliquée chez Arcade AI, où des agents IA transforment une conversation en jeu multijoueur. Je travaille sur ces agents et sur le moteur qu’ils pilotent : effets visuels, shaders, réseau, véhicules et cœur de gameplay. Avant cela, j’ai construit un outil texte-vers-3D pour un studio de jeux, une plateforme d’apprentissage adaptatif, et des jeux et outils pour des clients en freelance.",
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
        "value": "Agents IA, moteurs de jeu, multijoueur en ligne, effets et 3D générés"
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
          "Harness d’agents : ingénieur central du système d’agents qui transforme un prompt en jeu 3D jouable, avec des sous-agents spécialistes (monde, logique, effets, interface, audio), rendu fiable par des contrats typés, des portes de validation, des plafonds de coût et des disjoncteurs.",
          "Texte-vers-VFX : conçu le système qui compile une description écrite en effet visuel, le rend, le fait critiquer par une IA et le retouche jusqu’au bon rendu. Il s’appuie sur une bibliothèque de presets, un atelier d’authoring et une API runtime utilisée par tous les jeux.",
          "Multijoueur : netcode server-authoritative avec prédiction client et compensation de latence jusqu’à 250 ms, parité solo/en ligne garantie par des tests, déploiement sur Kubernetes (GKE).",
          "Cœur du moteur : étendu le moteur avec des primitives génériques (champs de gravité, portails, mondes voxel, zones de touche, capacités) qui rendent possibles de nouveaux types de jeux. 100 jeux complets livrés en production dessus.",
          "Shaders et matériaux : shaders générés depuis un prompt, validés hors écran et réglés en direct, dans un modèle de matériau unique utilisable par les agents.",
          "Véhicules : conçu et réalisé le système de véhicules physiques, jouable en solo et en ligne face à des adversaires IA, et utilisé pour des courses sur circuit, des batailles de kart et des courses à portails."
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
          "Construit une plateforme d’apprentissage adaptatif : suivi de la progression de chaque apprenant, parcours de leçons personnalisé, détection de la frustration via le temps passé, puis agent LLM avec RAG sur les cours pour le débloquer.",
          "Architecture modulaire avec contrôle d’accès granulaire ; tests unitaires et E2E automatisés (CI/CD) réduisant le temps de release de 35 %."
        ]
      },
      {
        "org": "Freelance",
        "orgNote": "Upwork et clients directs",
        "role": "Ingénieur Logiciel",
        "dates": "Juin 2023 – Mai 2025",
        "place": "À distance",
        "points": [
          "Gameplay piloté par les émotions : un plugin Unity qui lit en temps réel l’émotion sur le visage du joueur et adapte le gameplay, avec un tableau de bord d’analyse du ressenti des joueurs.",
          "Un jeu mobile hyper-casual, conçu et livré sous Unity.",
          "Traitement automatisé d’images Gerber en Python, réduisant de 75 % les cycles de pré-production.",
          "Outils de trading automatisé (MQL4/5) pour la gestion adaptative du risque, avec une charge CPU réduite de 70 % (multithreading, cache)."
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
    "intro": "Neuf systèmes que j’ai construits, chacun avec une démo 3D interactive.",
    "demo": "Ouvrir la démo 3D",
    "read": "Étude de cas complète",
    "close": "Fermer",
    "prev": "Étape précédente",
    "next": "Étape suivante"
  },
  phases: ["Problème", "Solution", "Validation", "Résultat"],
  work: [
    {
      "org": "Arcade AI · Moteur de jeu natif IA",
      "role": "Ingénieur IA appliquée",
      "dates": "Fév. 2026 – présent · Paris",
      "intro": "Arcade AI est un moteur de jeu où les jeux se créent par la conversation : on décrit le jeu voulu, et des agents IA construisent un jeu 3D multijoueur jouable. Je travaille des deux côtés : les agents, et le moteur qu’ils pilotent. Six sujets que je porte là-bas :",
      "cases": [
        {
          "id": "harness",
          "captions": ["Un prompt, une seule grosse réponse : une pièce cassée passe dans le jeu et l’exécution continue de dépenser", "Le harness : une boucle d’outils, et des sous-agents spécialistes appelés quand leur partie est nécessaire", "Chaque sortie passe une porte. Celle qui viole son contrat est renvoyée, et une exécution qui échoue en boucle est arrêtée", "Le jeu n’est assemblé qu’à partir des pièces validées"],
          "kicker": "Harness d’agents",
          "title": "Un système d’agents qui construit un jeu entier à partir d’un prompt",
          "summary": "Je suis ingénieur central du système d’agents qui transforme un prompt écrit en jeu 3D jouable, rendu fiable par sa structure plutôt que par son prompt.",
          "problem": "Un jeu est trop gros pour une seule réponse d’IA. Il a un monde, des règles, des effets, une interface et du son, et une seule erreur dans l’un d’eux peut le casser. Demander au modèle d’être prudent ne le rend pas fiable, et une exécution qui déraille peut continuer à dépenser sans avancer.",
          "built": "Un harness, la structure dans laquelle travaillent les agents : une boucle d’outils unique (le modèle choisit un outil, l’utilise et lit le résultat), des compétences chargées seulement quand il le faut, des sous-agents spécialistes pour le monde, la logique de jeu, les effets visuels, l’interface et l’audio, et une mémoire pour chaque niveau.",
          "measured": "Les contrôles font partie du système. Chaque sortie suit un contrat typé, un format strict que le code peut vérifier. Des portes de validation rejettent une sortie qui viole son contrat avant qu’elle n’atteigne le jeu. Des plafonds de coût limitent ce qu’une exécution peut dépenser, et des disjoncteurs arrêtent une exécution qui échoue en boucle.",
          "result": "Une fiabilité qui vient du système, pas du prompt : un prompt entre, et un jeu 3D jouable sort.",
          "metrics": [
            {
              "value": "5",
              "label": "sous-agents spécialistes : monde, logique, VFX, UI, audio"
            },
            {
              "value": "4 garde-fous",
              "label": "contrats typés, portes de validation, plafonds de coût, disjoncteurs"
            }
          ]
        },
        {
          "id": "vfx",
          "captions": ["Une description arrive : « un portail bleu crépitant ». Émettre des particules directement donne une gerbe vague", "La description est compilée en spécification du phénomène, puis rendue", "Une IA regarde le rendu et le critique. La spécification est retouchée et rendue à nouveau", "L’effet qui sonne juste, avec la bibliothèque de presets et l’API runtime qu’appellent les jeux"],
          "kicker": "Texte-vers-VFX",
          "title": "Des effets visuels générés à partir d’une description",
          "summary": "J’ai conçu le système qui transforme la description écrite d’un effet en effet visuel temps réel, vérifié par une IA qui regarde le résultat et demande des corrections.",
          "problem": "Les jeux ont besoin d’effets : feu, étincelles, fumée, magie. Quand la demande est un texte libre, demander à une IA de placer directement des particules donne des effets qui sonnent faux, et rien ne le signale au système.",
          "built": "Un compilateur qui transforme la description en spécification bornée de phénomène. Elle décrit ce qui est simulé (une flamme, une onde de choc, un tourbillon de poussière), pas quelles particules émettre, et reste dans des limites que le moteur sait exécuter. Le moteur rend ensuite cette spécification sous forme d’effet.",
          "measured": "L’effet est rendu, puis un modèle multimodal, une IA capable de lire des images, critique l’image. La spécification est retouchée et rendue à nouveau, en boucle, jusqu’au bon rendu.",
          "result": "Le système texte-vers-VFX, adossé à une bibliothèque de presets, un atelier d’authoring pour créer et ajuster les effets, et une API runtime utilisée par tous les jeux.",
          "metrics": [
            {
              "value": "tous les jeux",
              "label": "utilisent l’API runtime des effets"
            },
            {
              "value": "boucle de critique",
              "label": "rendu, critique, retouche jusqu’au bon rendu"
            }
          ]
        },
        {
          "id": "netcode",
          "captions": ["Trois vues du même jeu. Avec le délai réseau, le joueur A voit son propre personnage en retard : la silhouette transparente", "Prédiction : le personnage de A bouge tout de suite, puis se corrige quand le serveur n’est pas d’accord", "A tire. Le serveur ramène la cible là où A la voyait, puis juge le tir. Essayez le curseur de latence", "À 250 ms de délai, les tirs touchent encore"],
          "kicker": "Multijoueur en ligne",
          "title": "Rendre un jeu en ligne immédiat et équitable",
          "summary": "J’ai construit la couche réseau qui garde les jeux en ligne réactifs et équitables sur des connexions lentes, et l’infrastructure qui fait tourner chaque serveur de jeu.",
          "problem": "En ligne, chaque message met du temps à voyager : chaque joueur voit donc une version légèrement ancienne du jeu. Sans précaution, le personnage réagit en retard et des tirs qui semblaient justes manquent leur cible. Et seul le serveur doit décider de ce qui s’est réellement passé.",
          "built": "Une simulation server-authoritative construite avec Node.js, Colyseus et Rapier : le serveur a le dernier mot, et seul ce qui a changé passe sur le réseau (réplication différentielle). L’appareil du joueur affiche tout de suite le résultat d’une action, puis se corrige si le serveur n’est pas d’accord (prédiction client et réconciliation). Pour les tirs, le serveur remonte dans le temps jusqu’à la position de la cible au moment où le joueur a tiré (compensation de latence). Le tout tourne sur Kubernetes (GKE) : un pod adressable par serveur de jeu, autoscaling, matchmaking et CI/CD.",
          "measured": "Des tests garantissent qu’un jeu se comporte de la même façon en solo et en ligne, avec la même API : un jeu construit pour l’un fonctionne dans l’autre.",
          "result": "Des jeux en ligne qui restent équitables jusqu’à 250 ms de délai réseau, sur des serveurs qui s’adaptent au nombre de parties en cours.",
          "metrics": [
            {
              "value": "250 ms",
              "label": "de délai couverts par la compensation de latence"
            },
            {
              "value": "solo = en ligne",
              "label": "même API, garantie par des tests"
            },
            {
              "value": "1 pod",
              "label": "par serveur de jeu, autoscalé sur GKE"
            }
          ]
        },
        {
          "id": "engine",
          "captions": ["Trois nouveaux types de jeu, chacun avec un besoin que le moteur ne couvre pas encore", "Chaque besoin devient une primitive générique : champs de gravité, portails, mondes voxel, zones de touche, capacités", "Les jeux prennent vie sur les primitives partagées", "100 jeux complets livrés en production"],
          "kicker": "Cœur du moteur",
          "title": "Des primitives de moteur qui rendent possibles de nouveaux types de jeux",
          "summary": "J’ai étendu le cœur du moteur pour rendre possibles de nouveaux types de jeux, chaque besoin résolu par une brique générique. 100 jeux complets ont été livrés en production dessus.",
          "problem": "Chaque nouveau type de jeu demande quelque chose de nouveau au moteur : marcher autour d’une petite planète, passer par un portail, construire avec des blocs. Écrire du code spécial pour chaque jeu ne tient pas, encore moins quand ce sont des agents IA qui assemblent les jeux.",
          "built": "Chaque besoin résolu par une primitive générique plutôt que par du code propre à un jeu : champs de gravité, portails, mondes voxel, zones de touche et capacités. N’importe quel jeu, et n’importe quel agent, peut les combiner.",
          "measured": "Éprouvé par la livraison : des jeux complets construits sur ces primitives et mis en production.",
          "result": "100 jeux complets livrés en production sur le moteur.",
          "metrics": [
            {
              "value": "100",
              "label": "jeux complets livrés en production"
            }
          ]
        },
        {
          "id": "shaders",
          "captions": ["Un prompt demande une surface. Un shader généré à l’aveugle peut échouer : celui-ci n’affiche rien", "Le prompt devient un shader procédural, aux paramètres exposés", "Chaque shader est rendu hors écran et vérifié avant usage. Essayez les curseurs : ils le règlent en direct", "Un seul modèle de matériau : le même objet en matériau PBR standard ou en shader"],
          "kicker": "Shaders et matériaux",
          "title": "Des shaders qu’un agent peut écrire et que chacun peut régler",
          "summary": "J’ai fait des shaders un asset éditable de premier rang : générés depuis un prompt, validés avant usage, et réglés en direct sans les régénérer.",
          "problem": "Un shader est un petit programme exécuté par la carte graphique qui décide de l’apparence d’une surface. En écrire un à la main demande de l’expertise, un shader généré peut ne pas compiler ou ne rien afficher, et changer son rendu implique d’ordinaire de le régénérer.",
          "built": "Un chemin du prompt au shader procédural, avec des paramètres exposés pour être réglés en direct sans régénération. Un modèle de matériau unique couvre les matériaux physiques standard (PBR) comme les shaders, et des outils l’exposent aux agents.",
          "measured": "Chaque shader généré est validé hors écran, rendu en dehors de la vue, avant d’être utilisé dans un jeu.",
          "result": "Les shaders deviennent un asset éditable de premier rang : générés, validés, puis réglés en direct par des personnes ou par des agents.",
          "metrics": [
            {
              "value": "hors écran",
              "label": "validation avant qu’un shader n’atteigne un jeu"
            },
            {
              "value": "en direct",
              "label": "réglage des paramètres, sans régénération"
            },
            {
              "value": "1",
              "label": "modèle de matériau pour PBR et shaders"
            }
          ]
        },
        {
          "id": "vehicles",
          "captions": ["Un kart sur un circuit, et personne contre qui courir", "Le véhicule est piloté par la physique, pas déplacé sur une trajectoire scriptée", "Des adversaires IA arrivent. Le même véhicule se conduit en solo et en ligne", "Un seul système pour les courses sur circuit, les batailles de kart et les courses à portails"],
          "kicker": "Véhicules",
          "title": "Un seul système de véhicules pour tous les jeux de véhicules",
          "summary": "J’ai conçu et réalisé le système de véhicules physiques du moteur : générique, pilotable en solo ou en ligne face à des adversaires IA, et éprouvé par de nombreux jeux de véhicules en production.",
          "problem": "Courses sur circuit, batailles de kart et courses à portails ont toutes besoin de véhicules qui se comportent physiquement, qui marchent en ligne comme en solo, et d’adversaires contre qui jouer. Tout reconstruire pour chaque jeu ne tiendrait pas.",
          "built": "Un système de véhicules générique, piloté par la physique plutôt que par des trajectoires scriptées, pour qu’un même véhicule serve des jeux différents. Il se conduit de la même façon en solo et en ligne, et des adversaires IA le pilotent aussi.",
          "measured": "Éprouvé en production par un large éventail de jeux de véhicules : courses sur circuit, batailles de kart et courses à portails.",
          "result": "Un seul système de véhicules derrière de nombreux jeux, en solo et en ligne, avec des adversaires IA.",
          "metrics": [
            {
              "value": "3 genres",
              "label": "courses sur circuit, batailles de kart, courses à portails"
            },
            {
              "value": "solo + en ligne",
              "label": "avec des adversaires IA"
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
          "title": "Un objet 3D prêt pour le jeu, généré à partir d’une phrase",
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
      "intro": "Deux ans de missions freelance pour des clients, en parallèle de mes études. Un projet en détail ici ; les autres figurent dans le parcours.",
      "cases": [
        {
          "id": "emotion",
          "captions": ["Un jeu au rythme fixe, qui ignore le joueur", "La caméra lit l’expression du joueur et le rythme du jeu la suit", "Un tableau de bord récapitule ce que le joueur a ressenti", "Un gameplay qui suit le joueur, et une trace de ce qu’il a ressenti"],
          "kicker": "Gameplay piloté par les émotions",
          "title": "Un jeu qui réagit à ce que ressent le joueur",
          "summary": "Pour un client freelance, j’ai construit un plugin Unity qui lit en temps réel l’émotion sur le visage du joueur et adapte le gameplay.",
          "problem": "La plupart des jeux se déroulent de la même façon quoi que ressente le joueur. Le client voulait un gameplay qui s’adapte à l’état émotionnel du joueur pendant qu’il joue.",
          "built": "Un plugin pour le moteur Unity qui reconnaît en temps réel l’émotion faciale du joueur par deep learning, et la relie à la logique de jeu.",
          "measured": "Un tableau de bord qui analyse le ressenti émotionnel des joueurs, pour lire l’effet sur eux au lieu de le deviner.",
          "result": "Un gameplay qui s’adapte au joueur en temps réel, et un tableau de bord qui montre ce que les joueurs ont ressenti.",
          "metrics": [
            {
              "value": "temps réel",
              "label": "reconnaissance des émotions faciales reliée au gameplay"
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
        details: 'Colyseus, Rapier, Node.js, NestJS, Socket.io, PostgreSQL, Prisma, Docker, Kubernetes (GKE), Cloud Run, CI/CD',
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
    phases: ['Problème', 'Solution', 'Validation', 'Résultat'],
    tag: 'Replay',
    aria: 'Replay 3D des études de cas',
    note: 'Les replays sont construits pour ce site afin d’illustrer chaque sujet. Les valeurs en direct décrivent cette page ; les chiffres du texte sont ceux mesurés.',
    scrub: 'Position du replay',
    load: 'Charger le replay 3D',
    loading: 'Chargement du replay 3D…',
    introTitle: 'Un petit monde, neuf sujets',
    introHint: 'Faites défiler pour lancer le replay · glissez pour tourner',
    t: {
      prompt: "prompt",
      promptText: "« une vieille lanterne en laiton »",
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
      live: 'en direct, cette page',
      latency: 'latence',
      correction: 'correction max',
      behind: 'vue naïve en retard de',
      corrections: 'réconciliations',
      naive: 'naïf',
      predicted: 'prédit',
      server: 'serveur',
      laps: 'tours',
      parts: 'parties du jeu',
      gate: 'porte',
      passed: 'validé',
      rejected: 'renvoyé',
      cost: 'coût',
      over: 'au-delà de la limite',
      under: 'sous le plafond',
      calls: 'appels au modèle',
      spec: 'spéc.',
      critique: 'critique',
      revision: 'révision',
      reads: 'rendu juste',
      revise: 'à retoucher',
      primitives: 'primitives',
      games: 'jeux qui tournent',
      shipped: 'livrés en production',
      shader: 'shader',
      generated: 'généré',
      blank: 'n’affiche rien',
      offscreen: 'contrôle hors écran',
      material: 'modèle de matériau',
      scale: 'échelle',
      speed: 'vitesse',
      glow: 'lueur',
      physics: 'physique',
      on: 'active',
      opponents: 'adversaires IA',
      mode: 'mode',
      solo: 'solo',
      online: 'en ligne',
    },
  },
};
