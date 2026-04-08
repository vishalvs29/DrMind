# 🧠 DrMind | Your Personal Mental Wellness Sanctuary

DrMind is a production-grade mental wellness application designed to guide users through neuro-scientifically backed exercises including meditation, controlled breathing, and physiological coherence techniques. Built with a focus on stability, security, and seamless user experiences.

---

## 🚀 Core Features

### 🎧 Guided Multi-Step Audio Sessions
Experience structured mental health routines that flow naturally. Each session is composed of multiple guided steps:
- **Brain-Heart Coherence**: Heart-focused breathing to synchronize physiological rhythms.
- **Wim Hof Breathing**: Deep oxygenation techniques for stress resilience.
- **Bhramari Pranayama**: Humming bee breath for immediate nervous system calming.
- **Deep Meditation**: Guided mindfulness for long-term mental clarity.

### 🔄 Intelligent Flow & Persistence
- **Auto-Play Progression**: Seamlessly transitions between session steps without user intervention.
- **Real-Time Progress Tracking**: Granular tracking (every 5 seconds) persisted to the backend.
- **Resume Anywhere**: Interrupted sessions can be resumed exactly where you left off, even after an app restart.
- **Session Analytics**: Detailed insights into completion rates and daily streaks.

### 🔐 Security & Safety
- **Emotion-Aware AI**: Integrated AI safety framework that detects crisis indicators and provides immediate helpline resources.
- **Secure Infrastructure**: Production-hardened auth with JWT, DTO validation, and restricted CORS policies.

---

## 🏗️ Project Structure

```text
DrMind/
├── src/                # Frontend (React Native / Expo)
│   ├── components/     # Reusable UI Atoms & Molecules
│   ├── models/         # TypeScript Interfaces & Schemas
│   ├── navigation/     # App Routing (Tabs & Stacks)
│   ├── screens/        # Feature Pages (Home, Insights, Player, etc.)
│   ├── services/       # API Clients & Audio Controllers
│   ├── store/          # Zustand State Management
│   └── theme/          # Design Tokens & Style System
├── backend/            # Backend (Node.js / NestJS)
│   ├── prisma/         # Database Schema & Migrations
│   ├── src/            # API Controllers, Services & Modules
│   └── test/           # E2E & Unit Test Suites
├── landing-page/       # Next.js Marketing Site
└── assets/             # Global Static Assets (Audio/Images)
```

---

## 🛠️ Tech Stack

### Frontend
- **React Native (Expo)**: Cross-platform mobile development.
- **Zustand**: Lightweight, scalable state management for audio orchestration.
- **Expo-AV**: High-performance audio playback engine.
- **Lucide-Icons**: Consistent, premium iconography system.

### Backend
- **Node.js (NestJS)**: Enterprise-ready modular backend framework.
- **Prisma (ORM)**: Type-safe database interactions with PostgreSQL.
- **Supabase**: Planned integration for DB, Auth, and Storage.
- **BullMQ**: Distributed job queue for background analytics processing.

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v18+
- **npm** or **yarn**
- **Expo Go**: (for mobile testing) or **Docker** (for backend services)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vishalvs29/DrMind.git
   cd DrMind
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Start the database (if using Docker)
   docker compose up -d
   # Sync schema and start API
   npx prisma db push
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd ..
   npm install
   npx expo start
   ```

---

## 📡 API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/auth/login` | `POST` | User authentication and JWT issuance. |
| `/session/start` | `POST` | Initialize a multi-step session progress. |
| `/session/progress` | `POST` | Update granular playback time (throttled). |
| `/session/complete` | `POST` | Finalize session and update streaks. |
| `/mood/history` | `GET` | Retrieve user emotional trends. |

---

## 🎯 Future Roadmap
- [ ] **AI Voice Generation**: Personalized narrators using ElevenLabs integration.
- [ ] **Corporate Dashboards**: Mental health analytics for organizations.
- [ ] **Wellness Notifications**: Smart reminders via WhatsApp and Push.
- [ ] **Biometric Sync**: Heart rate variability (HRV) tracking for real-time stress detection.

---

## 📄 License
This project is licensed under the **MIT License**.

---

## 🤝 Contributing
Contributions are welcome! Please ensure all code passes the `lint` and `test` checks before submitting a Pull Request.

---
*Built with ❤️ for better mental health.*
