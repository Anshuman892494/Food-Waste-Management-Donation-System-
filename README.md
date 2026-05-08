# FoodBridge — Food Waste Management System

A MERN stack platform connecting Donors (Restaurants/Hostels), NGOs, and Volunteers to minimize food waste.

## Project Structure
- `server/`: Node.js/Express API
- `client/`: React/Tailwind Frontend

## Prerequisites
- Node.js installed
- MongoDB running locally on `mongodb://localhost:27017/foodbridge`

## Getting Started

### 1. Unified Start (Recommended)
From the root directory:
```bash
npm install
npm run dev
```
This will start both the **Backend (Port 5000)** and **Frontend (Port 5173)** simultaneously.

### 2. Manual Setup
If you prefer running them separately:

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

## Features
- **Donor Dashboard:** List surplus food, track pickups.
- **NGO Dashboard:** Locate available food via geo-queries, claim donations.
- **Volunteer Dashboard:** Manage delivery tasks, update status in real-time.
- **Admin Panel:** System-wide analytics and user management.
- **Real-Time Alerts:** Instant notifications when food is listed or claimed.
