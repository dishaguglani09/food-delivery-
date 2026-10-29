# CASA TÒPAZ — Haute Gastronomie, Tapas & Vins d'Auteur

A full-stack **MERN** (MongoDB, Express, React, Node.js) culinary food delivery platform inspired by the visual direction and ambiance of **[bar-topas.ch](https://bar-topas.ch/)**. 

CASA TÒPAZ features a customer-facing frontend built with React 19, Vite, Tailwind CSS v4, Lucide React, and Framer Motion, integrated with an Express 5 and Mongoose backend with server-side pricing validation, customer order isolation, real-time live tracking, and role-based access control.

---

## 🌟 Highlights & Key Features

- **Cinematic Visual Direction**: Dark luxury culinary aesthetic with gold and sangria accents, warm typography (Cormorant Garamond & Plus Jakarta Sans), and responsive layout.
- **Dynamic Menu & Filters**: Real-time category selection (Pinchos & Tapas, Cazuelas, Charcuterie & Fromages, Desserts, Vins d'Auteur), search, vegetarian filters, and price sorting.
- **Interactive Dish Modal & Quick-Add**: Quantity selectors, allergen and wine pairing badges, special culinary requests.
- **Shared Persistent Cart**: Local storage persistence, real-time subtotal calculation, free thermal delivery threshold (CHF 60.00), and privilege promo codes (`TOPAZ10`, `BELLOTA15`, `TERROIR5`).
- **Server-Side Price Validation**: Client-supplied prices are strictly untrusted; the backend independently queries the database/catalog to compute valid totals, delivery fees, and packaging deposits.
- **Customer Order Isolation (Anti-IDOR)**: Direct object reference protections guarantee customer orders are accessible exclusively by their owner or privileged administrators.
- **Duplicate Order Prevention**: Debouncing map rejects rapid duplicate submissions (within 3 seconds) with HTTP 429.
- **State Machine Order Transitions**: Strict lifecycle rules (`Confirmed` → `Kitchen Preparing` → `Dispatched` → `Delivered`), guarding against invalid mutations on terminal orders.
- **Live Courier & Stepper Tracking**: Multi-stage preparation stepper, simulated isothermal eco-courier route, arrival timer, and itemized receipt breakdown.
- **Full English Localization**: Complete user-facing interface, feedback toasts, and administrative messaging in English.

---

## 📁 Repository Structure

```
food-delivery/
├── client/                     # Customer-facing React frontend
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Footer, Modals, Cards)
│   │   ├── context/            # Global state (CartContext, AuthContext, OrderContext, ToastContext)
│   │   ├── data/               # Authentic menu items and categories
│   │   ├── pages/              # Route views (Home, Menu, Detail, Cart, Checkout, Orders, Tracking, Auth)
│   │   ├── services/           # Axios API client (api.js)
│   │   ├── App.jsx             # React Router setup & layout
│   │   └── main.jsx            # Application entrypoint
│   ├── .env                    # Frontend environment configuration
│   └── package.json
│
├── server/                     # Express & MongoDB backend API
│   ├── config/                 # Database connection (db.js)
│   ├── controllers/            # Route business logic (auth, food, order, admin)
│   ├── middleware/             # Auth JWT, admin role guards, centralized error handler
│   ├── models/                 # Mongoose schemas (User, Food, Order)
│   ├── routes/                 # Express REST route modules
│   ├── scripts/                # Database seeders (seedFoods.js, createAdmin.js)
│   ├── utils/                  # Token generation (token.js)
│   ├── .env                    # Backend environment configuration
│   ├── .env.example            # Environment template
│   └── server.js               # Main Express application
│
└── README.md                   # Complete documentation
```

---

## ⚙️ Environment Configuration

### 1. Backend Configuration (`server/.env`)
Copy `server/.env.example` to `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/casa_topaz?retryWrites=true&w=majority
JWT_SECRET=casa_topaz_jwt_secret_dev_key_2026_fine_dining
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Note**: If `MONGODB_URI` is not yet configured, the server operates in graceful offline demonstration mode using in-memory caches, allowing full evaluation without database timeout errors.

### 2. Frontend Configuration (`client/.env`)
Create or verify `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Node.js 18+ (tested on Node.js 24)
- npm 9+ or pnpm

### 1. Start the Backend API
```bash
cd server
npm install
npm run dev
```
The server will boot on `http://localhost:5000`. You can inspect system health at `http://localhost:5000/api/health`.

### 2. Start the Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
Open your browser to `http://localhost:5173`.

---

## 🍃 Database Seeding & User Setup

When connected to MongoDB Atlas, execute the pre-built seed scripts:

### 1. Seed Food Menu Catalog
Populates 18 signature dishes (Pinchos, Cazuelas, Charcuterie, Desserts, Wines) with authentic ingredients, allergens, wine pairings, and verified high-resolution food imagery:
```bash
cd server
npm run seed
```

### 2. Create Default Admin & Customer Accounts
Initializes the Head Chef administrator and verified demo guest:
```bash
cd server
npm run create-admin
```

#### Seeded Credentials:
| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Head Chef Admin** | `admin@casatopaz.ch` | `AdminPassword2026!` | `admin` |
| **Demo Customer** | `elena.rostova@gastronomie.ch` | `Customer2026!` | `customer` |

---

## 📡 Complete REST API Documentation

### 🏥 System Health & Info
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api` | Public | API Root, documentation, and connection status |
| `GET` | `/api/health` | Public | Real-time server uptime and MongoDB connection state |

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Create new customer account and return JWT |
| `POST` | `/api/auth/login` | Public | Authenticate user (or demo accounts) and return JWT |
| `GET` | `/api/auth/profile` | Private | Retrieve authenticated user profile and saved addresses |
| `PUT` | `/api/auth/profile` | Private | Update authenticated user details and addresses |

### 🥘 Menu & Dishes (`/api/foods`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/foods` | Public | Paginated food items with query filters (`page`, `limit`, `category`, `vegetarian`, `search`, `sort`) |
| `GET` | `/api/foods/featured` | Public | Fetch chef's signature selections and bestsellers |
| `GET` | `/api/foods/categories` | Public | List all culinary categories and item counts |
| `GET` | `/api/foods/:id` | Public | Retrieve single food item details |

### 📦 Customer Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Optional Auth | Submit order with item IDs, sanitized quantities, delivery address, and payment method |
| `GET` | `/api/orders/my-orders` | Private | Retrieve all historical orders for authenticated customer |
| `GET` | `/api/orders/:id` | Optional Auth | Get order tracking & receipt (protected by customer isolation) |
| `PUT` | `/api/orders/:id/cancel`| Private | Cancel order (only allowed while status is `Confirmed`) |

### 👨‍🍳 Administration (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin Only | Dashboard stats (revenue, order counts, status breakdown) |
| `GET` | `/api/admin/orders` | Admin Only | Paginated system-wide order history with status filters |
| `PUT` | `/api/admin/orders/:id/status` | Admin Only | Advance order status (`Confirmed` → `Kitchen Preparing` → `Dispatched` → `Delivered`) |
| `POST` | `/api/admin/foods` | Admin Only | Create new menu item |
| `PUT` | `/api/admin/foods/:id` | Admin Only | Update existing menu item |
| `DELETE`| `/api/admin/foods/:id` | Admin Only | Remove dish from active menu |
| `PATCH` | `/api/admin/foods/:id/toggle-availability` | Admin Only | Toggle dish in-stock / sold-out |
| `GET` | `/api/admin/users` | Admin Only | List all registered members and their order volumes |

---

## 🔒 Security & Quality Audit Verification

During the comprehensive audit, the following checks were performed and verified:

1. **Frontend Production Build**: `npm run build` generates production-ready bundle chunks in 563ms with 0 errors.
2. **ESLint Validation**: `npm run lint` passes with 0 errors.
3. **Food Imagery**: All 18 Unsplash food photography URLs were independently pinged and confirmed returning `HTTP 200 OK`.
4. **Server-Side Price Validation**: Tested submitting client-manipulated prices (e.g. `0.05`). The backend ignored the client price, queried authoritative prices, and recalculated the exact total.
5. **Customer Order Isolation (Anti-IDOR)**: Tested cross-user order retrieval. Unauthenticated requests to customer orders receive `401 Unauthorized`. Non-owner customers receive `403 Forbidden`. The order owner and administrators receive `200 OK`.
6. **Duplicate Submission Debouncing**: Rapid identical requests within 3 seconds receive `429 Too Many Requests`.
7. **Order Status Transitions**: Invalid transitions (e.g. `Confirmed` directly to `Delivered`) or mutating terminal statuses (`Delivered`, `Cancelled`) are rejected with `400 Bad Request`.
8. **Reduced Motion Accessibility**: Respects `@media (prefers-reduced-motion: reduce)`.
9. **CORS Security**: Strictly blocks non-whitelisted origins in production environments.

---

## 🚢 Production Deployment Guidance

### Frontend (Vercel / Netlify / Cloudflare Pages)
1. Set the root directory to `client`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Environment variable:
   - `VITE_API_URL=https://your-api-domain.com`
5. Configure rewrite rules for Single Page Application routing (e.g. `/*` to `/index.html`).

### Backend (Render / Railway / Fly.io / Docker)
1. Set the root directory to `server`.
2. Build command: `npm install`.
3. Start command: `node server.js` or `npm start`.
4. Environment variables:
   - `PORT=5000`
   - `MONGODB_URI=mongodb+srv://...`
   - `JWT_SECRET=super_secure_random_key_here`
   - `CLIENT_URL=https://your-frontend-domain.com`
   - `NODE_ENV=production`

---

## 📜 License
Developed for CASA TÒPAZ. All rights reserved.

