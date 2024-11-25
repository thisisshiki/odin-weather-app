const API_KEY = '7CFQZF59SF3NFLZPRHJ8EYLX4';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

const sanitizeLocation = (location: string): string => {
  // Remove special characters and extra spaces, but keep basic punctuation
  return location
    .trim()
    .replace(/[^\w\s,.-]/g, '')
    .replace(/\s+/g, ' ');
};

export const fetchWeatherData = async (location: string) => {
  try {
    const sanitizedLocation = sanitizeLocation(location);
    
    if (!sanitizedLocation) {
      throw new Error('Please enter a valid location.');
    }

    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(sanitizedLocation)}?unitGroup=metric&include=current,days&key=${API_KEY}`
    );
    
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Location not found. Please enter a valid city name or address.');
      }
      if (response.status === 429) {
        throw new Error('Too many requests. Please try again in a moment.');
      }
      throw new Error('Weather service is temporarily unavailable. Please try again later.');
    }
    
    const data = await response.json();
    
    if (!data.currentConditions || !data.days || data.days.length === 0) {
      throw new Error('No weather data available for this location.');
    }
    
    return {
      currentConditions: {
        temp: data.currentConditions.temp,
        feelslike: data.currentConditions.feelslike,
        humidity: data.currentConditions.humidity,
        windspeed: data.currentConditions.windspeed,
        conditions: data.currentConditions.conditions,
        icon: data.currentConditions.icon
      },
      location: {
        address: data.resolvedAddress || sanitizedLocation,
        timezone: data.timezone,
        latitude: data.latitude,
        longitude: data.longitude
      },
      days: data.days.map((day: any) => ({
        datetime: day.datetime,
        tempmax: day.tempmax,
        tempmin: day.tempmin,
        conditions: day.conditions,
        icon: day.icon
      }))
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred. Please try again.');
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