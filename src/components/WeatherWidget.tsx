import { Cloud, Sun, Wind, Droplets } from 'lucide-react';
import { type WeatherInfo } from '../types'; // Importing WeatherInfo type

interface WeatherWidgetProps {
  weather: WeatherInfo;
}

function getWeatherIcon(condition: string) {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <Sun className="h-8 w-8 text-yellow-500" />; // Return sun icon for default condition
    case 'cloudy':
      return <Cloud className="h-8 w-8 text-gray-500" />;
    case 'windy':
      return <Wind className="h-8 w-8 text-blue-500" />;
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />; // Default to sunny
  }
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getWeatherIcon(weather.condition)} {/* Display the appropriate weather icon */}
          <div>
            <h3 className="text-xl font-semibold">{weather.temperature}°C</h3>
            <p className="text-gray-600">{weather.condition}</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <Wind className="h-5 w-5 text-gray-500" />
            <span>{weather.windSpeed} km/h</span>
          </div>
          <div className="flex items-center space-x-1">
            <Droplets className="h-5 w-5 text-blue-500" />
            <span>{weather.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
