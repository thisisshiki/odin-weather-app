import React from 'react';

interface ForecastCardProps {
  date: string;
  maxTemp: number;
  minTemp: number;
  conditions: string;
  isMetric: boolean;
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  date,
  maxTemp,
  minTemp,
  conditions,
  isMetric
}) => {
  const convertTemp = (celsius: number) => {
    return isMetric ? celsius : (celsius * 9/5) + 32;
  };

  const formatTemp = (temp: number) => {
    return `${Math.round(convertTemp(temp))}°${isMetric ? 'C' : 'F'}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
      <div className="text-sm font-medium text-gray-600">
        {formatDate(date)}
      </div>
      <div className="mt-2">
        <div className="text-lg font-semibold text-gray-800">
          {formatTemp(maxTemp)}
        </div>
        <div className="text-sm text-gray-600">
          {formatTemp(minTemp)}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-700">
        {conditions}
      </div>
    </div>
  );
};

export default ForecastCard;