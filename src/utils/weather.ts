const API_KEY = 'YOUR_API_KEY'; // Replace with your Visual Crossing API key
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

export const fetchWeatherData = async (location: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(location)}?unitGroup=metric&key=${API_KEY}&contentType=json`
    );
    
    if (!response.ok) {
      throw new Error('Weather data not found');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
};

export const getWeatherBackground = (conditions: string): string => {
  const timeOfDay = new Date().getHours() > 6 && new Date().getHours() < 18 ? 'day' : 'night';
  
  const weatherMap: Record<string, { day: string; night: string }> = {
    'clear': {
      day: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920',
      night: 'https://images.unsplash.com/photo-1532978879514-6cb2cac47dd4?auto=format&fit=crop&w=1920'
    },
    'rain': {
      day: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1920',
      night: 'https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?auto=format&fit=crop&w=1920'
    },
    'snow': {
      day: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1920',
      night: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&w=1920'
    },
    'cloudy': {
      day: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920',
      night: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1920'
    }
  };

  const condition = conditions.toLowerCase();
  const defaultWeather = weatherMap['clear'];
  
  for (const [key, value] of Object.entries(weatherMap)) {
    if (condition.includes(key)) {
      return value[timeOfDay];
    }
  }
  
  return defaultWeather[timeOfDay];
};