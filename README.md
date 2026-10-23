# College Event Registration & Management System

> **Problem Statement 8 • 4-Hour Beginner Hackathon • Full-Stack Web Application**  
> A complete, responsive, full-stack event management and digital ticketing platform designed for collegiate campuses. Built with React (Vite), Node.js (Express), MongoDB (Mongoose), and Firebase Auth. Features vibrant category theming, live seat telemetry, verified QR admission passes, and an admin dashboard.

---

## 🏛️ Project Overview

Colleges conduct technical, cultural, sports, and academic events throughout the semester. Managing physical registrations, capacity constraints, duplicate bookings, and ticket verifications manually is time-consuming and error-prone.

This platform provides:
- **Instant Discovery & Filtering**: Search and filter events across **Technical**, **Cultural**, **Sports**, and **Academic** tracks.
- **Concurrent Registration Engine**: Prevents overbooking, blocks duplicate student registrations, and closes past event registrations.
- **Verifiable Digital QR Tickets**: Generates admission passes with embedded QR codes and high-res PNG download.
- **Live Administrator Dashboard**: Real-time stats calculation (**Total Events: 12**, **Total Registrations: 436**, **Upcoming Events: 5**, and **Today's Registrations: 48**).
- **Vibrant Modern UI**: Rich color system with tailored category themes, soft gradients, glassmorphic cards, and dark/light mode toggle.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Lucide Icons, QRCode.react, html2canvas |
| **Backend** | Node.js, Express.js, CORS, JSONWebToken, dotenv |
| **Database** | MongoDB & Mongoose (with built-in high-fidelity zero-setup fallback) |
| **Authentication** | Firebase Auth SDK + Built-in Hackathon Demo Auth with RBAC |
| **Styling** | Modern Design System (Vibrant Category Themes, Gradients, Dark/Light Mode) |

---

## 🎨 Color Palette & Category Theming

| Category | Primary Color | Gradient / Styling | Badge Class |
|---|---|---|---|
| **Technical** | Electric Indigo (`#6366f1`) | `linear-gradient(135deg, #6366f1, #8b5cf6)` | `.badge-tech` |
| **Cultural** | Vibrant Rose / Fuchsia (`#ec4899`) | `linear-gradient(135deg, #ec4899, #f43f5e)` | `.badge-cultural` |
| **Sports** | Amber / Orange (`#f59e0b`) | `linear-gradient(135deg, #f59e0b, #ea580c)` | `.badge-sports` |
| **Academic** | Sky Blue / Teal (`#0ea5e9`) | `linear-gradient(135deg, #3b82f6, #06b6d4)` | `.badge-academic` |

**Status Accents**:
- **Active / Available**: Emerald (`#10b981`)
- **Filling Fast**: Amber (`#f59e0b`)
- **Full / Sold Out**: Crimson (`#ef4444`)
- **Concluded**: Slate (`#64748b`)

---

## 🔑 Demo Login Credentials

The database is pre-seeded with accounts ready for instant testing:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Campus Administrator** | `admin@college.edu` | `admin123` | Full access to `/admin`, create, edit, delete events, participant lists, CSV export |
| **Student** | `alex.smith@college.edu` | `student123` | Event browsing, one-click registration, `/my-registrations`, QR ticket download |

> ⚡ **Tip**: The Login page also features **1-Click Quick Demo Login** buttons for instant evaluator access without typing!

---

## 📊 Live Dashboard Metrics (Pre-Seeded)

When the seed script is executed, it populates the exact expected metrics:

| Metric | Target Value | Description |
|---|---|---|
| **Total Events** | **12** | 4 Technical, 3 Cultural, 3 Sports, 2 Academic |
| **Total Registrations** | **436** | Realistic distribution of collegiate attendees |
| **Upcoming Events** | **5** | Scheduled on or after the current date |
| **Today's Registrations** | **48** | Registrations confirmed on the current day |

---

## 🚀 Quick Start & Run Instructions

### 1. Prerequisites
- **Node.js** v18+ or v20+ installed.
- (Optional) Local MongoDB running or a MongoDB Atlas URI. If MongoDB is not running locally, the server automatically initializes its built-in resilient file data store (`server/data/db.json`) for seamless zero-setup evaluation!

### 2. Clone and Install Dependencies
From the project root:
```bash
# Install root, backend, and frontend dependencies in one command:
npm run install:all
```

### 3. Seed Sample Data
Populate the database with the exact 12 events, 436 registrations, 5 upcoming events, and 48 today's registrations:
```bash
npm run seed
```

### 4. Start Development Servers
Start both the Express backend (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Open your browser to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🧭 Pages & Routes

| Route | Description | Access |
|---|---|---|
| `/` | Landing / Home page with hero, live metrics ribbon, categories, and spotlight events | Public |
| `/events` | All events discovery page with live search, category pills, and upcoming filter | Public |
| `/events/:id` | Event details page with live capacity progress, registration button, and QR ticket modal | Public |
| `/login` | Sign-in page with email/password form + 1-click evaluator demo buttons | Public |
| `/signup` | User registration page with Student vs Administrator role selector | Public |
| `/my-registrations` | Student's confirmed event passes with QR code preview, PNG download, and cancellation | Student (Protected) |
| `/admin` | Administrator dashboard with 4 live stat cards, table, and delete confirmation modal | Admin (Protected) |
| `/admin/events/new` | Create event form with category selector, capacity, and live card preview | Admin (Protected) |
| `/admin/events/:id/edit` | Edit event form with live card preview to update schedule, venue, capacity, or description | Admin (Protected) |
| `/admin/events/:id/participants` | Event attendee roster with student details and 1-click CSV export | Admin (Protected) |

---

## 📡 REST API Endpoints

### Authentication & Profiles
- `POST /api/auth/sync` - Create or sync user profile after sign-in.
- `POST /api/auth/demo-login` - Fast-track authentication for evaluator accounts.
- `GET /api/auth/me` - Retrieve current authenticated session (`requireAuth`).

### Events
- `GET /api/events` - List events (Query filters: `search`, `category`, `upcoming`).
- `GET /api/events/:id` - Retrieve event details and live seat calculation.
- `POST /api/events` - Create new event (`requireAdmin`).
- `PUT /api/events/:id` - Update existing event (`requireAdmin`).
- `DELETE /api/events/:id` - Delete event and remove its registrations (`requireAdmin`).
- `POST /api/events/:id/register` - Register logged-in student for an event (`requireAuth`).
- `GET /api/events/:id/participants` - Retrieve participant roster for an event (`requireAdmin`).

### Registrations & Student
- `GET /api/registrations/me` - List all event passes for authenticated student (`requireAuth`).
- `DELETE /api/registrations/:id` - Cancel a registration and release seat (`requireAuth`).

### Admin Analytics
- `GET /api/admin/stats` - Live calculations (`totalEvents`, `totalRegistrations`, `upcomingEvents`, `todaysRegistrations`).
