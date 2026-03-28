# ShopApp — Full-Stack E-Commerce

A production-ready online shopping application built with React, Node.js, and MongoDB.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, React Router v6, Axios    |
| Backend   | Node.js, Express 4, JWT Auth        |
| Database  | MongoDB 7 (Mongoose ODM)            |
| Container | Docker, Docker Compose, Nginx       |

---

## Features

- Browse and search products with category filtering
- Product detail pages with quantity selector
- JWT-based user authentication (register / login)
- Add to cart, update quantity, remove items
- Place orders with shipping address
- Order history page per user
- Admin-protected product CRUD endpoints
- Seed script for sample product data
- Nginx reverse proxy for production serving

---

## Project Structure

```
shopapp/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   ├── .env.example
│   ├── config/
│   │   ├── db.js
│   │   └── seed.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   └── routes/
│       ├── authRoutes.js
│       ├── productRoutes.js
│       ├── cartRoutes.js
│       └── orderRoutes.js
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── .env.example
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css
        ├── context/
        │   ├── AuthContext.js
        │   └── CartContext.js
        ├── utils/
        │   └── api.js
        ├── components/
        │   ├── Navbar.js
        │   └── ProductCard.js
        └── pages/
            ├── Home.js
            ├── ProductDetail.js
            ├── Cart.js
            ├── Orders.js
            └── Auth.js
```

---

## Option 1 — Run with Docker (Recommended)

### Prerequisites
- Docker Desktop (or Docker Engine + Docker Compose)

### Steps

```bash
# 1. Clone / unzip the project
cd shopapp

# 2. Start all services
docker compose up --build

# 3. Seed sample products (in a new terminal, after services are up)
docker exec shopapp_backend node config/seed.js

# 4. Open the app
# Frontend → http://localhost:3000
# Backend API → http://localhost:5000/api
```

### Stop services
```bash
docker compose down           # stop containers
docker compose down -v        # stop + delete MongoDB data volume
```

---

## Option 2 — Run Locally (without Docker)

### Prerequisites
- Node.js 18+
- MongoDB running locally (default: `mongodb://localhost:27017`)

### Backend setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values (MONGO_URI, JWT_SECRET)

# Start the server (development mode with auto-reload)
npm run dev

# Seed sample products
npm run seed
```

Backend runs at: `http://localhost:5000`

### Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api

# Start the dev server
npm start
```

Frontend runs at: `http://localhost:3000`

---

## API Reference

### Auth
| Method | Endpoint             | Body                          | Auth |
|--------|----------------------|-------------------------------|------|
| POST   | /api/auth/register   | `name, email, password`       | —    |
| POST   | /api/auth/login      | `email, password`             | —    |

### Products
| Method | Endpoint             | Query / Body                  | Auth  |
|--------|----------------------|-------------------------------|-------|
| GET    | /api/products        | `?q=&category=&page=&limit=`  | —     |
| GET    | /api/products/:id    | —                             | —     |
| POST   | /api/products        | product fields                | Admin |
| PUT    | /api/products/:id    | product fields                | Admin |
| DELETE | /api/products/:id    | —                             | Admin |

### Cart (in-memory, per session)
| Method | Endpoint             | Body                          | Auth |
|--------|----------------------|-------------------------------|------|
| GET    | /api/cart            | —                             | Yes  |
| POST   | /api/cart/add        | `productId, qty`              | Yes  |
| PUT    | /api/cart/:productId | `qty`                         | Yes  |
| DELETE | /api/cart/:productId | —                             | Yes  |
| DELETE | /api/cart            | —                             | Yes  |

### Orders
| Method | Endpoint              | Body                          | Auth  |
|--------|-----------------------|-------------------------------|-------|
| POST   | /api/orders           | `items, address`              | Yes   |
| GET    | /api/orders/mine      | —                             | Yes   |
| GET    | /api/orders           | —                             | Admin |
| PUT    | /api/orders/:id/status| `status`                      | Admin |

---

## Creating an Admin User

Register normally, then update the user's role in MongoDB:

```bash
# Open MongoDB shell
docker exec -it shopapp_mongo mongosh -u admin -p secret

use shopapp
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

---

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopapp
JWT_SECRET=your_random_secret_here
NODE_ENV=development
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Sample Product Categories

The seed script adds 8 products across:
- Electronics (Headphones, Bluetooth Speaker)
- Sports (Running Shoes, Yoga Mat)
- Kitchen (Coffee Maker)
- Accessories (Wallet, Sunglasses)
- Home (Desk Lamp)
