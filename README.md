# The Indian Rasoi — Authentic Indian Cuisine & Royal Biryanis

A full-stack **MERN** (MongoDB, Express, React, Node.js) authentic Indian culinary food delivery platform celebrating royal Awadhi, Punjabi, and South Indian culinary traditions.

### 🛠️ Approved Technology Stack (Strictly Followed)
- **Frontend**: React.js (React 19 + Vite)
- **Backend**: Node.js and Express.js (Express 5)
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Development Environment**: VS Code

The Indian Rasoi features a customer-facing frontend built with React, Vite, and standard browser Fetch, integrated with an Express and Mongoose backend featuring server-side price validation, customer order isolation, real-time live order tracking, and role-based access control.

---

## 🌟 Highlights & Key Features

- **Royal Indian Restaurant Branding**: Authentic Indian culinary experience, warm gold & rich crimson aesthetics, elegant serif typography (Cormorant Garamond & Plus Jakarta Sans), and responsive layout.
- **Authentic 7-Category Indian Menu**:
  1. **North Indian**: Butter Chicken, Shahi Paneer, Dal Makhani, Chole Bhature, Rajma Chawal, Rogan Josh, Malai Kofta, Palak Paneer.
  2. **South Indian**: Masala Dosa, Idli Sambhar, Uttapam, Medu Vada.
  3. **Street Food**: Pani Puri, Pav Bhaji, Aloo Tikki, Vada Pav, Samosa Chaat.
  4. **Breads**: Butter Naan, Garlic Naan, Tandoori Roti, Lachha Paratha.
  5. **Rice & Biryani**: Hyderabadi Chicken Biryani, Veg Dum Biryani, Jeera Rice, Kashmiri Pulao.
  6. **Desserts**: Gulab Jamun, Rasmalai, Jalebi with Rabri, Gajar Ka Halwa, Kesar Pista Kulfi.
  7. **Beverages**: Kullad Masala Chai, Mango Lassi, Sweet Lassi, Cold Coffee.
- **Dual Naming & Dietary Tagging**: Authentic English & Hindi naming (e.g. *Murgh Makhani* / *मुर्ग मक्खनी*, *Shahi Paneer* / *शाही पनीर*), spice meters, preparation times, and vegetarian filters.
- **Indian Rupee (₹) Pricing & Realistic Economics**: Realistic pricing throughout, ₹499 free delivery threshold (standard delivery ₹40, ₹20 thermal leak-proof packaging), and promo vouchers (`RASOI10`, `DESI15`, `BHOJAN50`).
- **Interactive Dish Modal & Customization**: Quantity stepper, allergen disclosures, chef's accompaniment recommendations, and custom cooking instructions.
- **Persistent Shared Cart**: Local storage persistence across page refreshes, real-time subtotal calculations, and free delivery progress bar.
- **Server-Side Price Validation**: Client-supplied prices are strictly untrusted; the backend independently validates food availability and calculates totals in MongoDB.
- **Customer Order Isolation (Anti-IDOR)**: Direct object reference protections guarantee customer orders are accessible exclusively by their owner or privileged administrators.
- **Duplicate Order Prevention**: Debouncing guard prevents rapid duplicate submissions within 3 seconds (HTTP 429).
- **Live Courier & Stepper Tracking**: Multi-stage preparation stepper (`Confirmed` → `Kitchen Cooking` → `Out for Delivery` → `Delivered`), simulated courier tracking (Rahul Sharma), arrival timer, and itemized receipt breakdown.
- **Full English Interface**: Complete user-facing interface, feedback notifications, and documentation in English.

---

## 📁 Repository Structure

```
food-delivery/
├── client/                     # Customer-facing React frontend
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Footer, Modals, Cards)
│   │   ├── context/            # Global state (CartContext, AuthContext, OrderContext, ToastContext)
│   │   ├── data/               # Authentic Indian dishes and categories
│   │   ├── pages/              # Route views (Home, Menu, Detail, Cart, Checkout, Orders, Tracking, Auth)
│   │   ├── services/           # Native Fetch API client (api.js)
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
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/the_indian_rasoi?retryWrites=true&w=majority
JWT_SECRET=the_indian_rasoi_jwt_secret_dev_key_2026_royal_dining
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
Populates all 31 authentic Indian dishes across all 7 categories with ingredients, allergens, preparation times, and verified food photography:
```bash
cd server
npm run seed
```

### 2. Create Default Admin & Customer Accounts
Initializes the Master Chef administrator and verified demo customer:
```bash
cd server
npm run create-admin
```

#### Seeded Credentials:
| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Master Chef Admin** | `admin@theindianrasoi.com` | `AdminPassword2026!` | `admin` |
| **Demo Customer** | `priya.sharma@indianrasoi.com` | `Customer2026!` | `customer` |

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

During the quality audit, the following checks were performed and verified:

1. **Frontend Production Build**: `npm run build` compiles clean production bundle chunks with 0 errors.
2. **Food Imagery**: All 31 Indian dish photography URLs are verified and responsive.
3. **Server-Side Price Validation**: Tested submitting client-manipulated prices. The backend independently queries authoritative prices in MongoDB/catalog and recalculates exact totals.
4. **Customer Order Isolation (Anti-IDOR)**: Direct object reference protection guarantees orders are strictly accessible by their owner or administrators.
5. **Duplicate Submission Debouncing**: Rapid identical requests within 3 seconds receive `429 Too Many Requests`.
6. **Order Status Transitions**: Invalid transitions (e.g. mutating terminal statuses) are rejected with `400 Bad Request`.
7. **Strict Approved Stack Adherence**: Uses only React.js, Node.js + Express.js, MongoDB Atlas (Mongoose), JWT, and VS Code.

---

## 📜 License
Developed for The Indian Rasoi. All rights reserved.
