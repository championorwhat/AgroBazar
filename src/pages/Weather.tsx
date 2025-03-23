import { useState } from 'react';
import axios from 'axios'; // Importing axios for HTTP requests
import { Search, MapPin, Cloud, Sun, Moon, CloudRain, Wind, Droplets, ThermometerSun } from 'lucide-react'; // Importing Moon icon
import { type WeatherInfo } from '../types';

interface Forecast {
  date: string;
  temp: { min: number; max: number };
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface LocationWeather extends WeatherInfo {
  location: string;
  forecast: Forecast[];
}

const getWeatherIcon = (condition: string) => { // Updated to include night condition
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <Sun className="h-8 w-8 text-yellow-500" />;
    case 'cloudy':
      return <Cloud className="h-8 w-8 text-gray-500" />;
    case 'rain':
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    case 'partly cloudy':
      return <Cloud className="h-8 w-8 text-gray-400" />;
    case 'night':
      return <Moon className="h-8 w-8 text-gray-500" />;
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />;
  }
};

export default function Weather() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<LocationWeather>({
    location: "",
    temperature: 0,
    condition: "",
    humidity: 0,
    windSpeed: 0,
    forecast: [], // This will now be populated with the 5-day forecast data
  });
  const [recentLocations] = useState(['Delhi', 'Bangalore', 'Chennai']);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get<LocationWeather>(`http://localhost:5000/api/weather?city=${location}`);
      console.log('Weather API Response:', response.data); // Log the response data for debugging
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
    console.log('Searching weather for:', location);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location..."
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-6">
          {recentLocations.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocation(loc)}
              className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-sm"
            >
              {loc}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{weather.location}</h2>
              <p className="text-gray-600">Current Weather</p>
            </div>
            {getWeatherIcon(weather.condition)} {/* Display the appropriate weather icon */}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
              <ThermometerSun className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-gray-600">Temperature</p>
                <p className="text-xl font-semibold">{weather.temperature}°C</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
              <Droplets className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-gray-600">Humidity</p>
                <p className="text-xl font-semibold">{weather.humidity}%</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
              <Wind className="h-6 w-6 text-teal-500" />
              <div>
                <p className="text-gray-600">Wind Speed</p>
                <p className="text-xl font-semibold">{weather.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {weather.forecast && weather.forecast.length > 0 ? (
              weather.forecast.map((day, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">{day.date}</p>
                  <div className="flex items-center justify-between mb-2">
                    {getWeatherIcon(day.condition)}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {day.temp.min}° - {day.temp.max}°
                      </p>
                      <p className="text-sm text-gray-500">{day.condition}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Humidity: {day.humidity}%</p>
                    <p>Wind: {day.windSpeed} km/h</p>
                  </div>
                </div>
              ))
            ) : null} {/* Removed the message for no forecast data */}
          </div>
        </div>
      </div>
    </div>
  );
}
