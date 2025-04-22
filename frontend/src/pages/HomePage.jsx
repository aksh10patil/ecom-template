import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const categories = [
  { id: 'home', label: 'Home' },
  { id: 'crystals', label: 'Crystals' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'chakra', label: '7 Chakra Products' },
  { id: 'decor', label: 'Decor & Stands' },
  { id: 'selfcare', label: 'Self Care' },
  { id: 'offers', label: 'Offers' },
];

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => {
        console.log("Products loaded:", data);
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Function to render content based on active tab
  const renderTabContent = () => {
    // Filter products based on active tab
    const filteredProducts = activeTab === 'home' 
      ? products.filter(product => product.featured) 
      : products.filter(product => product.category === activeTab);

    if (loading) {
      return <div className="py-8 text-center">Loading products...</div>;
    }

    if (activeTab === 'home') {
      return (
        <div className="py-8">
          {/* Hero section */}
          <div className="bg-pink-50 rounded-lg p-8 mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Crystal Harmony</h1>
            <p className="text-lg text-gray-600 mb-6">Discover the healing power of crystals and elevate your spiritual journey</p>
            <button className="bg-pink-500 text-white px-6 py-3 rounded-md font-medium hover:bg-pink-600 transition-colors">
              Shop Now
            </button>
          </div>

          {/* Featured categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 3).map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:4000${product.images[0]}`} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Image failed to load:", product.images[0]);
                            e.target.src = '/api/placeholder/300/200';
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg text-gray-800">{product.name}</h3>
                      <p className="text-gray-600 mt-1">{product.description.substring(0, 100)}...</p>
                      <button className="mt-3 text-pink-500 font-medium hover:text-pink-600 transition-colors">
                        Explore →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No featured products found
                </div>
              )}
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="italic text-gray-600 mb-4">"The crystals I received were even more beautiful than pictured. They have such wonderful energy!"</p>
                <p className="font-medium text-gray-800">— Emma S.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="italic text-gray-600 mb-4">"Fast shipping and the quality is exceptional. Will definitely be ordering again!"</p>
                <p className="font-medium text-gray-800">— Michael T.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="py-8">
        {/* Category header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{categories.find(cat => cat.id === activeTab)?.label}</h1>
          <p className="text-gray-600">
            {activeTab === 'crystals' && 'Discover our collection of healing crystals for every purpose.'}
            {activeTab === 'jewellery' && 'Handcrafted crystal jewelry to wear your intention.'}
            {activeTab === 'chakra' && 'Products designed to balance and align your seven chakras.'}
            {activeTab === 'decor' && 'Beautiful displays and home decor to showcase your crystals.'}
            {activeTab === 'selfcare' && 'Enhance your self-care routine with our mindful products.'}
            {activeTab === 'offers' && 'Special deals and limited-time offers on selected items.'}
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:4000${product.images[0]}`} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", product.images[0]);
                        e.target.src = '/api/placeholder/300/200';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mt-1">{product.description.substring(0, 100)}...</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      {product.discountPrice ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">${product.price.toFixed(2)}</span>
                          ${product.discountPrice.toFixed(2)}
                        </>
                      ) : (
                        `$${product.price.toFixed(2)}`
                      )}
                    </span>
                    <button className="bg-pink-500 text-white px-3 py-1 rounded text-sm hover:bg-pink-600 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No products found in this category
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Header />

      {/* Navigation */}
      <nav className="bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex justify-between">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`py-3 px-4 font-medium transition-colors ${
                  activeTab === category.id
                    ? category.id === 'home'
                      ? 'text-black rounded-md border-pink-500'
                      : 'text-pink-500 border-b-2 border-pink-500'
                    : 'text-gray-700 hover:text-pink-500'
                }`}
                onClick={() => setActiveTab(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button
              className="w-full py-3 flex justify-between items-center"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <span className="font-medium">
                {categories.find((cat) => cat.id === activeTab)?.label || 'Menu'}
              </span>
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            {showMobileMenu && (
              <div className="py-2 border-t border-gray-200">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`w-full text-left py-2 px-4 ${
                      activeTab === category.id
                        ? 'text-pink-500 bg-pink-50'
                        : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setActiveTab(category.id);
                      setShowMobileMenu(false);
                    }}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <div className="container mx-auto px-4">
        {renderTabContent()}
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;