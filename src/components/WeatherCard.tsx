import React from 'react';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';

interface WeatherCardProps {
  temp: number;
  feelslike: number;
  humidity: number;
  windspeed: number;
  conditions: string;
  isMetric: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temp,
  feelslike,
  humidity,
  windspeed,
  conditions,
  isMetric
}) => {
  const convertTemp = (celsius: number) => {
    return isMetric ? celsius : (celsius * 9/5) + 32;
  };

  const formatTemp = (temp: number) => {
    return `${Math.round(convertTemp(temp))}°${isMetric ? 'C' : 'F'}`;
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg">
      <div className="flex flex-col space-y-4">
        <div className="text-4xl font-bold text-gray-800">
          {formatTemp(temp)}
        </div>
        <div className="text-lg text-gray-600">
          {conditions}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Feels like {formatTemp(feelslike)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Humidity {humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">
              Wind {Math.round(windspeed)} {isMetric ? 'km/h' : 'mph'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">{conditions}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;