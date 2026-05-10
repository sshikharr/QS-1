import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import connectCloudinary from "./configs/cloudinary.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

// Initialize DB connection
connectDB();
connectCloudinary();

const app = express();

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState === 2) {
        // If connecting, wait for it to finish
        console.log("DB is connecting, waiting...");
        await new Promise((resolve) => {
            const timer = setTimeout(resolve, 5000); // 5s max wait
            mongoose.connection.once('connected', () => {
                clearTimeout(timer);
                resolve();
            });
        });
    }
    next();
});

// 1. MUST BE FIRST: Handle CORS and OPTIONS preflight
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://qs-1-bkdevh9zt-shikhar-dwivedis-projects.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Stripe Webhook (needs raw body, MUST be before express.json)
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// 3. Regular middleware
app.use(express.json());
app.use(clerkMiddleware());

// API to listen to Clerk Webhooks
app.use("/api/clerk", clerkWebhooks);

app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
