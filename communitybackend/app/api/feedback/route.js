import express from "express";
import mysql from "mysql2";
import { z } from "zod";

const router = express.Router();

// ✅ MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "BunnyPromax25", // Change this to your actual password
    database: "farmers_community"
});

db.connect((err) => {
    if (err) {
        console.error("❌ MySQL Connection Error:", err);
    } else {
        console.log("✅ Connected to MySQL for Feedback System");
    }
});

// ✅ Create Table if Not Exists
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        feedbackType ENUM('general', 'product', 'delivery', 'website', 'suggestion') NOT NULL,
        comment TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

db.query(createTableQuery, (err) => {
    if (err) console.error("❌ Error creating feedback table:", err);
    else console.log("✅ Feedback table ready!");
});

// ✅ Zod Validation Schema
const feedbackSchema = z.object({
    userId: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    rating: z.number().min(1).max(5),
    feedbackType: z.enum(["general", "product", "delivery", "website", "suggestion"]),
    comment: z.string().min(1, "Feedback comment is required"),
});

// ✅ Submit Feedback API
router.post("/", async (req, res) => {
    try {
        // Validate the request body
        const validatedData = feedbackSchema.parse(req.body);

        const sql = `INSERT INTO feedback (userId, name, email, rating, feedbackType, comment) 
                     VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(
            sql,
            [
                validatedData.userId || null,
                validatedData.name,
                validatedData.email,
                validatedData.rating,
                validatedData.feedbackType,
                validatedData.comment,
            ],
            (err, result) => {
                if (err) {
                    console.error("❌ Error saving feedback: ", err);
                    return res.status(500).json({ success: false, message: "Database error while submitting feedback." });
                }
                res.status(201).json({ success: true, message: "Feedback submitted successfully!" });
            }
        );
    } catch (error) {
        console.error("❌ Error submitting feedback:", error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }

        res.status(500).json({ success: false, message: "Failed to submit feedback" });
    }
});

// ✅ Get Feedback API
router.get("/", async (req, res) => {
    try {
        const { page = 1, type = "all" } = req.query;
        const limit = 5;
        const offset = (page - 1) * limit;

        let query = `SELECT id, name, rating, feedbackType, comment, createdAt FROM feedback`;
        const params = [];

        if (type !== "all") {
            query += ` WHERE feedbackType = ?`;
            params.push(type);
        }

        query += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("❌ Error fetching feedback: ", err);
                return res.status(500).json({ success: false, message: "Database error while fetching feedback." });
            }
            res.json({ feedbacks: results, hasMore: results.length === limit });
        });
    } catch (error) {
        console.error("❌ Error fetching feedback:", error);
        res.status(500).json({ success: false, message: "Failed to fetch feedback" });
    }
});

export default router;
