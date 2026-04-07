# DrMindit Backend

Scalable, secure, and intelligent backend for the DrMindit Mental Health Platform.

## Architecture
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL (Prisma ORM)
- **Cache/Queue**: Redis (BullMQ)
- **Security**: JWT, Passport, Throttler, Role-based Access
- **AI**: Secure Backend Proxy for LLM interactions

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose

### Setup
1. Clone the repository
2. Run `npm install`
3. Start infrastructure: `docker-compose up -d`
4. Run migrations: `npx prisma migrate dev`
5. Start the app: `npm run start:dev`

### API Documentation
Once running, visit: `http://localhost:3000/api` for Swagger documentation.

## Features
- **Auth**: Secure login/registration with JWT.
- **Programs**: 21-day guided therapy logic with locked progression.
- **AI Chat**: Proxy-based secure AI interaction with crisis detection.
- **Analytics**: Mood trends, stress scoring, and risk monitoring.
- **Crisis**: Dedicated SOS workflows and emergency contacts.

## Deployment
Use the provided `Dockerfile` for containerized deployment to AWS/GCP/Azure.
```bash
docker build -t drmindit-backend .
```
