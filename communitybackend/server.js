import express from 'express';
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
    const city = req.query.city || 'Delhi'; // Default city
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        );
        res.json({
            location: response.data.name,
            temperature: response.data.main.temp,
            condition: response.data.weather[0].description,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
        });
    } catch (error) {
        console.error('❌ Error fetching weather data:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

// ✅ Serve Static Frontend Files (If Needed)
app.use(express.static(path.join(__dirname, '../Farmer\'s Direct Marketplace_files')));

// ✅ Start Server
app.listen(PORT, () => { 
    console.log(`🚀 Server running on port ${PORT}`);
});
