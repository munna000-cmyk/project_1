# 🌊 VIZAG EXPLORER — Full-Stack 3D Tourism Platform

> **The Jewel on the Bay of Bengal**  
> A complete, production-quality, fully functional 3D tourism website for **Visakhapatnam (Vizag), Andhra Pradesh, India**.

---

## 🌟 Key Features & Highlights

### 1. 🌐 Cinematic 3D Experience (Three.js / React Three Fiber / Drei)
- **Realistic 3D Animated Ocean Mesh**: Dynamic Gerstner wave oscillation, depth gradient from turquoise shallows to deep navy Bay of Bengal waters, normal perturbation, and specular sun glint.
- **Interactive 3D Rotating Earth / Globe**: Topographical landmasses with a dedicated pulsing beacon pinpointing Visakhapatnam (*17.6868° N, 83.2185° E*) with interactive 3D HTML tooltip.
- **Floating 3D Nautical Elements**: 3D luxury catamaran yacht cruising the water and a floating 3D navigational marine compass.
- **Time-of-Day Lighting Controls**: Switch seamlessly between **Coastal Noon**, **Golden Sunset**, and **Starlit Night**.
- **Interactive 3D Destination Cards**: Real-time cursor-tracking 3D tilt physics and dynamic specular glare.

### 2. 📍 12 Verified Official Destinations
Every destination includes verified timings, official entry fees, GPS coordinates, distance from Vizag Railway Station, transportation guide, facilities, travel tips, and community reviews:
1. **Ramakrishna Beach (RK Beach)** — Urban coastal promenade & sunrise hub
2. **Rushikonda Beach** — Prestigious international Blue Flag certified swimming & watersports haven
3. **Kailasagiri Hilltop Park** — Colossal 40-foot Shiva-Parvati sculpture with cable car ropeway
4. **INS Kursura Submarine Museum** — South Asia's first real decommissioned Foxtrot-class naval submarine
5. **TU 142 Aircraft Museum** — Indian Navy maritime anti-submarine reconnaissance aircraft
6. **Yarada Beach** — Secluded golden sand paradise cradled by emerald hills
7. **Dolphin's Nose & Lighthouse** — 358m headland guarding Visakhapatnam Port with 1957 British lighthouse
8. **Simhachalam Temple** — 11th-century Kalinga-Dravidian temple of Lord Varaha Narasimha
9. **Araku Valley** — Eastern Ghats coffee cradle reached via scenic 58-tunnel Vistadome train
10. **Borra Caves** — 150-million-year-old deep karst limestone caves with illuminated stalactites
11. **Katiki Waterfalls** — 50-foot forest cascade accessible via 4x4 off-road jungle trail
12. **Lambasingi** — The "Kashmir of Andhra Pradesh" famous for sub-zero winter frost & mists

### 3. 🍤 Food & Gastronomy Guide
- **Coastal Andhra Cuisine & Fresh Seafood**: Sea Inn (Raju Gari Dhaba), Dakshin at Daspalla, Mekong Pan-Asian, MVP Colony Night Food Street.
- **Indigenous Specialties**: Bamboo Chicken (zero-oil wood-roasted tender chicken inside green bamboo stalks) and Araku Arabica single-origin pour-overs.

### 4. 🏨 Stay & Resort Guide + Instant Booking
- **Luxury Oceanfront & Hillside Stays**: Novotel Varun Beach, The Gateway Hotel by Taj, Radisson Blu Resort Rushikonda, The Bheemili Resort by Accor, APTDC Haritha Valley Resort Araku, and Hotel Daspalla.
- **Interactive Booking Flow**: Live pricing calculation (rooms × nights + 12% GST), guest details form, instant confirmation reference (`VIZAG-XXXXXX`), confetti animation, and printable booking voucher.

### 5. 🗺️ Interactive Geographic Map Explorer
- Interactive Leaflet map with custom emoji markers for all 12 destinations, beaches, museums, and food spots with flyTo camera transitions and detail popups.

### 6. 🗓️ Smart Itinerary Planner (1 to 4 Day Tours)
- **1-Day Tour**: Coastal Highlights & Kailasagiri Sunset
- **2-Day Tour**: Spiritual Simhachalam, Secluded Yarada & Rushikonda Watersports
- **3-Day Tour**: Vizag City + Vistadome to Araku Valley & Borra Caves
- **4-Day Tour**: Complete Grand Explorer: Vizag, Araku, Katiki Falls & Misty Lambasingi
- **Custom Itinerary Architect**: Pick spots from your saved favorites and build a personalized printable day schedule.

### 7. 🛡️ User Authentication & Admin Backoffice
- **JWT Authentication**: User registration, login, profile management, and persistent wishlist.
- **Admin Dashboard**: Real-time KPI statistics, destination catalog CRUD (create, update, delete), reservation management (Pending, Confirmed, Cancelled), and review moderation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Three.js, React Three Fiber, React Three Drei, Tailwind CSS, Lucide Icons, Leaflet, React-Leaflet, Canvas-Confetti |
| **Backend** | Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, CORS, RESTful API architecture |
| **Database** | MongoDB & Mongoose + High-Speed Persisted Local Storage Engine (Zero external dependencies required) |

---

## 🚀 Quick Start Guide

### 1. Unified Single-Command Start (Backend + 3D Frontend)
```bash
# From the root directory:
npm start
```
The server will start on `http://localhost:5000`, serving both the REST APIs (`/api/*`) and the built 3D web application.

### 2. Standalone Frontend Development
```bash
# Terminal 1: Backend API
cd server
npm start

# Terminal 2: Vite React Frontend
cd client
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live hot-reloading development server.

---

## 🔑 Demo & Admin Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@vizagexplorer.com` | `admin123` |
| **Tourist Demo** | `priya@example.com` | `admin123` |

*Or use the one-click "Tourist Demo" and "Admin Demo" quick-login buttons in the Sign In modal.*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & storage status |
| `GET` | `/api/destinations` | List all 12 destinations with search & filter |
| `GET` | `/api/destinations/:id` | Detailed destination info with verified data |
| `POST` | `/api/destinations` | Create landmark (Admin) |
| `PUT` | `/api/destinations/:id` | Update landmark (Admin) |
| `DELETE` | `/api/destinations/:id` | Delete landmark (Admin) |
| `GET` | `/api/food` | List restaurants & street food |
| `GET` | `/api/stays` | List luxury hotels & resorts |
| `GET` | `/api/weather/vizag` | Live temperature, tides & swimming safety flags |
| `GET` | `/api/itineraries` | Curated 1–4 day tours |
| `POST` | `/api/bookings` | Create hotel reservation |
| `GET` | `/api/bookings` | List user / admin bookings |
| `POST` | `/api/reviews` | Submit community review |
| `POST` | `/api/auth/login` | Login with JWT |
| `POST` | `/api/auth/register` | Register new tourist account |
| `GET` | `/api/admin/stats` | System KPI stats (Admin) |

---

© 2026 **VIZAG EXPLORER** — Crafted for Visakhapatnam & Andhra Pradesh Tourism.

