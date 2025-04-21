import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Category titles and descriptions
  const categoryInfo = {
    crystals: {
      title: 'Crystals',
      description: 'Discover our selection of healing crystals, each with unique properties to enhance your spiritual practice.',
      banner: '/banners/crystals-banner.jpg'
    },
    jewellery: {
      title: 'Jewellery',
      description: 'Beautiful, handcrafted spiritual jewellery pieces to wear your intention wherever you go.',
      banner: '/banners/jewellery-banner.jpg'
    },
    chakra: {
      title: 'Chakra',
      description: 'Tools and products designed to balance and align your chakras for better energy flow.',
      banner: '/banners/chakra-banner.jpg'
    },
    decor: {
      title: 'Spiritual Decor',
      description: 'Transform your space with our mindful home decor items that bring peace and harmony.',
      banner: '/banners/decor-banner.jpg'
    },
    selfcare: {
      title: 'Self Care',
      description: 'Nurture your mind, body and spirit with our self-care products for holistic wellness.',
      banner: '/banners/selfcare-banner.jpg'
    },
    offers: {
      title: 'Special Offers',
      description: 'Limited-time deals and exclusive bundles at special prices.',
      banner: '/banners/offers-banner.jpg'
    }
  };
  
  const currentCategory = categoryInfo[category] || {
    title: 'Products',
    description: 'Explore our collection of spiritual products.',
    banner: '/banners/default-banner.jpg'
  };
  
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/category/${category}`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProductsByCategory();
  }, [category]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Category Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-500 to-indigo-600 overflow-hidden">
        <img 
          src={currentCategory.banner} 
          alt={currentCategory.title}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{currentCategory.title}</h1>
            <p className="text-white text-opacity-90 md:max-w-2xl">{currentCategory.description}</p>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading products...</p>
          </div>
        ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available in this category at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;