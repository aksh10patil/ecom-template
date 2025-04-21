import React from 'react';
import { Link } from 'react-router-dom';

const CategorySection = () => {
  const categories = [
    { id: 'crystals', name: 'Crystals', image: '/category-crystals.jpg', description: 'Healing crystals for energy and balance' },
    { id: 'jewellery', name: 'Jewellery', image: '/category-jewellery.jpg', description: 'Spiritual and meaningful jewellery pieces' },
    { id: 'chakra', name: 'Chakra', image: '/category-chakra.jpg', description: 'Items for chakra balancing and healing' },
    { id: 'decor', name: 'Decor', image: '/category-decor.jpg', description: 'Beautiful spiritual decor for your space' },
    { id: 'selfcare', name: 'Self Care', image: '/category-selfcare.jpg', description: 'Products for mindfulness and self-care rituals' },
    { id: 'offers', name: 'Special Offers', image: '/category-offers.jpg', description: 'Limited-time deals and special offers' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map(category => (
        <Link key={category.id} to={`/category/${category.id}`} className="group">
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
            <div className="h-48 overflow-hidden">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105" 
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategorySection;