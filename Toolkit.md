# BeanBliss

BeanBliss is a modern e-commerce application built with a React frontend and a FastAPI Python backend. It features a fully functional shopping experience, including user authentication, product browsing, and payment processing.

## 🚀 Tech Stack & Libraries Used

### Frontend (Client)
The frontend is a single-page application built with React and Vite, focusing on performance and modern UI/UX design.

- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling for fast build times and hot module replacement.
- **[React](https://react.dev/)** (`^18.3.1`): A JavaScript library for building user interfaces.
- **[React Router DOM](https://reactrouter.com/)**: For declarative routing and navigation within the app.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI styling.
- **[GSAP](https://gsap.com/)**: A robust JavaScript animation library for creating high-performance animations and interactive UI elements.
- **[Lucide React](https://lucide.dev/)**: Beautiful and consistent icon set.
- **[Axios](https://axios-http.com/)**: Promise-based HTTP client for making API requests to the backend.
- **[React Hot Toast](https://react-hot-toast.com/)**: For elegant and customizable push notifications/toasts.
- **[Stripe React](https://stripe.com/docs/stripe-js/react)** (`@stripe/react-stripe-js` & `@stripe/stripe-js`): For securely handling payment elements and processing on the client side.

### Backend (Server)
The backend is a robust RESTful API built with Python, focusing on speed, type safety, and scalability.

- **[FastAPI](https://fastapi.tiangolo.com/)**: A modern, fast (high-performance) web framework for building APIs with Python based on standard Python type hints.
- **[SQLAlchemy](https://www.sqlalchemy.org/)** (`[asyncio]`): The Python SQL Toolkit and Object Relational Mapper for database interactions.
- **[aiomysql](https://github.com/aio-libs/aiomysql)**: Asynchronous MySQL driver for database connectivity.
- **[Pydantic](https://docs.pydantic.dev/)** & **pydantic-settings**: Data validation, serialization, and environment variable management using Python type hints.
- **[PyJWT](https://pyjwt.readthedocs.io/)**: For encoding and decoding JSON Web Tokens used for user authentication.
- **[bcrypt](https://github.com/pyca/bcrypt/)**: For secure password hashing and verification.
- **[python-multipart](https://github.com/Kludex/python-multipart)**: For parsing form data and handling file uploads.
- **[Stripe](https://stripe.com/docs/api/python)**: Official Stripe Python library for server-side payment processing and webhook handling.
- **[OpenAI](https://github.com/openai/openai-python)**: For integrating AI features (e.g., shopping assistant).
- **[Cloudinary](https://cloudinary.com/)**: For cloud-based image and asset management.

## 📂 Project Structure

- `/client`: Contains the Vite + React frontend application.
- `/server-python`: Contains the FastAPI backend application.

## 🛠️ How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MySQL Database

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd server-python
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows
   .venv\Scripts\activate
   # On macOS/Linux
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your `.env` file with the necessary database and API keys.
5. Start the server:
   ```bash
   fastapi dev main.py
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file.
4. Start the development server:
   ```bash
   npm run dev
   ```
