import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { ChevronDown, Filter } from 'lucide-react';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    inStock: false,
    priceRange: { min: 0, max: 1000 }
  });
  const [sortOption, setSortOption] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, we would include filter params in the API request
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Apply filters and sorting
  const filteredProducts = products
    .filter(product => 
      (filters.category ? product.category === filters.category : true) &&
      (filters.inStock ? product.inStock : true) &&
      (product.price >= filters.priceRange.min && product.price <= filters.priceRange.max)
    )
    .sort((a, b) => {
      switch(sortOption) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  
  const handleCategoryChange = (e) => {
    setFilters({...filters, category: e.target.value});
  };
  
  const handleInStockChange = (e) => {
    setFilters({...filters, inStock: e.target.checked});
  };
  
  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters, 
      priceRange: {...filters.priceRange, [name]: Number(value)} 
    });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>
        
        {/* Filters and Sort Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <button 
              className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 md:hidden mb-4"
              onClick={toggleFilters}
            >
              <Filter size={18} className="mr-2" />
              <span>Filter Products</span>
              <ChevronDown size={18} className="ml-2" />
            </button>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">Name: A-Z</option>
                <option value="nameDesc">Name: Z-A</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
          
          {/* Filter Panel */}
          <div className={`bg-white border border-gray-200 rounded-lg p-4 mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select 
                  value={filters.category}
                  onChange={handleCategoryChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Categories</option>
                  <option value="crystals">Crystals</option>
                  <option value="jewellery">Jewellery</option>
                  <option value="chakra">Chakra</option>
                  <option value="decor">Decor</option>
                  <option value="selfcare">Self Care</option>
                  <option value="offers">Special Offers</option>
                </select>
              </div>
              
              {/* Price Range Filter */}
              <div>
                <label className="block text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="number" 
                    name="min"
                    min="0"
                    value={filters.priceRange.min}
                    onChange={handlePriceRangeChange}
                    placeholder="Min"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    name="max"
                    min="0"
                    value={filters.priceRange.max}
                    onChange={handlePriceRangeChange}
                    placeholder="Max"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              {/* Availability Filter */}
              <div>
                <label className="block text-gray-700 mb-2">Availability</label>
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={handleInStockChange}
                    className="rounded text-purple-600 focus:ring-purple-500 mr-2"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products match your filters. Try adjusting your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ShopPage;