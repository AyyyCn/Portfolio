import type { Content } from './types';

// Source of truth: pfe-report/cv/Adam_Ladhari_CV_en.yaml. Every figure below
// comes from the CV; do not add numbers that are not there.
export const en: Content = {
  lang: 'en',
  path: '/',
  altPath: '/fr/',
  altLabel: 'Français',
  meta: {
    title: 'Adam Ladhari · Applied AI Engineer, agentic systems for interactive 3D',
    description:
      "Adam Ladhari, applied AI engineer in Paris. I build agentic systems for interactive 3D: AI agents that build games, and the engine they drive, with its visual effects, shaders, multiplayer and vehicles.",
  },
  nav: { about: 'About', experience: 'Experience', work: 'Work', projects: 'Projects', contact: 'Contact', skip: 'Skip to content' },
  hero: {
    "greeting": "Hi, I'm Adam",
    "role": "Applied AI Engineer",
    "location": "Paris, France",
    "lead": "I build AI systems for interactive 3D and games.",
    "intro": "I'm an applied AI engineer at Arcade AI, where AI agents turn a conversation into a multiplayer game. I work on those agents and on the engine they drive: visual effects, shaders, networking, vehicles and the gameplay core. Before that, I built a text-to-3D tool for a game studio, an adaptive learning platform, and games and tools for freelance clients.",
    "cta": "See my work",
    "cta2": "Get in touch",
    "viewer": "A small game world, generated in your browser. Drag to turn it"
  },
  about: {
    "heading": "About me",
    "paragraphs": [
      "I'm a software engineer specialised in applied AI. I graduated in software engineering from INSAT in Tunis in 2026, after internships and freelance work in games, 3D and AI, and I now work in Paris at Arcade AI.",
      "What I enjoy most is owning a subject from start to finish: understanding the problem, building the solution, and checking with real tests and measurements that it works before it ships.",
      "Games are where it started. I won one game jam and placed third in another, and I still build small games and AI experiments to understand how things work."
    ],
    "facts": [
      {
        "label": "Based in",
        "value": "Paris, France"
      },
      {
        "label": "Currently",
        "value": "Applied AI Engineer, Arcade AI"
      },
      {
        "label": "Education",
        "value": "Software engineering degree, INSAT Tunis, 2026"
      },
      {
        "label": "Focus",
        "value": "AI agents, game engines, online multiplayer, generated effects and 3D"
      }
    ]
  },
  experience: {
    "heading": "Experience",
    "jobs": [
      {
        "org": "Arcade AI",
        "orgNote": "AI-native game engine",
        "role": "Applied AI Engineer",
        "dates": "Feb 2026 – present",
        "place": "Paris",
        "points": [
          "Agent harness: core engineer on the agent system that turns a prompt into a playable 3D game, with specialist sub-agents for the world, logic, effects, interface and audio, made reliable by typed contracts, validation gates, cost ceilings and failure breakers.",
          "Text-to-VFX: built the system that compiles a written description into a visual effect, renders it, has an AI critique it and revises it until it reads right. It is backed by a preset library, an authoring workshop and a runtime API used by every game.",
          "Multiplayer: server-authoritative netcode with client prediction and lag compensation up to 250 ms, solo and online kept identical by tests, deployed on Kubernetes (GKE).",
          "Core engine: extended the engine with generic primitives (gravity fields, portals, voxel worlds, hit regions, abilities) that make new kinds of games possible. 100 complete games shipped to production on it.",
          "Shaders and materials: shaders generated from a prompt, validated offscreen and tuned live, in one material model the agents can use.",
          "Vehicles: designed and built the physics-driven vehicle system, playable solo and online against AI opponents, and used across circuit racing, kart battles and portal races."
        ]
      },
      {
        "org": "Lanterns Studio",
        "orgNote": "Game studio",
        "role": "AI Programmer Intern",
        "dates": "Jul – Aug 2025",
        "place": "Tunis",
        "points": [
          "Built a text-to-3D pipeline: from a sentence to a 3D model with realistic materials, in a file a game can load.",
          "Added automatic clean-up in Blender and quality checks, and deployed the tool online on Hugging Face Spaces."
        ]
      },
      {
        "org": "AXIO",
        "orgNote": "AI learning platform",
        "role": "Full-stack Developer, part-time",
        "dates": "Jan – Jun 2025",
        "place": "Tunis",
        "points": [
          "Built an adaptive learning platform: it tracks each learner's progress, curates their lesson path, detects frustration from time on task and brings in an LLM agent that answers from the course documentation (RAG).",
          "Modular architecture with fine-grained access control; automated unit and end-to-end tests (CI/CD) cut release time by 35%."
        ]
      },
      {
        "org": "Freelance",
        "orgNote": "Upwork and direct clients",
        "role": "Software Engineer",
        "dates": "Jun 2023 – May 2025",
        "place": "Remote",
        "points": [
          "Emotion-driven gameplay: a Unity plugin that reads the player's facial emotion in real time and adapts the gameplay, with a dashboard analysing players' emotional feedback.",
          "A hyper-casual mobile game, designed and shipped in Unity.",
          "Automated Gerber image processing in Python, cutting pre-production cycles by 75%.",
          "Automated trading tools (MQL4/5) for adaptive risk management, with 70% lower CPU load through multithreading and caching."
        ]
      },
      {
        "org": "INSAT",
        "orgNote": "Engineering school, Tunis",
        "role": "National Engineering Degree in Software Engineering",
        "dates": "2021 – 2026",
        "place": "Tunis",
        "points": []
      }
    ]
  },
  workSection: {
    "heading": "Selected work",
    "intro": "Nine systems I built, each with an interactive 3D demo.",
    "demo": "Open the 3D demo",
    "read": "Full case study",
    "close": "Close",
    "prev": "Previous step",
    "next": "Next step"
  },
  phases: ["Problem", "Solution", "Validation", "Outcome"],
  work: [
    {
      "org": "Arcade AI · AI-native game engine",
      "role": "Applied AI Engineer",
      "dates": "Feb 2026 – present · Paris",
      "intro": "Arcade AI is a game engine where games are made by conversation: you describe the game you want, and AI agents build a playable 3D multiplayer game. I work on both sides: the agents, and the engine they drive. Six subjects I own there:",
      "cases": [
        {
          "id": "harness",
          "captions": ["One prompt, one big answer: a broken piece slips into the game and the run keeps spending", "The harness: one tool-use loop, and specialist sub-agents called when their part is needed", "Every output meets a gate. One that breaks its contract is sent back, and a run that keeps failing is stopped", "The game is assembled only from parts that passed"],
          "kicker": "Agent harness",
          "title": "An agent system that builds a whole game from one prompt",
          "summary": "I'm a core engineer on the agent system that turns a written prompt into a playable 3D game, made reliable by its structure rather than by its prompt.",
          "problem": "A game is too big for one AI answer. It has a world, rules, effects, an interface and sound, and one mistake in any of them can break it. Asking the model to be careful does not make it reliable, and a run that goes wrong can keep spending without getting anywhere.",
          "built": "A harness, the structure the agents work inside: one tool-use loop (the model chooses a tool, uses it and reads the result), skills loaded only when they are needed, specialist sub-agents for the world, the game logic, the visual effects, the interface and the audio, and a memory kept for each level.",
          "measured": "The checks are part of the system. Every output follows a typed contract, a strict format the code can verify. Validation gates reject an output that breaks its contract before it reaches the game. Cost ceilings cap what a run can spend, and failure breakers stop a run that keeps failing.",
          "result": "Reliability that comes from the system, not from the prompt: a prompt goes in, and a playable 3D game comes out.",
          "metrics": [
            {
              "value": "5",
              "label": "specialist sub-agents: world, logic, VFX, UI, audio"
            },
            {
              "value": "4 safeguards",
              "label": "typed contracts, validation gates, cost ceilings, failure breakers"
            }
          ]
        },
        {
          "id": "vfx",
          "captions": ["A description comes in: “a crackling blue portal”. Spawning particles straight from it gives a vague burst", "The description is compiled into a specification of the phenomenon, then rendered", "An AI looks at the render and critiques it. The specification is revised and rendered again", "The effect that reads right, with the preset library and the runtime API that games call"],
          "kicker": "Text to VFX",
          "title": "Visual effects generated from a description",
          "summary": "I built the system that turns a written description of an effect into a real-time visual effect, checked by an AI that looks at the result and asks for changes.",
          "problem": "Games need effects: fire, sparks, smoke, magic. When the request is free text, asking an AI to place particles directly gives effects that look wrong, and nothing tells the system that they do.",
          "built": "A compiler from the description to a bounded phenomenon specification. It describes what is being simulated (a flame, a shockwave, a swirl of dust), not which particles to spawn, and stays within limits the engine can run. The engine then renders that specification as an effect.",
          "measured": "The effect is rendered, and a multimodal model, an AI that can read images, critiques the picture. The specification is revised and rendered again, in a loop, until the effect reads right.",
          "result": "The text-to-VFX system, backed by a preset library, an authoring workshop to build and adjust effects, and a runtime API that every game uses.",
          "metrics": [
            {
              "value": "every game",
              "label": "uses the effects runtime API"
            },
            {
              "value": "critique loop",
              "label": "render, critique, revise until the effect reads right"
            }
          ]
        },
        {
          "id": "netcode",
          "captions": ["Three views of the same game. With network delay, player A sees their own character late: the faded figure", "Prediction: A’s character moves at once, then corrects itself when the server disagrees", "A shoots. The server rewinds the target to where A saw it, then judges the hit. Try the latency slider", "At 250 ms of delay, shots still land"],
          "kicker": "Online multiplayer",
          "title": "Making an online game feel instant and fair",
          "summary": "I built the networking that keeps online games responsive and fair on slow connections, and the infrastructure that runs every game server.",
          "problem": "Online, every message takes time to travel, so each player sees a slightly old version of the game. Without care, your character reacts late and shots that looked on target miss. And only the server should decide what really happened.",
          "built": "A server-authoritative simulation built with Node.js, Colyseus and Rapier: the server has the final say, and only what changed is sent over the network (delta replication). The player's device shows the result of an action at once and corrects itself if the server disagrees (client prediction and reconciliation). For shots, the server looks back in time to where the target was when the player fired (lag compensation). It runs on Kubernetes (GKE): one addressable pod per game server, autoscaling, matchmaking and CI/CD.",
          "measured": "Tests enforce that a game behaves the same solo and online, through the same API, so a game built for one works in the other.",
          "result": "Online games that stay fair with up to 250 ms of network delay, on servers that scale with the number of games being played.",
          "metrics": [
            {
              "value": "250 ms",
              "label": "of delay covered by lag compensation"
            },
            {
              "value": "solo = online",
              "label": "same API, enforced by tests"
            },
            {
              "value": "1 pod",
              "label": "per game server, autoscaled on GKE"
            }
          ]
        },
        {
          "id": "engine",
          "captions": ["Three new kinds of game, each needing something the engine cannot do yet", "Each need becomes a generic primitive: gravity fields, portals, voxel worlds, hit regions, abilities", "The games come alive on the shared primitives", "100 complete games shipped to production"],
          "kicker": "Core engine",
          "title": "Engine primitives that make new kinds of games possible",
          "summary": "I extended the engine core so that new kinds of games become possible, solving each need with a generic building block. 100 complete games have shipped to production on it.",
          "problem": "Every new kind of game asks something new of the engine: walking around a small planet, stepping through a portal, building with blocks. Writing special code for each game does not scale, least of all when AI agents are the ones assembling the games.",
          "built": "Each need solved as a generic primitive rather than game-specific code: gravity fields, portals, voxel worlds, hit regions and abilities. Any game, and any agent, can combine them.",
          "measured": "Proven by shipping: complete games built on these primitives and released to production.",
          "result": "100 complete games shipped to production on the engine.",
          "metrics": [
            {
              "value": "100",
              "label": "complete games shipped to production"
            }
          ]
        },
        {
          "id": "shaders",
          "captions": ["A prompt asks for a surface. A shader generated blindly can fail: this one renders nothing", "The prompt becomes a procedural shader, with its parameters exposed", "Each shader is rendered offscreen and checked before use. Try the sliders: they tune it live", "One material model: the same object as a standard PBR material or as a shader"],
          "kicker": "Shaders and materials",
          "title": "Shaders an agent can write and anyone can tune",
          "summary": "I made shaders a first-class asset that can be authored: generated from a prompt, validated before use, and tuned live without generating them again.",
          "problem": "A shader is a small program that runs on the graphics card and decides how a surface looks. Writing one by hand takes expertise, a generated one can fail to compile or render nothing, and changing its look usually means generating it again.",
          "built": "A path from a prompt to a procedural shader, with parameters exposed so they can be tuned live without regenerating. A single material model covers both standard physically based (PBR) materials and shaders, and tools expose it to the agents.",
          "measured": "Every generated shader is validated offscreen, rendered out of view, before it is used in a game.",
          "result": "Shaders as a first-class authorable asset: generated, validated, then tuned live by people or by agents.",
          "metrics": [
            {
              "value": "offscreen",
              "label": "validation before a shader reaches a game"
            },
            {
              "value": "live",
              "label": "parameter tuning, with no regeneration"
            },
            {
              "value": "1",
              "label": "material model for PBR and shaders"
            }
          ]
        },
        {
          "id": "vehicles",
          "captions": ["One kart on a circuit, and nobody to race", "The vehicle is driven by physics, not moved along a scripted path", "AI opponents join. The same vehicle drives solo and online", "One system across circuit racing, kart battles and portal races"],
          "kicker": "Vehicles",
          "title": "One vehicle system for every kind of vehicle game",
          "summary": "I designed and built the engine's physics-driven vehicle system: generic, drivable solo or online against AI opponents, and proven across many vehicle games in production.",
          "problem": "Circuit racing, kart battles and portal races all need vehicles that behave physically, that work online as well as solo, and opponents to play against. Building that again for every game would not scale.",
          "built": "A generic vehicle system driven by physics rather than scripted paths, so one vehicle can serve different games. It drives the same solo and online, and AI opponents drive it too.",
          "measured": "Proven in production across a wide range of vehicle games: circuit racing, kart battles and portal races.",
          "result": "One vehicle system behind many vehicle games, solo and online, with AI opponents.",
          "metrics": [
            {
              "value": "3 genres",
              "label": "circuit racing, kart battles, portal races"
            },
            {
              "value": "solo + online",
              "label": "with AI opponents"
            }
          ]
        }
      ]
    },
    {
      "org": "Lanterns Studio · Game development",
      "role": "AI Programmer Intern",
      "dates": "Jul 2025 – Aug 2025 · Tunis",
      "intro": "A two-month internship in a game studio, on one subject: turning a written description into a 3D object a game can use.",
      "cases": [
        {
          "id": "textto3d",
          "captions": ["A sentence goes in. Candidate images are generated and the best one is kept", "A raw 3D mesh: the right shape, far too many triangles", "Automatic clean-up cuts it to a fraction of the triangles and runs quality checks", "Materials applied: an object a game can load"],
          "kicker": "Text to 3D",
          "title": "A game-ready 3D object, generated from a sentence",
          "summary": "I built a tool that turns a written description into a 3D object with its materials, in a file a game can load.",
          "problem": "AI can produce a 3D shape from a sentence, but a raw shape is not yet a game asset. It needs materials, a reasonable number of triangles and a file format the engine can load, and the person using the tool needs some control over the result.",
          "built": "A generation pipeline based on EmbodiedGen, a text-to-3D generation system: from the text it produces a 3D mesh with realistic materials (PBR) and exports a GLB file, a standard 3D format. Around it, an app built with Gradio: automatic and manual modes, seeds to reproduce a result, background removal and ranking of the candidate images.",
          "measured": "Quality checks built into every generation, then automatic clean-up in Blender running without a screen: rebuilding a cleaner mesh (retopology), reducing the triangle count (decimation) and exporting to OBJ or GLB.",
          "result": "A working pipeline from a sentence to a GLB file, deployed online on Hugging Face Spaces with a Docker image that includes GPU support and Blender.",
          "metrics": [
            {
              "value": "text → GLB",
              "label": "mesh and realistic materials in one pipeline"
            },
            {
              "value": "Hugging Face Spaces",
              "label": "deployed online, Docker GPU + Blender image"
            }
          ]
        }
      ]
    },
    {
      "org": "AXIO · AI-driven interactive learning platform",
      "role": "Full-stack Developer, part-time",
      "dates": "Jan 2025 – Jun 2025 · Tunis",
      "intro": "AXIO is an online learning platform that adapts to each learner. I worked on it part-time during my engineering degree, on both the server side and the interface.",
      "cases": [
        {
          "id": "learning",
          "captions": ["A learner moves through the lessons along the planned path", "On one lesson they stall. The ring fills as time on the task grows", "Frustration detected: an AI agent fetches the relevant course documents", "Unblocked, and sent to a different next lesson than planned"],
          "kicker": "Adaptive learning with an AI assistant",
          "title": "Noticing when a learner is stuck, and helping at that moment",
          "summary": "I built a learning platform that adapts the course to each learner and brings in an AI assistant when it detects they are stuck.",
          "problem": "Every learner moves at a different pace, and a learner who is stuck needs help at that moment, not at the end of the course.",
          "built": "An adaptive learning platform: it tracks each learner's progress and curates the path, choosing the next lessons to fit. It is built as independent modules, with fine-grained control over who can access what.",
          "measured": "The platform detects frustration from how long a learner spends on a task. When it does, an AI agent steps in and answers from the course documentation itself, a technique called RAG (retrieval-augmented generation). Every release goes through automated unit and end-to-end tests (CI/CD).",
          "result": "A platform that reacts to each learner, and a release time cut by 35%.",
          "metrics": [
            {
              "value": "−35%",
              "label": "release time, thanks to automated tests and delivery"
            },
            {
              "value": "AI agent + RAG",
              "label": "answers from the course documentation"
            }
          ]
        }
      ]
    },
    {
      "org": "Freelance · Upwork and direct clients",
      "role": "Software Engineer",
      "dates": "Jun 2023 – May 2025 · Remote",
      "intro": "Two years of freelance work for clients, alongside my studies. One project in detail here; the others are listed under Experience.",
      "cases": [
        {
          "id": "emotion",
          "captions": ["A game running at a fixed pace, unaware of the player", "The camera reads the player’s expression and the game’s pace follows it", "A dashboard tallies how the player felt", "Gameplay that follows the player, and a record of how they felt"],
          "kicker": "Emotion-driven gameplay",
          "title": "A game that reacts to how the player feels",
          "summary": "For a freelance client, I built a Unity plugin that reads the player's facial emotion in real time and adapts the gameplay to it.",
          "problem": "Most games run the same way whatever the player feels. The client wanted gameplay that adapts to the player's emotional state while they play.",
          "built": "A plugin for the Unity game engine that recognises the player's facial emotion in real time with deep learning, and connects it to the game logic.",
          "measured": "A dashboard that analyses players' emotional feedback, so the effect on players can be read instead of guessed.",
          "result": "Gameplay that adapts to the player in real time, and a dashboard that shows how players felt.",
          "metrics": [
            {
              "value": "real time",
              "label": "facial emotion recognition driving the gameplay"
            }
          ]
        }
      ]
    }
  ],
  projects: {
    "heading": "More projects",
    "intro": "Personal, jam and university projects: where the taste for games, AI and tools comes from.",
    "code": "Code",
    "groups": [
      {
        "label": "Games",
        "items": [
          {
            "title": "Faysa",
            "image": "faysa",
            "note": "Game jam, 1st place",
            "text": "A time-travel puzzle game where you cooperate with past versions of yourself to solve platforming challenges."
          },
          {
            "title": "Nos · DreamScape: The Lucid Mission",
            "image": "nos",
            "note": "Game jam, 3rd place",
            "text": "A dream-based adventure: a lucid dreamer, guided by a genie, has to save the dream world. Each dream mission brings a new gameplay style."
          },
          {
            "title": "EchoMIDI",
            "image": "echomidi",
            "link": "https://github.com/AyyyCn/EchoMIDI",
            "text": "A rhythm memory game in Unity URP with MIDI support: replay an ever-growing sequence of notes on a MIDI keyboard or a virtual piano. Guided mode, velocity sensitivity, dynamic difficulty."
          },
          {
            "title": "Fruit Slicer VR",
            "image": "fruit",
            "link": "https://github.com/AyyyCn/FruitSlicerVR",
            "text": "A VR fruit-slicing game in Unity with real-time physics and blade collision."
          },
          {
            "title": "Pencil Sharpener",
            "image": "pencil",
            "text": "A hyper-casual game with one job: sharpen pencils fast. Built for quick mobile-style play."
          },
          {
            "title": "The Boiz",
            "image": "theboiz",
            "text": "A collaborative escape-room game made with and for friends."
          }
        ]
      },
      {
        "label": "AI",
        "items": [
          {
            "title": "Parki",
            "image": "parki",
            "link": "https://github.com/AyyyCn/Parki",
            "text": "A smart parking system with licence plate recognition and mobile tracking. Python, Flutter, YOLO."
          },
          {
            "title": "GameDB",
            "image": "gamedb",
            "link": "https://github.com/AyyyCn/Game-DB",
            "text": "A tool that scrapes Reddit and YouTube comments to analyse what players love or hate about a game. Python, BERT, web scraping."
          },
          {
            "title": "Formation Recommender",
            "image": "junior",
            "link": "https://github.com/AyyyCn/JuniorRush_ML",
            "text": "A multi-label recommender that suggests up to three training programmes per user, with confidence thresholds and model calibration. Python, XGBoost, scikit-learn."
          }
        ]
      },
      {
        "label": "Tools",
        "items": [
          {
            "title": "Img2Gerber",
            "image": "gerber",
            "text": "An automation pipeline that converts layered image designs (PNG/SVG) into production-ready KiCad Gerber files, in batch. Python, KiCad API, Inkscape CLI, OpenCV."
          },
          {
            "title": "Gurobi Wrapper",
            "image": "gurobi",
            "text": "A desktop tool to solve LP/ILP optimisation problems with Gurobi, with a GUI for inputs, outputs and settings."
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
            "text": "An online marketplace built in Angular as a university group project."
          },
          {
            "title": "Tuniscape",
            "image": "tuniscape",
            "link": "https://github.com/ElyesBelgouthi/Tuniscape",
            "text": "A travel agency website built with Symfony: booking modules, forms, server-side rendering."
          },
          {
            "title": "InnovaBank",
            "image": "innovabank",
            "text": "My first university web project: a simulated bank interface in plain HTML, CSS and JavaScript."
          }
        ]
      }
    ]
  },
  toolbox: {
    heading: 'Skills',
    groups: [
      {
        label: 'Agentic AI',
        details:
          'Agent harness design, tool use, MCP, multi-agent orchestration, RAG, agent memory, context engineering, structured outputs, guardrails, benchmarking, evaluation and tracing',
      },
      {
        label: 'Generative AI',
        details:
          'GPT, Gemini, Claude, multimodal critique loops, text/image-to-3D, generative audio and VFX, LLM customisation, TensorFlow, deep learning',
      },
      {
        label: 'Engines and 3D',
        details: 'PlayCanvas, WebGPU, Unity, Unreal Engine (Blueprints, C++), Three.js, OpenGL, HLSL, Blender',
      },
      {
        label: 'Networking and backend',
        details: 'Colyseus, Rapier, Node.js, NestJS, Socket.io, PostgreSQL, Prisma, Docker, Kubernetes (GKE), Cloud Run, CI/CD',
      },
      { label: 'Languages', details: 'TypeScript, JavaScript, Python, C#, C++, Java' },
    ],
  },
  education: {
    heading: 'Awards and certificates',
    items: [
      { label: 'NVIDIA', details: 'Efficient Large Language Model (LLM) Customization certificate (Oct 2024)' },
      { label: 'Game jams', details: 'Android Club Game Jam, 1st place; Playground Game Jam, 3rd place (2024)' },
      { label: 'CTF', details: 'SparkCTF, 1st place; Cybersphere CTF, 2nd place (2024)' },
    ],
  },
  contact: {
    heading: 'Contact',
    text: 'Based in Paris. The fastest way to reach me is email.',
    email: 'adamldr3@gmail.com',
    linkedin: 'https://www.linkedin.com/in/adam-ladhari',
    github: 'https://github.com/AyyyCn',
    artstation: 'https://www.artstation.com/ayyycn',
    youtube: 'https://www.youtube.com/@acn8713',
  },
  footer: 'Built with Three.js and TypeScript. The island, the karts and the simulations are generated in your browser; nothing here comes from Arcade AI.',
  stage: {
    introCaption: "A small game world, generated in your browser. Each case study below is replayed here",
    prev: "Previous case",
    next: "Next case",
    phases: ['Problem', 'Solution', 'Validation', 'Outcome'],
    tag: 'Replay',
    aria: '3D replay of the case studies',
    note: 'Replays are built for this site to illustrate each subject. Live readouts describe this page; the figures in the text are the measured ones.',
    scrub: 'Replay position',
    load: 'Load the 3D replay',
    loading: 'Loading the 3D replay…',
    introTitle: 'One small world, nine subjects',
    introHint: 'Scroll to start the replay · drag to orbit',
    t: {
      prompt: "prompt",
      promptText: "\"an old brass lantern\"",
      triangles: "triangles",
      qa: "QA checks",
      raw: "raw mesh",
      decimated: "decimated",
      textured: "materials",
      learners: "learners",
      lessons: "lessons done",
      timeOnTask: "time on task",
      frustration: "frustration",
      detected: "detected",
      agent: "agent",
      unblocked: "unblocked",
      watching: "watching",
      emotionLabel: "emotion",
      pace: "game pace",
      calm: "calm",
      frustrated: "frustrated",
      joy: "joy",
      off: "off",
      live: 'live, this page',
      latency: 'latency',
      correction: 'max correction',
      behind: 'naive view behind by',
      corrections: 'reconciliations',
      naive: 'naive',
      predicted: 'predicted',
      server: 'server',
      laps: 'laps',
      parts: 'game parts',
      gate: 'gate',
      passed: 'passed',
      rejected: 'sent back',
      cost: 'cost',
      over: 'over the limit',
      under: 'under the ceiling',
      calls: 'model calls',
      spec: 'spec',
      critique: 'critique',
      revision: 'revision',
      reads: 'reads right',
      revise: 'revise',
      primitives: 'primitives',
      games: 'games running',
      shipped: 'shipped to production',
      shader: 'shader',
      generated: 'generated',
      blank: 'renders nothing',
      offscreen: 'offscreen check',
      material: 'material model',
      scale: 'scale',
      speed: 'speed',
      glow: 'glow',
      physics: 'physics',
      on: 'on',
      opponents: 'AI opponents',
      mode: 'mode',
      solo: 'solo',
      online: 'online',
    },
  },
};
