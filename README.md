# F1 Hub

F1 Hub is a full-stack web application for exploring Formula 1 race schedules, driver and constructor standings, historical race archives, circuit layouts, telemetry analytics, and news.

## Features

- **Race Calendar**: View complete season schedules, round details, and race information.
- **Standings**: Real-time driver and constructor championship standings by season.
- **Driver & Constructor Profiles**: Detailed stats, career information, and head-to-head driver comparisons.
- **Historical Archive**: Ergast API-compatible historical season results, driver standings, and era breakdowns (1950–Present).
- **Circuit Data**: Circuit specifications and interactive track layout visualizations.
- **Telemetry & Analytics**: Championship progression trends, lap time breakdowns, and telemetry data powered by FastF1 and OpenF1.
- **Race Weather**: Track weather reports and forecasts.
- **F1 News Aggregator**: Latest Formula 1 news articles categorized by topic.

## Tech Stack

### Frontend
- **React 18** (Vite build tool)
- **Tailwind CSS** (Custom styling)
- **React Router v6** (Client-side routing)
- **Recharts** (Data visualization charts)
- **Axios** (HTTP client)
- **Lucide React** (UI Icons)

### Backend
- **Python 3.10+**
- **FastAPI** (Async web framework)
- **Uvicorn** (ASGI server)
- **Pydantic v2** (Data validation & settings)
- **HTTPX** (Async HTTP client for external APIs)
- **FastF1 & Pandas** (Telemetry data processing)

### Database
- **PostgreSQL**
- **SQLAlchemy 2.0** (Async ORM)
- **AsyncPG** (PostgreSQL async database driver)
- **Alembic** (Database schema migrations)

### Data Sources
- **Jolpica F1 API**: Ergast-compatible endpoint for historical seasons, results, and standings.
- **OpenF1 API**: Real-time and recent session telemetry and timing data.
- **FastF1**: Python package for accessing official F1 timing and telemetry data.
- **Open-Meteo API**: Fallback weather data for circuit coordinates.

## Project Structure

```text
formula1/
├── backend/
│   ├── alembic/              # Database migration scripts
│   ├── app/
│   │   ├── api/v1/endpoints/ # API route handlers (calendar, drivers, standings, etc.)
│   │   ├── core/             # App config, logging, and security settings
│   │   ├── db/               # Database session setup
│   │   ├── models/           # SQLAlchemy database models
│   │   ├── providers/        # External API integrations (Jolpica, OpenF1, FastF1, Weather)
│   │   ├── schemas/          # Pydantic data schemas
│   │   ├── services/         # Business logic & data ingestion services
│   │   └── main.py           # FastAPI application entry point
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── public/               # Static assets (images, favicon, videos)
│   ├── src/
│   │   ├── components/       # Reusable UI components & charts
│   │   ├── pages/            # Application views (Home, Drivers, Historical, etc.)
│   │   ├── services/         # Axios API client setup
│   │   └── App.jsx           # Root layout and route configuration
│   ├── package.json          # Node.js dependencies and scripts
│   └── vite.config.js        # Vite configuration
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL database instance

### 1. Backend Setup

Navigate to the `backend` directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Start the FastAPI development server:
```bash
uvicorn app.main:app --reload --port 8000
```
The API documentation will be available at `http://localhost:8000/docs`.

### 2. Frontend Setup

In a new terminal window, navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend application will be running at `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env` in the root directory to configure environment variables:

```env
# Environment & Server Settings
ENVIRONMENT=development
CURRENT_F1_SEASON=2026
SECRET_KEY=your-secret-key-here

# Service Ports
PORT_FRONTEND=3000
PORT_BACKEND=8000
PORT_POSTGRES=5432

# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql+asyncpg://f1_user:f1_password@localhost:5432/f1_analytics

# External API URLs
JOLPICA_BASE_URL=https://api.jolpi.ca/ergast/f1
OPENF1_BASE_URL=https://api.openf1.org/v1
FASTF1_CACHE_DIR=/tmp/fastf1_cache
```

## API Endpoints

Key endpoints provided by the backend API:

- `GET /api/v1/health` - Backend service status check
- `GET /api/v1/calendar` - Race schedules by season
- `GET /api/v1/standings/drivers` - Driver championship standings
- `GET /api/v1/standings/constructors` - Constructor championship standings
- `GET /api/v1/drivers` - Driver directory and profile data
- `GET /api/v1/constructors` - Constructor directory and profile data
- `GET /api/v1/circuits` - Circuit information and specs
- `GET /api/v1/results/sessions/{session_id}/results` - Session race results
- `GET /api/v1/analytics/championship-progression` - Driver points progression chart data
- `GET /api/v1/analytics/compare` - Head-to-head driver comparison stats
- `GET /api/v1/historical/seasons` - Historical F1 archive seasons
- `GET /api/v1/news` - Formula 1 news feed
- `GET /api/v1/weather/{race_id}` - Race location weather reports
