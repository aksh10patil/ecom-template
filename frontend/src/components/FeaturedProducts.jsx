import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const FeaturedProducts = ({ products }) => {
  // First, ensure products is an array and filter out any undefined or invalid products
  const validProducts = Array.isArray(products) 
    ? products.filter(product => product && typeof product === 'object')
    : [];
  
  if (validProducts.length === 0) {
    return <p className="text-center text-gray-500">No featured products available at the moment.</p>;
  }
  
  // Add debugging to help identify issues
  console.log('Valid products after filtering:', validProducts);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {validProducts.map(product => (
          <ProductCard key={product._id || Math.random().toString()} product={product} />
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