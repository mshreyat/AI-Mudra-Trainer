# 🪷 MudraSense AI

**Explainable AI-Powered Intelligent Tutoring System for Bharatanatyam Mudra Training**

---

## 🎯 Project Vision

MudraSense AI is an **intelligent tutoring system** that teaches Bharatanatyam mudras (hand gestures) in real time. Similar to how AI Yoga Trainers coach yoga poses, MudraSense AI provides **real-time coaching and feedback** for mudra practice.

> **Important:** This is NOT a mudra classifier, sign language recognizer, or yoga trainer.
> The emphasis is on **tutoring and coaching** — guiding the student to form correct mudras through actionable, per-finger feedback.

### Core Capabilities (Planned)

- 📹 **Live Webcam Feed** — Real-time camera capture for hand tracking
- ✋ **Hand Detection** — Single-hand detection using MediaPipe Hands
- 📐 **Geometry Analysis** — Analyze finger angles, distances, and joint positions
- 🎯 **Mudra Comparison** — Compare student's hand against reference mudra geometry
- 🗣️ **Real-Time Coaching** — Actionable feedback ("Extend your index finger more")
- 👆 **Per-Finger Correction** — Identify exactly which finger needs adjustment
- ⏱️ **Hold Progress** — Track how long a mudra is held correctly
- 📊 **Practice Sessions** — Track and log practice sessions over time
- 📈 **Practice Reports** — Generate summaries and progress reports

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Vite, TypeScript, Tailwind CSS |
| **Backend** | FastAPI, Python 3.10 |
| **Computer Vision** | MediaPipe Hands, OpenCV |
| **Machine Learning** | Scikit-learn (optional, future) |

---

## 📁 Project Structure

```
mudrasense-ai/
├── README.md
├── .gitignore
│
├── frontend/                    # React + Vite + TypeScript frontend
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx             # React entry point
│       ├── App.tsx              # Root component with routing
│       ├── index.css            # Tailwind directives + global styles
│       ├── vite-env.d.ts        # Vite type declarations
│       │
│       ├── components/          # UI Components
│       │   ├── common/          # Reusable UI primitives (Button, Card, Modal, Loader)
│       │   ├── layout/          # Page structure (Header, Footer, Sidebar, Layout)
│       │   ├── camera/          # Webcam feed and controls
│       │   ├── tutor/           # Mudra selection, overlay, tutoring panel
│       │   ├── feedback/        # Real-time feedback, per-finger correction, hold progress
│       │   └── practice/        # Timer, session summary, practice history
│       │
│       ├── pages/               # Route-level page components
│       ├── hooks/               # Custom React hooks (camera, MediaPipe, analysis, session)
│       ├── services/            # API client and service modules
│       ├── types/               # TypeScript type definitions
│       ├── utils/               # Utility functions and constants
│       └── assets/              # Static assets (images, icons)
│
└── backend/                     # FastAPI Python backend
    ├── requirements.txt
    └── app/
        ├── __init__.py
        ├── main.py              # FastAPI app factory, CORS, router mounting
        │
        ├── api/                 # API route handlers
        │   ├── routes_mudra.py
        │   ├── routes_practice.py
        │   └── routes_analysis.py
        │
        ├── core/                # App configuration and exceptions
        │   ├── config.py
        │   └── exceptions.py
        │
        ├── models/              # Domain data models
        │   ├── mudra.py
        │   └── practice_session.py
        │
        ├── schemas/             # Pydantic request/response schemas
        │   ├── mudra.py
        │   ├── practice.py
        │   └── feedback.py
        │
        ├── services/            # Business logic layer
        │   ├── mudra_service.py
        │   ├── practice_service.py
        │   └── analysis_service.py
        │
        ├── utils/               # Utility functions
        │   ├── geometry.py
        │   └── helpers.py
        │
        ├── ml/                  # Machine learning modules (future)
        │   ├── hand_analyzer.py
        │   └── mudra_comparator.py
        │
        ├── uploads/             # User-uploaded files
        └── reference_mudras/    # Reference mudra data and geometry
```

---

## 📂 Folder Purpose Guide

### Frontend

| Folder | Purpose |
|--------|---------|
| `components/common/` | Reusable, generic UI primitives — buttons, cards, modals, loaders. Not tied to any specific feature. |
| `components/layout/` | Page-level structural components — header, footer, sidebar, layout wrapper. Define the app shell. |
| `components/camera/` | Webcam feed display and camera controls (start, stop, switch). Handles the visual camera layer. |
| `components/tutor/` | Mudra tutoring UI — mudra selection dropdown, reference overlay on the camera feed, and tutoring instructions panel. |
| `components/feedback/` | Real-time coaching feedback — displays correction hints, per-finger guidance, and mudra hold progress bar. |
| `components/practice/` | Practice session management — timer, post-session summary, and historical session list. |
| `pages/` | Route-level page components. Each page composes multiple components into a full view. |
| `hooks/` | Custom React hooks encapsulating stateful logic — camera access, MediaPipe integration, mudra analysis, and session management. |
| `services/` | API communication layer — Axios/fetch client setup and typed service functions for mudra, practice, and analysis endpoints. |
| `types/` | TypeScript interfaces and type definitions shared across the frontend — mudra, practice, feedback, and API response types. |
| `utils/` | Pure utility functions and constants — no side effects, no React dependencies. Geometry helpers, formatters, app constants. |
| `assets/` | Static assets — images, icons, and other media files bundled by Vite. |

### Backend

| Folder | Purpose |
|--------|---------|
| `api/` | FastAPI route handlers (controllers). Define HTTP endpoints, handle request parsing, delegate to services. |
| `core/` | Application-wide configuration (environment variables, settings) and custom exception classes. |
| `models/` | Domain data models representing core entities — mudras, practice sessions. Used internally by services. |
| `schemas/` | Pydantic schemas for API request validation and response serialization. Separate from internal models. |
| `services/` | Business logic layer. Orchestrates operations between models, ML modules, and external resources. |
| `utils/` | Pure utility functions — geometry calculations, angle computations, general helpers. |
| `ml/` | Machine learning and computer vision modules — hand analysis, mudra comparison. Isolated from API layer. |
| `uploads/` | Directory for user-uploaded files (images, videos for offline analysis). |
| `reference_mudras/` | Reference mudra geometry data — landmark positions, angle ranges, and finger states for each mudra. |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.10
- **npm** or **yarn**

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will start at `http://localhost:5173`.

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`.
API docs at `http://localhost:8000/docs`.

---

## 📜 License

This project is for educational and research purposes.

---

> *"The hand speaks what the heart feels."* — Ancient Indian proverb about Mudras
