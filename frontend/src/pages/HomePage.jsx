import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeaturedProducts from '../components/FeaturedProducts';
import CategorySection from '../components/CategorySection';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('/api/products?featured=true');
        setFeaturedProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="w-full h-96 bg-purple-100 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">Discover Your Inner Peace</h1>
            <p className="text-lg md:text-xl text-purple-700 mb-8">Explore our collection of crystals, jewellery, and spiritual items</p>
            <Link to="/shop" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
      
      {/* Featured Products Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          {loading ? (
            <p className="text-center">Loading featured products...</p>
          ) : (
            <FeaturedProducts products={featuredProducts} />
          )}
        </div>
      </section>
      
      {/* Category Showcase */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <CategorySection />
        </div>
      </section>
      
      {/* Testimonials or Blog Preview could go here */}
      
      <Footer />
    </div>
  );
};

export default HomePage;