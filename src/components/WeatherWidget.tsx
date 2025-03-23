import  { Cloud, Sun, Wind, Droplets } from 'lucide-react';
import { type WeatherInfo } from '../types';

interface WeatherWidgetProps {
  weather: WeatherInfo;
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sun className="h-8 w-8 text-yellow-500" />
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
 