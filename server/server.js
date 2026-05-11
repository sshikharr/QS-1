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

// Initialize Cloudinary
connectCloudinary();

const app = express();

app.use(async (req, res, next) => {
    console.log(`>>> [${new Date().toISOString()}] REQUEST START: ${req.method} ${req.url}`);
    try {
        await connectDB();
        console.log(`>>> [${new Date().toISOString()}] DB READY, PROCEEDING...`);
        next();
    } catch (error) {
        console.error(`>>> [${new Date().toISOString()}] DB FAILURE:`, error.message);
        res.status(500).json({
            success: false,
            message: "Database connection failed.",
            error: error.message
        });
    }
});

app.get("/api/debug", (req, res) => {
    res.json({
        success: true,
        message: "Debug route is working",
        dbState: mongoose.connection.readyState,
        nodeVersion: process.version,
        env: process.env.NODE_ENV
    });
});

// 1. MUST BE FIRST: Handle CORS and OPTIONS preflight
app.use(cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*"
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
