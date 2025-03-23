import  { type Product } from '../types';
import ProductCard from './ProductCard';

interface RecommendationSectionProps {
  title: string;
  products: Product[];
}

export default function RecommendationSection({ title, products }: RecommendationSectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
 