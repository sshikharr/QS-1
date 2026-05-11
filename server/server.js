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
app.use(cors());
// DEBUG LOGGING MIDDLEWARE
app.use((req, res, next) => {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`\n--- [CORS DEBUG START | ID: ${requestId}] ---`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Origin: ${req.headers.origin || 'NONE'}`);
    console.log(`DB State: ${mongoose.connection.readyState}`);

    const originalSend = res.send;
    res.send = function (body) {
        console.log(`[CORS DEBUG END | ID: ${requestId}] Status: ${res.statusCode}`);
        console.log(`[CORS DEBUG END | ID: ${requestId}] Access-Control-Allow-Origin: ${res.get('Access-Control-Allow-Origin')}`);
        console.log(`--- [CORS DEBUG END | ID: ${requestId}] ---\n`);
        return originalSend.apply(res, arguments);
    };

    res.on('close', () => {
        console.log(`[CORS DEBUG CLOSE | ID: ${requestId}] Connection closed prematurely.`);
    });

    next();
});

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
