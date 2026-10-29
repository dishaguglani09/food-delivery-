# CASA TÒPAZ — Backend API Service

Haute Gastronomie & Tapas d'Auteur REST API powered by **Express.js** and **MongoDB (Mongoose)**.

---

## 🏛️ Architecture Overview

- **Framework**: Express 5 on Node.js
- **Database**: MongoDB Atlas / Local MongoDB via Mongoose 9
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **CORS**: Configured for Vite frontend (`http://localhost:5173`)
- **Resilience**: Centralized error handling, request validation, and graceful database diagnostics

---

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory by copying `.env.example`:

```bash
cp .env.example .env
```

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `PORT` | No | Port on which the API listens (defaults to `5000`) | `5000` |
| `MONGODB_URI` | **Yes** | MongoDB Atlas or local connection string | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/casa_topaz?retryWrites=true&w=majority` |
| `JWT_SECRET` | **Yes** | Secret key for signing customer and admin tokens | `your_secret_jwt_key_here` |
| `CLIENT_URL` | No | Frontend URL for CORS whitelisting | `http://localhost:5173` |
| `NODE_ENV` | No | Environment mode (`development` or `production`) | `development` |

---

## 🍃 MongoDB Atlas Setup Guide

To connect the application to MongoDB Atlas:

1. **Sign Up / Log In**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account.
2. **Create a Free Cluster**: Choose the shared free tier (M0) and select your preferred region.
3. **Configure Database Access**:
   - In Atlas, navigate to **Security** → **Database Access**.
   - Click **Add New Database User**.
   - Choose **Password Authentication**, enter a username (e.g. `topaz_admin`) and a secure password.
   - Assign the user the **Read and write to any database** privilege.
4. **Configure Network Access**:
   - Navigate to **Security** → **Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`) for development or add your current IP address.
5. **Copy the Connection String**:
   - In your cluster overview, click **Connect** → **Drivers**.
   - Select **Node.js** and copy the URI format:
     ```
     mongodb+srv://<username>:<password>@cluster0.mongodb.net/casa_topaz?retryWrites=true&w=majority
     ```
   - Paste it into `server/.env` replacing `<username>` and `<password>` with your database user credentials.

---

## 🚀 Server Startup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Run in Development Mode (Nodemon auto-reload)
```bash
npm run dev
```

### 3. Run in Production Mode
```bash
npm start
```

The server starts on `http://localhost:5000`. You can verify operational status at:
```
GET http://localhost:5000/api/health
```

---

## 🍽️ Database Seeding Scripts

### 1. Seed Menu Items (`seedFoods.js`)
Populates the database with 15 signature gourmet tapas, cazuelas, bellota charcuterie, and curated wines with valid high-resolution food imagery:

```bash
npm run seed
```

### 2. Create Administrator & Demo Customer (`createAdmin.js`)
Creates the default Head Chef administrator and demo gourmet club member:

```bash
npm run create-admin
```

**Created Accounts:**
- **Admin**: `admin@casatopaz.ch` / `AdminPassword2026!`
- **Customer**: `elena.rostova@gastronomie.ch` / `Customer2026!`

---

## 📋 REST API Endpoints

### 🩺 System & Health
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api` | Public | API discovery and documentation |
| `GET` | `/api/health` | Public | Real-time healthcheck and database connection status |

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/profile` | Private | Retrieve current user profile & addresses |
| `PUT` | `/api/auth/profile` | Private | Update user details or password |
| `POST` | `/api/auth/addresses` | Private | Add delivery address |
| `PUT` | `/api/auth/addresses/:id`| Private | Update existing address |
| `DELETE` | `/api/auth/addresses/:id`| Private | Delete delivery address |

### 🍲 Food Catalog (`/api/foods`)
| Method | Endpoint | Query Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/foods` | `page`, `limit`, `category`, `vegetarian`, `search`, `sort`, `dietary` | Paginated food list with filtering and search |
| `GET` | `/api/foods/featured`| None | Featured and chef special dishes |
| `GET` | `/api/foods/categories`| None | List of categories with item counts |
| `GET` | `/api/foods/:id` | None | Single dish detail by ID |

**Food Query Parameters Supported:**
- `page`: Page number (default: `1`)
- `limit`: Items per page (default: `12`, or `all`)
- `category`: Category name (`Pinchos & Tapas`, `Cazuelas & Plats Chauds`, etc.)
- `vegetarian`: Boolean (`true` to filter vegetarian items)
- `search`: Keyword matching across dish title, Spanish name, description, and ingredients
- `sort`: `price-asc`, `price-desc`, `rating`, `name`

### 🛒 Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/orders` | Optional/Private | Place a new order with product and address snapshots |
| `GET` | `/api/orders/my-orders` | Private | Retrieve customer order history |
| `GET` | `/api/orders/:id` | Private | Retrieve single order details & tracking status |
| `PUT` | `/api/orders/:id/cancel`| Private | Cancel order (if still in Confirmed stage) |

### 👑 Administration (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/admin/stats` | Admin | Revenue aggregates, order counts, active dishes |
| `GET` | `/api/admin/orders` | Admin | List all orders with pagination & status filters |
| `PUT` | `/api/admin/orders/:id/status` | Admin | Advance order lifecycle (Confirmed → Preparing → Dispatched → Delivered) |
| `POST` | `/api/admin/foods` | Admin | Create a new menu dish |
| `PUT` | `/api/admin/foods/:id` | Admin | Update dish details |
| `DELETE` | `/api/admin/foods/:id` | Admin | Remove dish from menu |
| `GET` | `/api/admin/users` | Admin | List all registered customers |

---

## 🛡️ Data Snapshot Guarantees

- **Food Records**: Includes `name`, `description`, `price`, `image`, `category`, `isVegetarian`, `isAvailable`, and `isFeatured`.
- **Order Records**: Freezes product name and unit-price snapshots at checkout, delivery address snapshot, subtotal, delivery fee, packaging fee, total, payment method, payment status, order status, and timestamps.

