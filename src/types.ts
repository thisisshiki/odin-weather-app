export interface WeatherData {
  currentConditions: {
    temp: number;
    feelslike: number;
    humidity: number;
    windspeed: number;
    conditions: string;
    icon: string;
  };
  location: {
    address: string;
    timezone: string;
    latitude: number;
    longitude: number;
  };
  days: Array<{
    datetime: string;
    tempmax: number;
    tempmin: number;
    conditions: string;
    icon: string;
  }>;
}