import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json({ limit: "5mb" }));

// Root route
app.get("/", (req, res) => {
    res.json({
        success: true,
        name: "Pathway Healthcare API",
        status: "Online",
        version: "1.0.0"
    });
});

// Mounted APIs
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);

// Backend health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Pathway Backend is running!",
        status: "Online"
    });
});

// Database health check
app.get("/api/db-health", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT DATABASE() AS database_name, NOW() AS server_time"
        );

        res.json({
            success: true,
            database: rows[0].database_name,
            serverTime: rows[0].server_time
        });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Database connection failed."
        });
    }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        const connection = await pool.getConnection();
        console.log("MySQL Database connected successfully!");
        connection.release();

        app.listen(PORT, () => {
            console.log(`Pathway Backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MySQL:", error.message);
        process.exit(1);
    }
}

startServer();
