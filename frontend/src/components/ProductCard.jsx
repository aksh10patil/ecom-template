import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Safety check to handle undefined product
  if (!product) {
    console.error("ProductCard received undefined product");
    return null;
  }

  // Safely extract properties with fallbacks
  const {
    _id = 'unknown',
    name = 'Product Name Unavailable',
    category = 'Uncategorized',
    price = 0,
    discountPrice = null,
    inStock = true,
    images = []
  } = product;

  // Function to properly format the image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    
    // Check if the path already starts with "/uploads/"
    return imagePath.startsWith('/uploads/') ? imagePath : `/uploads/${imagePath}`;
  };

  const mainImage = images && images.length > 0 ? getImageUrl(images[0]) : '/placeholder-image.jpg';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
      <Link to={`/product/${_id}`}>
        <div className="h-64 overflow-hidden">
          <img 
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover transition duration-300 hover:scale-105"
            onError={(e) => {
              console.error("Image failed to load:", e.target.src);
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
          <p className="text-sm text-gray-500 mb-2">{category}</p>
          
          <div className="flex justify-between items-center">
            <div>
              {discountPrice ? (
                <div className="flex items-center">
                  <span className="text-lg font-bold text-purple-600">${Number(discountPrice).toFixed(2)}</span>
                  <span className="ml-2 text-sm text-gray-400 line-through">${Number(price).toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-purple-600">${Number(price).toFixed(2)}</span>
              )}
            </div>
            
            {!inStock && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;