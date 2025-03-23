export  interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  description: string;
  imageUrl: string;
  farmerId: string;
  category: string;
  availableFrom: string;
  availableTo: string;
  tags?: string[];
}

export interface Farmer {
  id: string;
  name: string;
  location: string;
  rating: number;
  products: Product[];
  imageUrl: string;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export interface UserPreferences {
  recentCategories: string[];
  preferredLocations: string[];
  priceRange: {
    min: number;
    max: number;
  };
  seasonalPreferences: string[];
}
 