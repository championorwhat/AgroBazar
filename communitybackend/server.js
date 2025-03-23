import express from 'express';
import http from 'http';  // Required for Socket.IO
import { Server } from 'socket.io';  // Importing Socket.IO
import path from 'path';
import cors from 'cors';
import axios from 'axios';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Convert `import.meta.url` to `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (change if needed)
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for frontend access

// ✅ Create MySQL Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ✅ Test Database Connection on Startup
async function testDBConnection() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log(`✅ Database is working! Test result: ${rows[0].result}`);
    } catch (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    }
}
testDBConnection();

// ✅ Weather API Route
app.get('/api/weather', async (req, res) => {
    let city = req.query.city || 'Delhi'; // Default city is 'Delhi'

    // Validate city name
    if (!/^[a-zA-Z\s]+$/.test(city)) {
        return res.status(400).json({ message: 'Invalid city name' });
    }

    try {
        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey) {
            throw new Error('Weather API key is missing in .env file');
        }

        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        const response = await axios.get(weatherURL);
        const { name, main, weather, wind } = response.data;

        const weatherData = {
            location: name,
            temperature: main.temp,
            condition: weather[0].description,
            humidity: main.humidity,
            windSpeed: wind.speed,
        };

        // Emit weather data via WebSocket to all connected clients
        io.emit("weatherUpdate", weatherData);

        res.json(weatherData);
    } catch (error) {
        console.error('❌ Error fetching weather data:', error.response ? error.response.data : error.message);
        
        // Handle OpenWeatherMap API errors
        if (error.response) {
            if (error.response.status === 404) {
                return res.status(404).json({ message: 'City not found' });
            } else if (error.response.status === 401) {
                return res.status(401).json({ message: 'Invalid API key' });
            }
        }

        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

// ✅ Community Chat using Socket.IO
io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);

    // Listen for new messages
    socket.on("sendMessage", (message) => {
        console.log("📩 New message:", message);

        // Broadcast the message to all clients
        io.emit("receiveMessage", message);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("🔴 A user disconnected:", socket.id);
    });
});

// ✅ Serve Static Frontend Files (If Needed)
app.use(express.static(path.join(__dirname, '../Farmer\'s Direct Marketplace_files')));

// ✅ Start Server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
