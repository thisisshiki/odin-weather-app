import React, { useState } from 'react';
import { Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { WeatherData } from './types';
import { fetchWeatherData, getWeatherBackground } from './utils/weather';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';

function App() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isMetric, setIsMetric] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedLocation = location.trim();
    if (!trimmedLocation) {
      setError('Please enter a location to search.');
      return;
    }

    if (trimmedLocation.length < 2) {
      setError('Please enter a more specific location.');
      return;
    }

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const data = await fetchWeatherData(trimmedLocation);
      setWeatherData(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const backgroundImage = weatherData
    ? getWeatherBackground(weatherData.currentConditions.conditions)
    : 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920';

  return (
    <div 
      className="min-h-screen bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter city name (e.g., London, Paris, Tokyo)"
                  className="w-full px-4 py-2 rounded-lg bg-white/90 backdrop-blur-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minLength={2}
                  maxLength={100}
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" />
              </div>
              <button
                type="button"
                onClick={() => setIsMetric(!isMetric)}
                className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg hover:bg-white/100 transition-colors flex items-center gap-2"
              >
                {isMetric ? (
                  <>
                    <ToggleLeft className="w-5 h-5" /> °C
                  </>
                ) : (
                  <>
                    <ToggleRight className="w-5 h-5" /> °F
                  </>
                )}
              </button>
            </form>

            {loading && (
              <div className="text-center text-white text-lg">
                Searching for weather data...
              </div>
            )}

            {error && (
              <div className="bg-red-500/90 backdrop-blur-md text-white p-4 rounded-lg mb-8 text-center">
                {error}
              </div>
            )}

            {weatherData && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center text-white mb-8">
                  <h1 className="text-3xl font-bold mb-2">
                    {weatherData.location.address}
                  </h1>
                  <p className="text-lg opacity-90">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <WeatherCard
                  temp={weatherData.currentConditions.temp}
                  feelslike={weatherData.currentConditions.feelslike}
                  humidity={weatherData.currentConditions.humidity}
                  windspeed={weatherData.currentConditions.windspeed}
                  conditions={weatherData.currentConditions.conditions}
                  isMetric={isMetric}
                />

                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-white mb-4">5-Day Forecast</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {weatherData.days.slice(1, 6).map((day) => (
                      <ForecastCard
                        key={day.datetime}
                        date={day.datetime}
                        maxTemp={day.tempmax}
                        minTemp={day.tempmin}
                        conditions={day.conditions}
                        isMetric={isMetric}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
