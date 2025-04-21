import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';




const FeaturedProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">No featured products available at the moment.</p>;
  }
  
  console.log('Products received:', products);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link to="/shop" className="text-purple-600 font-semibold hover:text-purple-800 transition duration-200">
          View All Products →
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProducts;