import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
      <Link to={`/product/${product._id}`}>
        <div className="h-64 overflow-hidden">
          <img 
            src={product.images && product.images.length > 0 ? `/uploads/${product.images[0]}` : '/placeholder-image.jpg'} 
            alt={product.name}
            className="w-full h-full object-cover transition duration-300 hover:scale-105"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          
          <div className="flex justify-between items-center">
            <div>
              {product.discountPrice ? (
                <div className="flex items-center">
                  <span className="text-lg font-bold text-purple-600">${product.discountPrice.toFixed(2)}</span>
                  <span className="ml-2 text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-purple-600">${product.price.toFixed(2)}</span>
              )}
            </div>
            
            {!product.inStock && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;