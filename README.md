# Premium Portfolio Project

An ultra-clean, minimal, and highly professional personal website built with a modular **Flask (SQLAlchemy) backend** and an optimized **React (Vite + Vanilla CSS) frontend**, following Apple's design principles.

---

## 📁 Architecture & Folder Structure

```text
Portfolio Project/
├── backend/                  # Flask Modular Backend
│   ├── app/
│   │   ├── __init__.py       # App factory & frontend static router
│   │   ├── database.py       # SQLAlchemy initialization
│   │   ├── models.py         # DB models (Project, Skill, Message, AdminUser)
│   │   └── routes.py         # JWT secure REST API endpoints
│   ├── instance/
│   │   └── portfolio.db      # SQLite local database
│   ├── venv/                 # Python local virtual environment
│   ├── config.py             # Server settings and secret keys
│   ├── run.py                # Server entry point (starts server on port 5000)
│   ├── seed.py               # Prepopulates projects, skills, and admin account
│   └── requirements.txt      # Python dependencies (Flask, SQLAlchemy, PyJWT, CORS)
│
├── frontend/                 # React + Vite Frontend
│   ├── public/               # Favicon, robots.txt, sitemap.xml, verification files
│   ├── src/
│   │   ├── assets/           # React SVG assets
│   │   ├── components/       # Reusable components (Header, Footer, ScrollReveal, BackgroundGrid)
│   │   ├── pages/            # Page layouts (Home, AdminDashboard)
│   │   ├── App.jsx           # Client router and base wrapper
│   │   ├── index.css         # Apple-like Vanilla CSS design system
│   │   └── main.jsx          # React entry point
│   ├── vite.config.js        # Vite configurations (includes dev server API proxy)
│   └── package.json          # Node dependencies (React, Router, Vite)
│
├── backup_legacy/            # Legacy single-page HTML, CSS, JS files (Backed up)
└── README.md                 # Project documentation
```

---

## 🚀 How to Run locally

### 1. Run in Development Mode (Concurrent Servers)

In development, you run both servers concurrently. Vite will proxy any API calls (like `/api/projects`) to the Flask server automatically.

#### Step A: Run the Flask API Backend
1. Open a terminal and navigate to the `backend/` folder.
2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```
3. Run the backend:
   ```bash
   python run.py
   ```
   *The backend will boot up on `http://127.0.0.1:5000`.*

#### Step B: Run the Vite React Frontend
1. Open a second terminal and navigate to the `frontend/` folder.
2. Run the development server:
   ```bash
   npm run dev
   ```
   *The frontend will boot up on `http://localhost:5173`.*

---

### 2. Run in Production Mode (Unified Server)

In production, you compile the React frontend into static assets, and Flask serves both the API endpoints and the frontend layout on port 5000.

#### Step A: Compile the Frontend
Navigate to the `frontend/` folder and compile the build:
```bash
npm run build
```
This outputs compiled assets into `frontend/dist/`.

#### Step B: Boot the Flask Server
Navigate to the `backend/` folder and start the server:
```bash
source venv/bin/activate
python run.py
```
*Open `http://localhost:5000` in your browser. Flask is now serving the entire site.*

---

## 🔐 Administrative Credentials

The database has been seeded with your existing projects, skills, and a default administrative log.

- **Admin Route**: `/admin`
- **Default Username**: `admin`
- **Default Password**: `admin123`

*Note: You can easily add, edit, or delete items inside the Project Showcase, Capabilities list, and review incoming Contact Inbox directly from this panel.*

---

## ⚡ Performance & Design Features

- **No CLS (Cumulative Layout Shift)**: Replaced the heavy particles package with a hardware-accelerated, high-performance CSS grid pattern background.
- **60/120 FPS Scrolling**: Created a custom, lightweight scroll-reveal component using the native browser `IntersectionObserver` API instead of loading heavy visual frameworks.
- **Vanilla CSS styling**: Curated light/dark mode styling using CSS variable tokens mapping system fonts and smooth color transitions.
- **Resilient Fallbacks**: If the Flask backend goes offline, the frontend will automatically serve your default projects and skills, ensuring zero downtime or empty elements.
