# 🏎️ F1 Hub

A production-grade Formula 1 analytics and information platform focused on the **2026 F1 season**, with support for historical seasons (1950–present). Built with **FastAPI**, **PostgreSQL**, **Redis**, **Celery**, and **React (Vite + Tailwind)** using a strict **Neumorphic Light** UI system.

---

## 🛠️ Tech Stack & Architecture

- **Backend**: Python 3.12, FastAPI, SQLAlchemy 2.0 (Async), Alembic, Pydantic v2
- **Data Ingestion & Provider Layer**: Provider Adapters for Jolpica-F1, FastF1, OpenF1, Weather API & RSS Feeds
- **Caching & Async**: Redis 7, Celery Background Workers
- **Database**: PostgreSQL 16
- **Frontend**: React 18, Vite, Tailwind CSS (Custom Neumorphic tokens), React Router v6, Recharts
- **Containerization**: Docker & Docker Compose

---

## 🚀 Quick Start with Docker

```bash
# 1. Clone the repository and navigate to root directory
cd formula1

# 2. Copy environment file
cp .env.example .env

# 3. Start all services via Docker Compose
docker compose up --build
```

### 🌐 Exposed Ports

- **Frontend**: http://localhost:3000
- **FastAPI Backend & OpenAPI Docs**: http://localhost:8000/docs
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`

---

## 🔍 Health Checks

Verify all components are running healthy:

```bash
# General API Health
curl http://localhost:8000/api/v1/health

# PostgreSQL Connection Health
curl http://localhost:8000/api/v1/health/db

# Redis Connection Health
curl http://localhost:8000/api/v1/health/redis
```

---

## 📁 Repository Structure

```
.
├── backend/            # FastAPI Application & Background Workers
│   ├── app/
│   │   ├── api/        # REST & WebSocket Route Controllers
│   │   ├── core/       # Configurations, Logging & Security
│   │   ├── db/         # SQLAlchemy Async Sessions & Base Models
│   │   └── main.py     # FastAPI Entrypoint
│   └── Dockerfile
├── frontend/           # React 18 + Vite Neumorphic Client
│   ├── src/
│   │   ├── components/ # Reusable UI Cards, Buttons & Charts
│   │   └── App.jsx
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```
