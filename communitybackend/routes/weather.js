import express from 'express';
import axios from 'axios'; // Import axios for API calls

const router = express.Router();

router.get('/', async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.WEATHER_API_KEY; // Use the API key from environment variables

    try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        
        const weatherData = {
            location: weatherResponse.data.name,
            temperature: weatherResponse.data.main.temp,
            condition: weatherResponse.data.weather[0].description,
            humidity: weatherResponse.data.main.humidity,
            windSpeed: weatherResponse.data.wind.speed,
        };
        res.json(weatherData);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

export default router;
