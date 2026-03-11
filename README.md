# RohanjStore — MERN E-Commerce

A full-featured e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

**Live Demo:** [https://e-commerce-mern-major-project.vercel.app](https://e-commerce-mern-major-project.vercel.app)

## Features

- **Product browsing** with category filters, search, and detailed product pages
- **Shopping cart** with add/update/remove items, synced with backend
- **Payments** via Stripe integration + Cash on Delivery option
- **User authentication** (JWT-based) with register, login, and protected routes
- **Order management** — create orders, view order history
- **User profiles** — manage addresses and account settings
- **Admin panel** — dashboard with analytics, manage products/orders/users
- **Responsive UI** with Tailwind CSS, GSAP animations, and hero slider
- **Deployed** on Vercel (client as SPA, server as serverless functions)

## Tech Stack

**Frontend:** React 18, Vite 5, Tailwind CSS 3, React Router 6, GSAP, Lucide React, Stripe React

**Backend:** Node.js, Express 4, MongoDB + Mongoose 8, JWT, bcryptjs, Stripe SDK, express-validator, Multer

## Getting Started

### Prerequisites

- Node.js v18+ (or Docker — see below)
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- Stripe account for payments ([Test API keys](https://dashboard.stripe.com/test/apikeys))

### Docker Setup

The project can be run entirely through Docker if you don't want to install Node.js and MongoDB locally.

```bash
# 1. Setup env file
cp .env.docker.example .env

# 2. Start services
docker-compose up -d --build
```

The app will be available at `http://localhost`.

**Other commands:**

- `docker-compose logs -f` (View logs)
- `docker-compose down` (Stop services)
- `docker-compose down -v` (Stop and delete database volumes)

### Manual Setup (Without Docker)

#### Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXX
```

Optionally seed sample products:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

#### Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXX
```

Start the dev server:

```bash
npm run dev
```

App runs at `http://localhost:5173`.

## API Endpoints

### Auth

- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user (auth required)

### Products

- `GET /api/products` — List all
- `GET /api/products/:id` — Get one
- `POST /api/products` — Create (admin)
- `PUT /api/products/:id` — Update (admin)
- `DELETE /api/products/:id` — Delete (admin)

### Cart (auth required)

- `GET /api/cart` — Get cart
- `POST /api/cart` — Add item
- `PUT /api/cart/:itemId` — Update quantity
- `DELETE /api/cart/:itemId` — Remove item
- `DELETE /api/cart` — Clear cart

### Orders (auth required)

- `POST /api/orders` — Create order
- `GET /api/orders` — User's orders
- `GET /api/orders/:id` — Single order

### Users (auth required)

- `GET /api/users/profile` — Get profile
- `PUT /api/users/profile` — Update profile
- `POST /api/users/addresses` — Add address
- `PUT /api/users/addresses/:id` — Update address
- `DELETE /api/users/addresses/:id` — Delete address

### Payments (auth required)

- `POST /api/payment/create-payment-intent` — Create Stripe PaymentIntent

## Deployment (Vercel)

The project is deployed as two separate Vercel apps:

- **Client** — Static SPA, root directory set to `client`
- **Server** — Serverless functions, root directory set to `server`

Add environment variables in the Vercel dashboard for each. Update CORS origin in `server.js` and `VITE_API_URL` in the client env to match your deployment URLs.

## Stripe Test Cards

| Card                  | Result             |
| --------------------- | ------------------ |
| `4242 4242 4242 4242` | Success            |
| `4000 0000 0000 0002` | Declined           |
| `4000 0025 0000 3155` | 3D Secure required |

Use any future expiry, any CVC, any ZIP.

## License

MIT
