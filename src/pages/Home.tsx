import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import WeatherWidget from '../components/WeatherWidget';
import RecommendationSection from '../components/RecommendationSection';
import { type WeatherInfo } from '../types';
import { getRecommendedProducts, getSeasonalProducts, getTrendingProducts } from '../utils/recommendations';
import { ArrowDown } from 'lucide-react';

const mockWeather: WeatherInfo = {
  temperature: 28,
  condition: "Sunny",
  humidity: 65,
  windSpeed: 12
};

export default function Home() {
  const navigate = useNavigate();
  const recommendedProducts = getRecommendedProducts();
  const seasonalProducts = getSeasonalProducts();
  const trendingProducts = getTrendingProducts();
  
  const parallaxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }

      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const isVisible = rect.top <= window.innerHeight * 0.8;
          if (isVisible) {
            el.classList.add('animate-fade-in');
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Hero Section with Parallax */}
      <div className="relative h-screen overflow-hidden">
        <div
          ref={parallaxRef}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3)
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'translateY(0)',
          }}
        />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            From Farm to Table
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in delay-200">
            Connect directly with local farmers and get fresh produce delivered to your doorstep
          </p>
          <button 
            onClick={() => navigate('/marketplace')} 
            className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors animate-fade-in delay-300"
          >
            Start Shopping
          </button>
          
          <div className="absolute bottom-8 animate-bounce">
            <ArrowDown className="h-8 w-8" />
          </div>
        </div>
      </div>
       {/* Main Content */}
       <div ref={contentRef} className="relative z-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[{
                title: "Direct from Farmers",
                description: "Support farmers and get the freshest produce",
                image: "/dff.jpg"
              },
              {
                title: "Quality Assured",
                description: "Every product is verified for quality and freshness",
                image: "/qa.jpg"
              },
              {
                title: "Fair Prices",
                description: "Get the best prices without middlemen markup",
                image: "/fp.jpeg"
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-700 delay-100"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Weather Widget */}
          <div className="animate-on-scroll mb-16">
            <WeatherWidget weather={mockWeather} />
          </div>
          
          {/* Product Sections */}
          <div className="animate-on-scroll">
            <RecommendationSection 
              title="Recommended for You"
              products={recommendedProducts}
            />
          </div>
          
          <div className="animate-on-scroll">
            <RecommendationSection 
              title="Seasonal Picks"
              products={seasonalProducts}
            />
          </div>
          
          <div className="animate-on-scroll">
            <RecommendationSection 
              title="Trending Products"
              products={trendingProducts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
