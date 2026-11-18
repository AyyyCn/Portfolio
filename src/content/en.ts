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
      "Adam Ladhari, applied AI engineer in Paris. I design AI agents for interactive 3D and games, and take each subject from problem to measured result. Case studies: agent benchmarks, observability, online multiplayer, generated 3D, effects and sound.",
  },
  nav: { work: 'Case studies', projects: 'Projects', toolbox: 'Toolbox', contact: 'Contact', skip: 'Skip to content' },
  hero: {
    "role": "Applied AI Engineer",
    "location": "Paris, France",
    "lead": "I design AI agents for interactive 3D and games, and I measure that they work",
    "profile": "I am an applied AI engineer. I take a subject from start to finish: frame the problem, build the solution, instrument it, measure it and ship it. My ground is where AI agents meet real-time 3D: agent systems, game engines, online multiplayer, generated 3D, effects and sound. Today I do this at Arcade AI, on the agents that turn a written idea into a playable multiplayer game and on the engine they control.",
    "cta": "Start the tour",
    "cta2": "Read the summary",
    "cue": "Scroll to start · ← → to step",
    "summary": "In short",
    "what": [
      {
        "title": "AI agents",
        "text": "Programs built on large language models (GPT, Gemini, Claude) that plan, use tools and check their own work, instead of answering once."
      },
      {
        "title": "Game engine and 3D",
        "text": "The software that runs a game: 3D worlds, physics, characters, visual effects, sound and online multiplayer."
      },
      {
        "title": "Measured results",
        "text": "Benchmarks, profilers and automated tests, so that decisions rest on numbers and not on impressions."
      }
    ]
  },
  headline: [
    {
      "value": "8% → 92%",
      "label": "of the features a player asked for end up in the generated game: an output that only passes format checks, versus the checklist strategy"
    },
    {
      "value": "7",
      "label": "ways of organising the AI agents, compared on the same test bench"
    },
    {
      "value": "≈100",
      "label": "computer-controlled characters at a smooth 60 images per second, a measured limit"
    },
    {
      "value": "250 ms",
      "label": "of network delay absorbed while online shots still land fairly"
    },
    {
      "value": "10+",
      "label": "complete games and maps shipped to production"
    }
  ],
  workHeading: "Case studies",
  workIntro: "Each case follows the same four steps: the problem, what I built, how I measured it, and the result. The 3D panel replays it as you scroll.",
  phases: [
    "Problem",
    "What I built",
    "How I measured",
    "Result"
  ],
  work: [
    {
      "org": "Arcade AI · AI-native game engine",
      "role": "Applied AI Engineer",
      "dates": "Feb 2026 – present · Paris",
      "intro": "Arcade AI is a game engine where games are made by conversation: you describe the game you want, and AI agents build a playable 3D multiplayer game. I am a core engineer on that agent system and on the engine underneath. The system is one agent working in a loop (think, use a tool, check the result), helped by specialist agents for the world, the game rules, the visual effects, the interface and the sound, with a memory for each level. Its reliability comes from checks built into the system, not from hoping the AI behaves: strict output formats, validation steps, cost limits and automatic stops when it keeps failing. Five subjects I owned there:",
      "cases": [
        {
          "id": "benchmark",
          "captions": ["An AI agent builds a game in a loop. Every pass through the gate says “valid”, yet only 1 of the 12 requested features exists", "The same loop with a checklist: specialist agents add the requested features one by one", "A scan counts what is really in the game, the same way for every architecture", "11 of 12 features delivered: 92%, against 8% before"],
          "kicker": "Benchmark of AI agent designs",
          "title": "Does the AI build the game that was asked for?",
          "summary": "I ran the study showing that a generated game can pass every automatic check and still contain only 8% of what was asked for, and that a checklist approach reaches 92%.",
          "problem": "When an AI generates a game, automatic checks verify that the output has the right format. But a game can have the right format and be nearly empty. We needed to know which way of organising the agents really delivers what the player described, and at what cost in time and in calls to the AI model.",
          "built": "I framed and ran a study comparing 7 agent architectures, meaning 7 different ways of organising the agents, against the version running in production. I built what the study needed: the test bench that runs them all, a score that counts how many of the requested features are really present in the finished game, and the report presenting the results.",
          "measured": "The production version needed a median of 4.6 minutes and 21 calls to the AI model to produce a first game. Every architecture was scored the same way: the share of requested features present in the finished game.",
          "result": "An output that passes the format checks can still be a hollow game, with only 8% of the requested features. A checklist strategy reaches 92%.",
          "metrics": [
            {
              "value": "7",
              "label": "agent architectures compared"
            },
            {
              "value": "4.6 min",
              "label": "median time for a first game, production version"
            },
            {
              "value": "21",
              "label": "calls to the AI model, production version"
            }
          ],
          "bar": {
            "before": 8,
            "after": 92,
            "beforeLabel": "passes format checks",
            "afterLabel": "checklist strategy"
          }
        },
        {
          "id": "profiler",
          "captions": ["A crowd of characters chases a target. Is it too many? Without instruments, nobody can say", "Two instruments appear: a step-by-step recording of an agent run, and the cost of each system", "More characters are added while the bars show what each system costs. These timings are measured live on this page", "The answer becomes a number: about 100 characters at 60 images per second in the Arcade engine"],
          "kicker": "Observability",
          "title": "Seeing what the AI and the engine are really doing",
          "summary": "I built the tools that show, step by step, what an AI agent did, and how much computing time each part of the game costs.",
          "problem": "When an AI agent gives a bad result, or a game runs slowly, the first explanation is usually a guess. Without instruments, nobody can say where it went wrong or which part is slow.",
          "built": "Two tools. A trace debugger, which records every step an agent takes and lets you inspect them afterwards. And a profiler panel inside the engine, which shows how much time each system of the game uses in every image it draws.",
          "measured": "A stress test, the horde benchmark: add more and more computer-controlled characters (NPCs) and read on the profiler what each system costs.",
          "result": "A measured limit instead of an impression: about 100 active NPCs while the game still runs at 60 images per second.",
          "metrics": [
            {
              "value": "≈100",
              "label": "active NPCs at 60 images per second"
            },
            {
              "value": "per system",
              "label": "cost of each image, shown in the profiler"
            }
          ]
        },
        {
          "id": "netcode",
          "captions": ["Three views of the same game. With network delay, player A sees their own character late: the hollow dot", "Prediction: A’s character moves at once, then corrects itself when the server disagrees", "A shoots. The server rewinds the target to where A saw it, then judges the hit. Try the latency slider", "At 250 ms of delay, shots still land"],
          "kicker": "Online multiplayer",
          "title": "Making an online game feel instant and fair",
          "summary": "I built the networking that keeps an online game responsive and fair when players have slow connections, and proved it with automated play sessions.",
          "problem": "Online, every message takes time to travel, so each player sees a slightly old version of the game. Without care, your character reacts late and shots that looked on target miss. And only the server should decide what really happened.",
          "built": "Movement and shooting where the server has the final say (server-authoritative), built with Node.js, Colyseus and Rapier. The player's device shows the result of an action immediately, then corrects itself if the server disagrees (client prediction and reconciliation). For shots, the server looks back in time to where the target was when the player fired (lag compensation).",
          "measured": "Automated play sessions with two clients and network delay injected on purpose, so the behaviour is verified by a run and not by feel.",
          "result": "Lag compensation looks back up to 250 ms, verified by those automated sessions.",
          "metrics": [
            {
              "value": "250 ms",
              "label": "of delay the server can look back"
            },
            {
              "value": "2 clients",
              "label": "automated sessions with injected delay"
            }
          ]
        },
        {
          "id": "pipelines",
          "captions": ["Raw generated content: an image, sound candidates, a first rough effect", "Three production lines start: images become 3D models, sounds and effects are generated", "Each line checks itself: models snap to the grip rule, weak sounds are dropped, a critic sends the effect back", "Out the other end: aligned models, the sounds that passed, an effect in its third revision"],
          "kicker": "Generated 3D models, effects and sound",
          "title": "Three content pipelines built alone, from scratch",
          "summary": "I built, without handing off to anyone, the systems that generate a game's 3D models, visual effects and sounds, each one checking its own output.",
          "problem": "A generated game needs objects, visual effects and sounds. AI can generate them, but each result has to fit the engine without a person fixing it by hand.",
          "built": "Three pipelines, meaning automatic production lines, taken from nothing to working on my own: 3D weapon models generated from images, generated sound effects, and generated visual effects (VFX).",
          "measured": "Each pipeline checks its own output. Sounds: candidates are scored automatically, then cleaned up. 3D models: each one is automatically aligned to a grip contract, a fixed rule for how a character holds it. Visual effects: the effect is rendered, an AI model looks at the image and criticises it, and the effect is revised, in a loop.",
          "result": "97 generated sound effects and 42 3D weapon models, all aligned automatically to the grip contract.",
          "metrics": [
            {
              "value": "97",
              "label": "generated sound effects, scored and cleaned automatically"
            },
            {
              "value": "42",
              "label": "3D weapon models generated from images, aligned automatically"
            }
          ]
        },
        {
          "id": "shipping",
          "captions": ["Three very different games, each missing what it needs to run", "Shared systems come online one by one. The lines show which games use each", "The games run, covered by automated tests and play sessions that run on their own", "Four shared systems carry all three games"],
          "kicker": "Gameplay systems",
          "title": "The engine systems behind ten shipped games",
          "summary": "I built the reusable gameplay systems (weapons, vehicles, computer-controlled characters, animation) that let very different games run on one engine, and shipped more than ten complete games and maps to prove them.",
          "problem": "A shooter, a kart racer and a block-building world need very different things from an engine. Writing special code for each game does not scale, least of all when AI agents are the ones assembling the game.",
          "built": "Generic gameplay building blocks that any game can combine: weapons, physically simulated vehicles, navigation and behaviour for computer-controlled characters (NPCs), characters and animation. The agents use them through a declarative game specification, a structured description of the game that they write, and the same code runs solo and online.",
          "measured": "Each block was proven by shipping complete games on it: an online tactical shooter with computer-controlled opponents and 34 weapons defined purely by data, kart racing games, and voxel (block-based) worlds. Every gap a game exposed was closed with a generic block, not a one-off fix. It is backed by 600+ automated tests and by play sessions run automatically with several simulated players. I also built a server, on the MCP standard, through which outside AI coding assistants such as Claude Code or Codex build and inspect games live.",
          "result": "10+ complete games and maps in production, and an engine that gained a generic building block for every gap they exposed.",
          "metrics": [
            {
              "value": "10+",
              "label": "complete games and maps in production"
            },
            {
              "value": "34",
              "label": "weapons defined by data in the tactical shooter"
            },
            {
              "value": "600+",
              "label": "automated tests"
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
          "title": "From a sentence to a 3D object ready for a game",
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
      "intro": "Two years of freelance work for clients, alongside my studies: games, automation and trading tools.",
      "cases": [
        {
          "id": "emotion",
          "captions": ["A game running at a fixed pace, unaware of the player", "The camera reads the player’s expression and the game’s pace follows it", "A dashboard tallies how the player felt", "The two other client projects, before and after"],
          "kicker": "Client projects",
          "title": "Three clients, three problems, three delivered systems",
          "summary": "As a freelancer I delivered a game system that reacts to the player's emotions, an automation that cut pre-production cycles by 75%, and trading tools using 70% less CPU.",
          "problem": "Each client came with a different need: a game that adapts to what the player feels, circuit-board image files (Gerber) processed by hand before production, and automated trading programs that used too much of the computer's processor.",
          "built": "A plugin for the Unity game engine that recognises the player's facial emotion in real time with deep learning and drives the game logic with it. A hyper-casual mobile game, designed and shipped with Unity and C#. A Python program that processes Gerber images automatically. And expert advisors (automated trading programs, in MQL4/5) that manage risk adaptively.",
          "measured": "A dashboard analysing players' emotional feedback for the game plugin, and real-time dashboards for the trading programs.",
          "result": "Pre-production cycles cut by 75% with the Gerber automation, and 70% lower CPU load on the trading programs through multithreading and caching.",
          "metrics": [
            {
              "value": "−75%",
              "label": "pre-production cycles, Gerber automation"
            },
            {
              "value": "−70%",
              "label": "CPU load, trading programs"
            }
          ]
        }
      ]
    }
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
    introCaption: "A small game world, generated in your browser. Each case study below is replayed here",
    prev: "Previous case",
    next: "Next case",
    phases: ['Problem', 'Build', 'Measure', 'Result'],
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
