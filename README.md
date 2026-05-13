# BeanBliss ☕

BeanBliss is a premium, modern e-commerce application for coffee lovers. It features a stunning React frontend and a powerful FastAPI backend, providing a seamless shopping experience from browsing to secure checkout.

**Live Demo:** [https://beanbliss-frontend.vercel.app/](https://beanbliss-frontend.vercel.app/)

---

## 📂 Project Structure

- **`/client`**: React + Vite frontend application.
- **`/server-python`**: FastAPI (Python) backend application.

---

## 🛠️ How to Run Locally

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **MySQL** (Local instance or cloud-hosted)

### 1. Backend Setup (FastAPI)
1. Navigate to the backend directory:
   ```bash
   cd server-python
   ```
2. Create and activate a virtual environment:
   ```bash
   # Create venv
   python -m venv venv
   
   # Activate (Windows)
   venv\Scripts\activate
   
   # Activate (macOS/Linux)
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   - Create a `.env` file based on `.env.example` (if available) or existing configurations.
5. Start the development server:
   ```bash
   python main.py
   # OR
   uvicorn main:app --reload
   ```

### 2. Frontend Setup (React)
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file with `VITE_API_URL=http://localhost:8000` (or your backend URL).
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **Icons**: Lucide React
- **Payments**: Stripe React

### Backend
- **Framework**: FastAPI
- **ORM**: SQLAlchemy (Async)
- **Database**: MySQL
- **Auth**: JWT & Bcrypt
- **Payments**: Stripe API

---

## 📄 License
This project is for educational purposes. All rights reserved.
