# 🏝️ Đảo nhỏ — Taiwan Mandarin

A personal Mandarin learning system built for studying **Traditional Chinese** and preparing for daily life and graduate study in Taiwan.

The project started as a simple way to organize my own vocabulary and sentence practice. Over time, it grew into an offline Windows application covering structured lessons, spaced repetition, pronunciation references, grammar, and practice across listening, speaking, reading, and writing.

> [!NOTE]
> This is a personal learning project and an active work in progress.  
> The content is not a certified language course and has not been fully reviewed by a professional Mandarin teacher.

---

## 🎯 Why I built it

I wanted a learning environment that matched the way I study:

- Traditional Chinese rather than Simplified Chinese
- Taiwanese Mandarin as the main context
- Vietnamese explanations
- Pinyin with tone marks
- practical daily-life and university-related topics
- structured review instead of scattered screenshots and notes
- progress stored locally rather than depending on an online service

The goal is not to replace a teacher or an established language-learning platform.

It is simply a tool I can continuously adapt to my own learning process.

---

## ✨ Current Features

### 📚 Structured learning

- 18 topic-based units
- 72 lessons
- 360 vocabulary items
- 720 core learning exercises
- introductory dialogues for each topic
- Traditional Chinese + Pinyin + Vietnamese support

Topics include areas such as:

- greetings
- food
- shopping
- transportation
- family
- home
- schedules
- classroom
- campus life
- health
- renting
- work
- travel
- social situations

---

### 🎧 Four-skill practice

The application includes practice for:

- Listening
- Speaking
- Reading
- Writing

There are currently **216 authored practice sets** with approximately **1,620 practice items / turns**.

Practice sessions support:

- progress saving
- unfinished-session recovery
- rotating authored exercise sets
- optional hints
- hiding Pinyin and Vietnamese meaning during practice
- recording and replaying speaking attempts

Speaking and writing exercises are intentionally not treated as automatically correct or incorrect when reliable evaluation is unavailable.

---

### 🔁 Review and spaced repetition

Vocabulary and learning items can be reviewed through a spaced-repetition workflow.

Progress is stored locally in SQLite, including:

- cards
- sessions
- notes
- learning events
- settings
- reports

The application also includes backup and restore support.

---

### 🧩 Grammar and focused practice

Current learning modules include:

- 36 grammar items
- measure-word practice
- verb-focused lessons
- separable verbs
- topic-based grammar review

Content is still being expanded and refined as I continue learning Mandarin myself.

---

### 🔊 Pronunciation

The pronunciation section currently includes:

- a Pinyin reference table
- four-tone playback
- 1,598 recorded syllable audio files
- pronunciation examples
- tone-change and connected-speech experiments

Some pronunciation features remain experimental.

Audio quality and Taiwanese accent accuracy have **not** been professionally certified.

---

### 🤖 Optional AI-assisted practice

The application can optionally generate additional practice exercises using a local language model.

Generated exercises are clearly separated from authored learning content and are treated as:

> **Unverified supplemental practice**

They are not included in the application's core learning scores.

Speech transcription is also available through a local ASR model, but transcription accuracy should not be interpreted as pronunciation or tone assessment.

---

## 🖥️ Offline-first

The application is designed primarily for local Windows use.

Most core features work without an external cloud service:

- lessons
- vocabulary
- review
- notes
- grammar
- local progress storage
- local AI features when models are installed

User learning data is stored locally in:

```text
data/learning.sqlite3

The database, local models, generated audio, runtime files, and personal learning data are intentionally excluded from Git.
🛠️ Tech Stack
Frontend
- React
- TypeScript
- Vite
Backend
- Python
- FastAPI
- SQLite
Learning system
- spaced-repetition scheduling
- persistent learning sessions
- authored exercise banks
- progress and event tracking
Optional local AI
- llama.cpp
- Qwen3-4B
- whisper.cpp
- local speech / TTS experiments
AI is a supporting component of the application rather than the core learning methodology.
🏗️ Architecture
React / TypeScript UI
        │
        ▼
   FastAPI backend
        │
        ├── Learning logic
        ├── Practice generation
        ├── Content validation
        ├── Audio / speech adapters
        │
        ▼
     SQLite
        │
        ├── progress
        ├── sessions
        ├── cards
        ├── notes
        └── reports

The frontend is built once and served by the local backend.
🚀 Running the application
On the configured Windows environment:
npm.cmd ci
.\.venv\Scripts\python.exe -m pip install -r requirements.lock
npm.cmd run build
.\Start.cmd

The application is then available at:
http://127.0.0.1:8765

Local AI features require the corresponding models and runtimes to be installed separately.
🧪 Development
Useful commands:
npm.cmd run server
npm.cmd run dev

npm.cmd run content:check
npm.cmd test

.\.venv\Scripts\python.exe -m pytest -q

npm.cmd run build
npm.cmd run test:e2e

Browser tests currently use Microsoft Edge.
Development and E2E environments use separate data directories so tests do not overwrite the real learning database.
⚠️ Current Limitations
This project should not currently be treated as a complete or professionally validated Mandarin curriculum.
Known limitations include:
- learning content has not been fully reviewed by a Mandarin teacher
- proficiency labels are learning targets, not TOCFL certification
- connected-speech pronunciation is still being evaluated
- speech recognition does not reliably evaluate Mandarin tones
- AI-generated exercises may contain language errors
- some pronunciation resources use general Standard Mandarin rather than specifically validated Taiwanese Mandarin recordings
- Windows is currently the primary supported platform
- Android and synchronization are future possibilities rather than current features
For implementation details and known issues, see the documents in [`docs/`](docs/).
🤖 Development Note
This project has been developed with extensive AI-assisted coding.
I use AI tools to help with implementation, debugging, refactoring, documentation, and technical exploration.
My role has focused on defining the learning requirements, deciding features and workflows, testing the application in real study sessions, evaluating whether features actually help me learn, identifying failures, and iterating on the system.
In other words, this is intentionally a personal AI-assisted / vibe-coding project, rather than a claim that every line of the codebase was written manually.
📖 Documentation
More detailed technical and development documentation is available in:
- [`docs/TASKS.md`](docs/TASKS.md)
- [`docs/DECISIONS.md`](docs/DECISIONS.md)
- [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md)
- [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md)
- [`docs/PLAN.md`](docs/PLAN.md)
Release notes and experiment-specific documentation are also kept in the docs/ directory.
🚧 Project Status
Active personal project — work in progress.
The application is already used for my own Mandarin study, but features and content continue to change as my learning needs evolve.
There is no fixed "final version" yet — the system grows together with my learning.
