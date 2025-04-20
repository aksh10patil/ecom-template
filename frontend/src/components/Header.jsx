import { useState } from 'react';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';

export default function VastuRemediesHeader() {
  const [activeTab, setActiveTab] = useState('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'home', label: 'Home' },
    { id: 'crystals', label: 'Crystals' },
    { id: 'jewellery', label: 'Jewellery' },
    { id: 'chakra', label: '7 Chakra Products' },
    { id: 'decor', label: 'Decor & Stands' },
    { id: 'selfcare', label: 'Self Care' },
    { id: 'offers', label: 'Offers' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add search functionality here
  };

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-teal-500 text-white py-2 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <ShoppingCart size={16} className="mr-2" />
          <span className="text-sm">Free Shipping up to orders over ₹499</span>
        </div>
        <div className="hidden md:flex space-x-6 text-sm">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Help Center</a>
          <a href="#" className="hover:underline">Call Us +91-9999593214</a>
        </div>
        <button className="md:hidden">
          <Menu size={20} />
        </button>
      </div>

      {/* Main Header */}
      <div className="bg-white py-4 px-4 shadow-sm flex flex-wrap items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-medium text-gray-700">
            Vastu Remedies
          </h1>
        </div>

        {/* Search Bar */}
        <div className="order-3 mt-4 w-full md:order-2 md:mt-0 md:w-1/3 lg:w-2/5">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button type="submit" className="absolute right-0 top-0 bg-pink-400 text-white p-2 rounded-full">
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* User Actions */}
        <div className="order-2 md:order-3 flex items-center space-x-6">
          <button className="flex flex-col items-center">
            <Heart size={24} />
            <span className="text-xs mt-1">Wishlist</span>
          </button>
          <button className="flex flex-col items-center">
            <ShoppingCart size={24} />
            <span className="text-xs mt-1">Cart</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
              <User size={24} className="mx-auto mt-1" />
            </div>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex justify-between">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`py-3 px-4 font-medium transition-colors ${
                  activeTab === category.id
                    ? 'text-pink-500 border-b-2 border-pink-500'
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
                {categories.find(cat => cat.id === activeTab)?.label || 'Menu'}
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
    </header>
  );
}