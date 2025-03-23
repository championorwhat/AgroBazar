import  { type Product, type UserPreferences } from '../types';

// Mock user preferences - in a real app, this would come from user behavior tracking
const mockUserPreferences: UserPreferences = {
  recentCategories: ['vegetables', 'fruits'],
  preferredLocations: ['Maharashtra', 'Karnataka'],
  priceRange: {
    min: 20,
    max: 100
  },
  seasonalPreferences: ['summer']
};

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    price: 40,
    quantity: 100,
    unit: "kg",
    description: "Farm fresh organic tomatoes",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3",
    farmerId: "f1",
    category: "vegetables",
    availableFrom: "2023-06-01",
    availableTo: "2023-06-10",
    tags: ['organic', 'summer']
  },
  {
    id: "2",
    name: "Organic Potatoes",
    price: 30,
    quantity: 200,
    unit: "kg",
    description: "Premium quality potatoes",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3",
    farmerId: "f2",
    category: "vegetables",
    availableFrom: "2023-06-01",
    availableTo: "2023-06-15",
    tags: ['organic', 'root-vegetables']
  },
  {
    id: "3",
    name: "Fresh Mangoes",
    price: 80,
    quantity: 50,
    unit: "kg",
    description: "Sweet and juicy Alphonso mangoes",
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3",
    farmerId: "f3",
    category: "fruits",
    availableFrom: "2023-06-01",
    availableTo: "2023-06-20",
    tags: ['premium', 'summer']
  }
];

export function getRecommendedProducts(preferences: UserPreferences = mockUserPreferences): Product[] {
  return mockProducts.filter(product => 
    preferences.recentCategories.includes(product.category) &&
    product.price >= preferences.priceRange.min &&
    product.price <= preferences.priceRange.max &&
    product.tags?.some(tag => preferences.seasonalPreferences.includes(tag))
  );
}

export function getSeasonalProducts(): Product[] {
  const currentSeason = 'summer'; // In real app, determine from date
  return mockProducts.filter(product => 
    product.tags?.includes(currentSeason)
  );
}

export function getTrendingProducts(): Product[] {
  // In real app, this would be based on sales data and popularity
  return mockProducts.slice(0, 3);
}
 