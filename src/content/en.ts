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
      'Applied AI engineer in Paris. Agentic systems for interactive 3D and games: agent harness, benchmarks, observability, multiplayer netcode, generative 3D, VFX and audio. Case studies with measured results.',
  },
  nav: { work: 'Case studies', projects: 'Projects', toolbox: 'Toolbox', contact: 'Contact', skip: 'Skip to content' },
  hero: {
    role: 'Applied AI Engineer',
    location: 'Paris, France',
    lead: 'Agentic systems for interactive 3D.',
    profile:
      'I take a subject end to end: frame the problem, build it, instrument it, measure it, ship it. At Arcade AI that covers the agents that turn a conversation into a multiplayer game and the engine they drive: 3D, gameplay, VFX, audio, UI and networking.',
    cta: 'Start the replay',
  },
  headline: [
    { value: '8% → 92%', label: 'requested features built, checklist strategy vs schema-valid output' },
    { value: '7', label: 'agent architectures benchmarked against production' },
    { value: '≈100', label: 'active NPCs at 60 FPS, measured budget' },
    { value: '250 ms', label: 'lag compensation rewind, verified under injected latency' },
    { value: '10+', label: 'complete games and maps shipped to production' },
  ],
  workHeading: "Case studies",
  phases: ['Problem', 'Build', 'Measure', 'Result'],
  work: [
    {
      org: "Arcade AI · AI-native game engine",
      role: "Applied AI Engineer",
      dates: "Feb 2026 – present · Paris",
      intro: 'Core engineer on the agent system that turns a prompt into a playable 3D game: one tool-use loop, on-demand skills, specialist sub-agents (world, logic, VFX, UI, audio) and per-level memory. Reliability comes from the system, not the prompt: typed contracts, validation gates, cost ceilings and failure breakers. Five subjects I owned there, each replayed in the viewport.',
      cases: [

    {
      id: 'benchmark',
      kicker: 'Generation benchmark, owned end to end',
      title: 'A valid game is not the game that was asked for',
      problem:
        'An agent can return output that passes every schema check and still be a hollow game. Which agent architecture actually builds what the player asked for, and at what cost?',
      built:
        'I framed and ran a study of 7 agent architectures against the production baseline, and built what it needed: the test rig, a feature-coverage score, and the results deck.',
      measured:
        'The production baseline: 4.6 minutes median for a first build, 21 model calls. Each architecture was scored on the share of requested features present in the finished game.',
      result:
        'Schema-valid output can still be a hollow game, with 8% of the requested features. A checklist strategy reaches 92%.',
      metrics: [
        { value: '7', label: 'architectures compared' },
        { value: '4.6 min', label: 'baseline median first build' },
        { value: '21', label: 'baseline model calls' },
      ],
      bar: { before: 8, after: 92, beforeLabel: 'schema-valid output', afterLabel: 'checklist strategy' },
    },
    {
      id: 'profiler',
      kicker: 'Observability',
      title: 'Replacing impressions with numbers',
      problem:
        'Without instruments, "the agent went wrong somewhere" and "it feels slow" are impressions. Decisions about agents and about engine performance need numbers.',
      built:
        'An agent trace debugger, and an in-engine profiler panel that shows frame cost per system.',
      measured:
        'A horde benchmark: raise the number of active NPCs and read the frame cost of each system off the profiler.',
      result: 'A measured budget of about 100 active NPCs at 60 FPS.',
      metrics: [
        { value: '≈100', label: 'active NPCs at 60 FPS' },
        { value: 'per system', label: 'frame cost in the profiler panel' },
      ],
    },
    {
      id: 'netcode',
      kicker: 'Multiplayer netcode, proven under latency',
      title: 'Fair movement and shooting on a real network',
      problem:
        'On a real network every player sees the past. Movement has to feel immediate and hits have to be judged fairly, while the server stays the only authority.',
      built:
        'Server-authoritative movement and shooting on Node.js, Colyseus and Rapier, with client prediction, reconciliation and lag compensation.',
      measured:
        'Automated two-client play sessions with injected latency, so the behaviour is verified by a run and not by feel.',
      result: 'Lag compensation rewinds up to 250 ms, verified by those sessions.',
      metrics: [
        { value: '250 ms', label: 'lag compensation rewind' },
        { value: '2 clients', label: 'automated sessions, injected latency' },
      ],
    },
    {
      id: 'pipelines',
      kicker: 'Autonomy across domains',
      title: '3D, VFX and audio pipelines from zero',
      problem:
        'A generated game needs models, effects and sound, and each generated asset has to fit the engine without a person fixing it by hand.',
      built:
        'I took the 3D, VFX and audio pipelines from zero without hand-off: image-to-3D weapon models, generated sound cues, and generative VFX.',
      measured:
        'Every pipeline checks its own output: automatic candidate scoring and clean-up for sound, automatic alignment to a grip contract for models, and a multimodal render → critique → revise loop for VFX.',
      result: '97 generated sound cues and 42 image-to-3D weapon models, auto-aligned to the grip contract.',
      metrics: [
        { value: '97', label: 'generated sound cues, scored and cleaned automatically' },
        { value: '42', label: 'image-to-3D weapon models, auto-aligned' },
      ],
    },
    {
      id: 'shipping',
      kicker: 'Shipping',
      title: 'Complete games as engine coverage probes',
      problem: 'An engine only shows its gaps when someone ships a complete game on it.',
      built:
        '10+ complete games and maps delivered to production: an online tactical shooter with bots and 34 data-driven weapons, kart racers, voxel worlds. Plus an MCP server so external coding agents (Claude Code, Codex) build and inspect games live.',
      measured: 'Each game is a coverage probe: every gap it exposed was closed with a generic engine primitive, not a one-off fix.',
      result: '10+ complete games and maps in production, and an engine that gained a generic primitive for every gap they exposed.',
      metrics: [
        { value: '10+', label: 'complete games and maps in production' },
        { value: '34', label: 'data-driven weapons in the tactical shooter' },
      ],
    },
      ],
    },
    {
      "org": "Lanterns Studio · Game development",
      "role": "AI Programmer Intern",
      "dates": "Jul 2025 – Aug 2025 · Tunis",
      "intro": "A two-month internship with one subject: turn a text prompt into a 3D asset a game can load.",
      "cases": [
        {
          "id": "textto3d",
          "kicker": "Text-to-3D pipeline",
          "title": "From a prompt to a game-ready 3D asset",
          "problem": "A generated mesh is not yet a game asset. It needs materials, a reasonable triangle count and a format the engine can load, and someone has to be able to steer the generation.",
          "built": "A text-to-3D generation pipeline (prompt → mesh + PBR materials → GLB) on EmbodiedGen, with a Gradio app: auto and manual modes, seeds, background removal and image ranking.",
          "measured": "Built-in QA checks on every generation, and headless Blender post-processing: retopology, decimation, OBJ/GLB export.",
          "result": "A working pipeline from prompt to GLB, deployed on Hugging Face Spaces with a Docker GPU + Blender image.",
          "metrics": [
            {
              "value": "prompt → GLB",
              "label": "mesh and PBR materials in one pipeline"
            },
            {
              "value": "Hugging Face Spaces",
              "label": "deployed with a Docker GPU + Blender image"
            }
          ]
        }
      ]
    },
    {
      "org": "AXIO · AI-driven interactive learning platform",
      "role": "Full-stack Developer, part-time",
      "dates": "Jan 2025 – Jun 2025 · Tunis",
      "intro": "An adaptive learning platform, built part-time alongside my engineering degree.",
      "cases": [
        {
          "id": "learning",
          "kicker": "Adaptive learning with an LLM agent",
          "title": "Noticing the stuck learner, and unblocking them",
          "problem": "Every learner moves at a different pace, and a learner who is stuck needs help at that moment, not at the end of the course.",
          "built": "An adaptive learning platform: it tracks each learner's progress and curates the path, choosing the next lessons to fit. Modular architecture with fine-grained access control.",
          "measured": "Frustration is detected from time-on-task signals; when it is, an LLM agent with RAG over the course documentation steps in to unblock the learner. Releases go through CI/CD with unit and end-to-end tests.",
          "result": "A platform that reacts to each learner, and a release time cut by 35%.",
          "metrics": [
            {
              "value": "−35%",
              "label": "release time, with CI/CD and automated tests"
            },
            {
              "value": "RAG agent",
              "label": "over the course documentation"
            }
          ]
        }
      ]
    },
    {
      "org": "Freelance · Upwork and direct clients",
      "role": "Software Engineer",
      "dates": "Jun 2023 – May 2025 · Remote",
      "intro": "Two years of client work in parallel with my studies: games, automation and trading tools.",
      "cases": [
        {
          "id": "emotion",
          "kicker": "Client work",
          "title": "Three client problems, three shipped systems",
          "problem": "Each client came with a different subject: a game that should react to how the player feels, a pre-production process done by hand, and trading tools that used too much CPU.",
          "built": "Emotion-driven adaptive gameplay (Unity plugin, deep learning) with real-time facial emotion recognition driving gameplay logic; a hyper-casual mobile game designed and shipped in Unity and C#; Gerber image processing automated in Python; expert advisors in MQL4/5 for adaptive risk management.",
          "measured": "A dashboard analysing players' emotional feedback for the gameplay plugin, and real-time dashboards for the trading tools.",
          "result": "Pre-production cycles cut by 75% with the Gerber automation, and 70% lower CPU load on the trading tools through multithreading and caching.",
          "metrics": [
            {
              "value": "−75%",
              "label": "pre-production cycles (Gerber automation)"
            },
            {
              "value": "−70%",
              "label": "CPU load (trading automation)"
            }
          ]
        }
      ]
    },
  ],
  projects: {
    "heading": "Projects",
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
    heading: 'Toolbox',
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
        details: 'Colyseus, Rapier, Node.js, NestJS, Socket.io, PostgreSQL, Prisma, Docker, Cloud Run, CI/CD',
      },
      { label: 'Languages', details: 'TypeScript, JavaScript, Python, C#, C++, Java' },
    ],
  },
  education: {
    heading: 'Education and awards',
    items: [
      { label: 'Education', details: 'National Engineering Degree in Software Engineering, INSAT Tunis (2021 – 2026)' },
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
    tag: 'Replay',
    aria: '3D replay of the case studies',
    note: 'Replays are built for this site to illustrate each subject. Live readouts describe this page; the figures in the text are the measured ones.',
    scrub: 'Replay position',
    load: 'Load the 3D replay',
    loading: 'Loading the 3D replay…',
    introTitle: 'One small world, eight subjects',
    introHint: 'Scroll to start the replay · drag to orbit',
    t: {
      prompt: "prompt",
      promptText: "\"a mossy boulder\"",
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
      requested: 'requested',
      present: 'present',
      coverage: 'coverage',
      schema: 'schema',
      valid: 'valid',
      checklist: 'checklist',
      npcs: 'NPCs',
      sim: 'sim',
      frame: 'frame',
      fps: 'fps',
      live: 'live, this page',
      latency: 'latency',
      correction: 'max correction',
      behind: 'naive view behind by',
      corrections: 'reconciliations',
      naive: 'naive',
      predicted: 'predicted',
      server: 'server',
      aligned: 'aligned to grip contract',
      revision: 'vfx revision',
      bots: 'bots',
      checkpoints: 'checkpoints passed',
      laps: 'laps',
      wire: 'wireframe',
    },
  },
};
