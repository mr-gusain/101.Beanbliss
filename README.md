<p align="center">
  <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80" alt="BeanBliss Logo" width="120" style="border-radius: 50%;" />
</p>

<h1 align="center">☕ BeanBliss — Coffee With Me</h1>

<p align="center">
  <em>A premium coffee shop e-commerce experience, built with the MERN stack.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

---

## 🌟 Overview

**BeanBliss** is a full-featured, beautifully crafted coffee shop web application. Browse a curated menu of hot & cold drinks, pastries, light bites, and desserts — add to cart, checkout with Stripe, and track your orders. The app features a stunning animated UI, dark/light mode, an AI shopping assistant, and a complete admin dashboard.

> **Credited to:** Rashmi Prasad

---

## ✨ Features

### 🛒 Customer Experience
- **Beautiful Product Catalog** — Browse Hot Drinks, Cold Drinks, Pastries & Treats, Light Bites, and Desserts & Sweet Treats with rich imagery
- **Advanced Filtering & Search** — Filter by category, sort by price/rating/featured, and search by name
- **Shopping Cart** — Add, update quantities, and remove items with real-time backend sync
- **Stripe Checkout** — Secure payments via Stripe + Cash on Delivery option
- **Order Management** — Place orders, track status, and view full order history
- **User Profiles** — Manage account details, addresses, and preferences
- **Contact Form** — Reach out with questions or feedback

### 🤖 AI Assistant
- **Smart Chat Bot** — Powered by OpenAI (GPT-3.5 Turbo) with automatic offline fallback
- **Product Recommendations** — Context-aware suggestions based on your browsing and available inventory
- **FAQ Support** — Instant answers about shipping, returns, payments, and more

### 🎨 Design & UX
- **Dark / Light Mode** — Seamless theme toggle with system preference detection
- **GSAP Animations** — Smooth hero animations, scroll-triggered reveals, and micro-interactions
- **Responsive Design** — Fully optimized for desktop, tablet, and mobile
- **Modern UI** — Glassmorphism, gradient accents, and premium typography

### 🔐 Admin Dashboard
- **Analytics Dashboard** — Revenue, orders, users, and products at a glance
- **Product Management** — Create, update, and delete products with Cloudinary image uploads
- **Order Management** — View all orders, update statuses (Processing → Shipped → Delivered)
- **User Management** — View and manage registered users

---

## 🛠️ Tech Stack

| Layer        | Technologies                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, React Router 6, GSAP, Lucide React, Axios |
| **Backend**  | Node.js, Express 4, MongoDB + Mongoose 8, JWT Authentication, bcryptjs       |
| **Payments** | Stripe (React Stripe.js + Stripe SDK)                                        |
| **AI**       | OpenAI API (GPT-3.5 Turbo) with offline smart fallback                       |
| **Storage**  | Cloudinary (image uploads), Multer (file handling)                           |
| **Validation** | express-validator                                                          |
| **Deployment** | Vercel (Client SPA + Server Serverless), Docker support                    |

---

## 📁 Project Structure

```
BeanBliss/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Header, Footer, ThemeToggle, AIAssistant, BackToTop
│   │   │   └── products/       # ProductCard
│   │   ├── contexts/           # AuthContext, CartContext, ThemeContext
│   │   ├── pages/
│   │   │   ├── admin/          # AdminDashboard, AdminProducts, AdminOrders, AdminUsers
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── AccountPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── FAQsPage.jsx
│   │   │   └── ...
│   │   ├── services/           # API service layer (Axios)
│   │   └── utils/              # imageUtils, helpers
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Express Backend
│   ├── controllers/            # aiController, contactController
│   ├── middleware/              # auth, optionalAuth, uploadMiddleware
│   ├── models/                 # User, Product, Cart, Order, Contact
│   ├── routes/                 # auth, products, cart, orders, users, payment, ai, contact
│   ├── scripts/                # seedProducts, verifyProducts
│   └── server.js
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (or Docker — see below)
- **MongoDB** — Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Stripe Account** — [Get test API keys](https://dashboard.stripe.com/test/apikeys)

---

### 🐳 Docker Setup (Recommended)

Run the entire stack with a single command:

```bash
# 1. Create env file from template
cp .env.docker.example .env

# 2. Start all services (MongoDB + Server + Client)
docker-compose up -d --build
```

The app will be available at `http://localhost`.

| Command | Description |
|---------|-------------|
| `docker-compose logs -f` | View live logs |
| `docker-compose down` | Stop all services |
| `docker-compose down -v` | Stop and remove database volumes |

---

### 💻 Manual Setup

#### 1. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXX
OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXX          # Optional — AI assistant
CLOUDINARY_CLOUD_NAME=your_cloud_name            # Optional — image uploads
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Seed the database with sample menu items:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

> API runs at `http://localhost:5000`

#### 2. Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXX
```

Start the dev server:

```bash
npm run dev
```

> App runs at `http://localhost:5173`

---

## 📡 API Endpoints

### 🔑 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive JWT token |
| `GET` | `/api/auth/me` | Get current user (🔒 Auth) |

### ☕ Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products (with filters) |
| `GET` | `/api/products/:id` | Get product details |
| `POST` | `/api/products` | Create product (🔒 Admin) |
| `PUT` | `/api/products/:id` | Update product (🔒 Admin) |
| `DELETE` | `/api/products/:id` | Delete product (🔒 Admin) |

### 🛒 Cart (🔒 Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cart` | Get user's cart |
| `POST` | `/api/cart` | Add item to cart |
| `PUT` | `/api/cart/:itemId` | Update item quantity |
| `DELETE` | `/api/cart/:itemId` | Remove item from cart |
| `DELETE` | `/api/cart` | Clear entire cart |

### 📦 Orders (🔒 Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders` | Get user's order history |
| `GET` | `/api/orders/:id` | Get single order details |

### 👤 Users (🔒 Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/profile` | Get user profile |
| `PUT` | `/api/users/profile` | Update user profile |
| `POST` | `/api/users/addresses` | Add a new address |
| `PUT` | `/api/users/addresses/:id` | Update an address |
| `DELETE` | `/api/users/addresses/:id` | Delete an address |

### 💳 Payments (🔒 Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payment/create-payment-intent` | Create Stripe PaymentIntent |

### 🤖 AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/chat` | Chat with the AI assistant |

### 📧 Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contact` | Submit a contact form |

---

## 💳 Stripe Test Cards

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Payment succeeds |
| `4000 0000 0000 0002` | ❌ Payment declined |
| `4000 0025 0000 3155` | 🔐 3D Secure required |

> Use any future expiry date, any CVC, and any ZIP code.

---

## 🌐 Deployment (Vercel)

The project is deployed as **two separate Vercel apps**:

| App | Root Directory | Type |
|-----|----------------|------|
| **Client** | `client/` | Static SPA |
| **Server** | `server/` | Serverless Functions |

**Steps:**
1. Import the repo to Vercel for both client and server
2. Set the root directory for each
3. Add environment variables in the Vercel dashboard
4. Update `CORS` origins in `server.js` and `VITE_API_URL` in the client `.env`

---

## 📸 Menu Categories

| Category | Items | Price Range |
|----------|-------|-------------|
| ☕ Hot Drinks | Espresso, Latte, Cappuccino, Mocha, Matcha, Chai, Pour Over, Americano, London Fog, Macchiato | $3.50 – $5.75 |
| 🧊 Cold Drinks | Cold Brew, Iced Caramel Macchiato, Iced Latte, Nitro Cold Brew, Iced Matcha, Frappe, Iced Peach Tea, Sparkling Espresso | $3.95 – $5.95 |
| 🥐 Pastries & Treats | Butter Croissant, Almond Croissant, Blueberry Muffin, Chocolate Scone, Cinnamon Roll, Cheese Danish | $3.50 – $4.50 |
| 🍞 Light Bites | Avocado Toast, Bacon & Egg Sandwich, Bagel with Cream Cheese, Turkey & Swiss Panini, Spinach Feta Wrap | $3.95 – $8.50 |
| 🍰 Desserts & Sweet Treats | Tiramisu, Fudge Brownie, NY Cheesecake, Macarons, Lemon Tart | $3.50 – $6.50 |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  Made with ❤️ and ☕ by <strong>Gourav</strong>
</p>
