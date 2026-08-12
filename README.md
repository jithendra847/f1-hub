🏎️ F1 Hub

«A full-stack Formula 1 analytics platform for exploring races, championship standings, historical data, circuits, telemetry, weather, and F1 news — all in one place.»

🌐 Live Demo: "f1-hub-olive.vercel.app" (https://f1-hub-olive.vercel.app) 
---

frontend/public/screenshots/
├── dashboard.png
├── standings.png
├── race-details.png
├── telemetry.png
└── circuits.png

"F1 Hub Dashboard" (frontend/public/screenshots/dashboard.png)

---

🎯 About the Project

F1 Hub is a full-stack Formula 1 analytics application designed to bring important Formula 1 information together in a single platform.

Instead of switching between multiple sources for race schedules, championship standings, historical results, circuit information, telemetry, weather, and news, F1 Hub provides these features through one unified interface.

The application combines a modern React frontend, FastAPI backend, PostgreSQL database, and multiple Formula 1 data providers to create a scalable foundation for F1 data exploration and analytics.

---

✨ Features

🏁 Race Calendar

- Complete Formula 1 season calendar
- Race rounds and event information
- Race session details
- Upcoming and completed events

🏆 Championship Standings

- Driver championship standings
- Constructor championship standings
- Season-based standings
- Championship progression analytics

👨‍🏎️ Driver & Constructor Profiles

- Driver directory
- Driver career information
- Constructor information
- Driver statistics
- Head-to-head driver comparisons

📚 Historical F1 Archive

- Historical Formula 1 seasons
- Race results
- Driver standings
- Constructor standings
- Historical championship data
- Era-based exploration

🏎️ Circuit Information

- Circuit specifications
- Circuit locations
- Track information
- Interactive circuit layout visualizations

📊 Telemetry & Analytics

- Lap timing data
- Championship progression
- Driver comparisons
- Telemetry analytics
- Session data
- Data visualization using interactive charts

Telemetry and timing information are powered by FastF1 and OpenF1.

🌦️ Race Weather

- Circuit weather information
- Race-location weather data
- Weather data fallback using Open-Meteo

📰 F1 News

- Latest Formula 1 news
- Categorized news articles
- External links to related articles

---

🚀 Key Technical Highlights

- Full-stack React + FastAPI architecture
- RESTful backend API
- Asynchronous FastAPI services
- PostgreSQL database
- SQLAlchemy 2.0 async ORM
- Alembic database migrations
- External API integration
- Formula 1 telemetry processing
- Historical data ingestion
- Interactive data visualization
- Environment-based configuration
- Modular backend provider architecture
- Scalable separation between frontend, backend, database, and external data sources

---

🏗️ Architecture

                         ┌──────────────────────┐
                         │      F1 Hub UI       │
                         │    React + Vite      │
                         └──────────┬───────────┘
                                    │
                              REST API / HTTP
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      FastAPI         │
                         │      Backend         │
                         └──────────┬───────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
        │  PostgreSQL  │    │ F1 Providers │    │ Weather API  │
        │   Database   │    │              │    │              │
        └──────────────┘    │ • Jolpica    │    │ Open-Meteo   │
                            │ • OpenF1     │    └──────────────┘
                            │ • FastF1     │
                            └──────────────┘

Backend Data Flow

External F1 APIs
       │
       ▼
Provider Layer
       │
       ▼
Service Layer
       │
       ▼
Database / Processing
       │
       ▼
FastAPI REST Endpoints
       │
       ▼
React Frontend

The backend follows a modular architecture where external data providers are separated from application business logic.

---

🛠️ Tech Stack

Frontend

- React 18
- Vite
- JavaScript
- Tailwind CSS
- React Router v6
- Recharts
- Axios
- Lucide React

Backend

- Python 3.10+
- FastAPI
- Uvicorn
- Pydantic v2
- HTTPX
- FastF1
- Pandas

Database

- PostgreSQL
- SQLAlchemy 2.0
- AsyncPG
- Alembic

Data Sources

Provider| Purpose
Jolpica F1 API| Historical F1 data, race results and standings
OpenF1 API| Recent session, timing and telemetry data
FastF1| F1 timing, telemetry and analytics
Open-Meteo| Weather data

---

📁 Project Structure

f1-hub/
│
├── backend/
│   ├── alembic/
│   │   └── ...                    # Database migrations
│   │
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/      # API route handlers
│   │   │
│   │   ├── core/                  # Configuration, logging & security
│   │   ├── db/                    # Database configuration & sessions
│   │   ├── models/                # SQLAlchemy models
│   │   ├── providers/             # External API integrations
│   │   ├── schemas/               # Pydantic schemas
│   │   ├── services/              # Business logic & data processing
│   │   └── main.py                # FastAPI entry point
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   ├── screenshots/           # Project screenshots
│   │   ├── images/
│   │   └── ...
│   │
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Application pages
│   │   ├── services/              # API client & services
│   │   └── App.jsx                # Root application
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .env.example                   # Environment variable template
├── .gitignore
├── fetch_openf1_layouts.py        # Circuit layout data utility
├── package-lock.json
└── README.md

---

⚙️ Getting Started

Prerequisites

Make sure the following are installed:

- Node.js 18+
- Python 3.10+
- PostgreSQL
- Git
- npm

---

1. Clone the Repository

git clone https://github.com/jithendra847/f1-hub.git
cd f1-hub

---

2. Configure Environment Variables

Create your local environment file from the provided template.

cp .env.example .env

On Windows PowerShell:

Copy-Item .env.example .env

Then configure the values inside ".env".

Example

ENVIRONMENT=development
CURRENT_F1_SEASON=2026

SECRET_KEY=your-secret-key-here

PORT_FRONTEND=3000
PORT_BACKEND=8000
PORT_POSTGRES=5432

DATABASE_URL=postgresql+asyncpg://f1_user:f1_password@localhost:5432/f1_analytics

JOLPICA_BASE_URL=https://api.jolpi.ca/ergast/f1
OPENF1_BASE_URL=https://api.openf1.org/v1

FASTF1_CACHE_DIR=/tmp/fastf1_cache

«⚠️ Never commit your actual ".env" file or production secrets to GitHub.»

The repository only contains ".env.example" with placeholder values.

---

🐍 Backend Setup

Navigate to the backend directory:

cd backend

Create a virtual environment:

Windows

python -m venv venv
venv\Scripts\activate

macOS/Linux

python3 -m venv venv
source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Start the FastAPI development server:

uvicorn app.main:app --reload --port 8000

The API documentation will be available at:

http://localhost:8000/docs

---

⚛️ Frontend Setup

Open another terminal and navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will be available at:

http://localhost:3000

---

🔌 API Endpoints

The backend exposes RESTful endpoints for accessing F1 data.

Method| Endpoint| Description
GET| "/api/v1/health"| Backend health check
GET| "/api/v1/calendar"| Season race calendar
GET| "/api/v1/standings/drivers"| Driver standings
GET| "/api/v1/standings/constructors"| Constructor standings
GET| "/api/v1/drivers"| Driver directory
GET| "/api/v1/constructors"| Constructor directory
GET| "/api/v1/circuits"| Circuit information
GET| "/api/v1/results/sessions/{session_id}/results"| Session results
GET| "/api/v1/analytics/championship-progression"| Championship progression
GET| "/api/v1/analytics/compare"| Driver comparison
GET| "/api/v1/historical/seasons"| Historical seasons
GET| "/api/v1/news"| F1 news feed
GET| "/api/v1/weather/{race_id}"| Race weather information

Interactive API documentation is available through FastAPI's Swagger UI at:

http://localhost:8000/docs

---

📡 Data Sources

Jolpica F1 API

Used for Ergast-compatible historical Formula 1 data including:

- Race schedules
- Race results
- Driver standings
- Constructor standings
- Historical seasons

OpenF1

Used for recent Formula 1 session and timing information.

FastF1

Used for:

- Telemetry
- Lap timing
- Session data
- Driver analytics
- F1 data processing

Open-Meteo

Used as a weather data provider for circuit locations.

---

🔐 Environment & Security

Environment-specific configuration is handled through environment variables.

The repository includes:

.env.example

but the actual:

.env

file should remain local and must never contain production secrets committed to GitHub.

---

📈 Future Improvements

Planned improvements include:

- [ ] Live race timing
- [ ] Advanced driver telemetry comparison
- [ ] Sector-by-sector performance analysis
- [ ] Tyre strategy visualization
- [ ] Race replay analytics
- [ ] More detailed circuit telemetry
- [ ] Automated data ingestion
- [ ] Improved caching
- [ ] Background data processing
- [ ] Authentication and personalized dashboards
- [ ] Mobile-focused UI improvements
- [ ] Expanded historical analytics

---

🤝 Contributing

Contributions, suggestions, and improvements are welcome.

Basic workflow

git checkout -b feature/your-feature

Make your changes, test them locally, then commit:

git add .
git commit -m "feat: add your feature"

Push your branch:

git push origin feature/your-feature

Then open a Pull Request.

---

📄 License

This project is currently intended as a personal/educational project.

If you plan to distribute the project publicly, consider adding an explicit open-source license such as MIT.

---

👨‍💻 Author

Jithendra Yatam

Information Technology Student
NIT Srinagar

Project

🏎️ F1 Hub

🌐 Live Demo: https://f1-hub-olive.vercel.app

📦 Repository: https://github.com/jithendra847/f1-hub

---

⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.
