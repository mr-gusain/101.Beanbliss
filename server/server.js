import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = process.env.VERCEL === "1";
const uploadDir =
	isVercel ? path.join("/tmp", "uploads") : path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// CORS Config
const allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:5173",
	"https://1nonlystore-online-e-commerce-app.vercel.app",
	"https://1nonlystore-online-e-commerce-app.vercel.app/",
];

app.use(
	cors({
		origin: function (origin, callback) {
			if (
				!origin || 
				allowedOrigins.includes(origin) ||
				/^http:\/\/localhost:\d+$/.test(origin) ||
				/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
			) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	}),
);

app.use("/uploads", express.static(uploadDir));

const connectDB = async () => {
	try {
		if (mongoose.connection.readyState === 1) {
			return;
		}
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("MongoDB connected");
	} catch (error) {
		console.error("MongoDB connection error:", error);

		if (process.env.NODE_ENV !== "production") {
			process.exit(1);
		}
		throw error;
	}
};

app.use(async (req, res, next) => {
	try {
		await connectDB();
		next();
	} catch (error) {
		res.status(500).json({ message: "Database connection failed" });
	}
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/contact", contactRoutes);

app.get("/api/health", (req, res) => {
	res.json({ status: "OK", message: "Server is running" });
});

export default app;

if (!process.env.VERCEL) {
	const PORT = process.env.PORT || 5000;
	connectDB().then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	});
}
