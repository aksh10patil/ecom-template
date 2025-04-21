import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
        
        // Fetch related products in the same category
        if (response.data.category) {
          const relatedResponse = await axios.get(`/api/products/category/${response.data.category}`);
          // Filter out the current product and limit to 4 items
          const filtered = relatedResponse.data
            .filter(item => item._id !== id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };
  
  const nextImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImage((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  };
  
  const prevImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImage((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    }
  };
  
  const selectImage = (index) => {
    setCurrentImage(index);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumbs */}
        {product && (
          <div className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-purple-600">Home</Link> {' / '}
            <Link to="/shop" className="hover:text-purple-600">Shop</Link> {' / '}
            <Link to={`/category/${product.category}`} className="hover:text-purple-600">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Link> {' / '}
            <span className="text-gray-700">{product.name}</span>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading product details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : product ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Product Images */}
              <div>
                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <img 
                        src={`/uploads/${product.images[currentImage]}`} 
                        alt={product.name} 
                        className="w-full h-full object-contain"
                      />
                      
                      {product.images.length > 1 && (
                        <>
                          <button 
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button 
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No image available</p>
                    </div>
                  )}
                </div>
                
                {/* Image Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => selectImage(index)}
                        className={`h-20 w-20 border-2 rounded ${
                          currentImage === index ? 'border-purple-500' : 'border-transparent'
                        }`}
                      >
                        <img 
                          src={`/uploads/${image}`} 
                          alt={`${product.name} - ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <div className="mb-4">
                  {product.discountPrice ? (
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-purple-600">${product.discountPrice.toFixed(2)}</span>
                      <span className="ml-2 text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm rounded">
                        {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-purple-600">${product.price.toFixed(2)}</span>
                  )}
                </div>
                
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {product.featured && (
                    <span className="inline-block ml-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="prose prose-purple mb-6">
                  <p>{product.description}</p>
                </div>
                
                {product.inStock && (
                  <>
                    <div className="flex items-center mb-6">
                      <span className="mr-4">Quantity:</span>
                      <div className="flex items-center">
                        <button 
                          onClick={decrementQuantity}
                          className="bg-gray-200 px-3 py-1 rounded-l"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          min="1"
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="w-16 text-center border-y border-gray-200 py-1"
                        />
                        <button 
                          onClick={incrementQuantity}
                          className="bg-gray-200 px-3 py-1 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <button className="flex-1 min-w-max bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded flex items-center justify-center transition">
                        <ShoppingCart size={20} className="mr-2" />
                        Add to Cart
                      </button>
                      <button className="min-w-max bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded flex items-center justify-center transition">
                        <Heart size={20} />
                      </button>
                      <button className="min-w-max bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded flex items-center justify-center transition">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map(related => (
                    <div key={related._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                      <Link to={`/product/${related._id}`}>
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={related.images && related.images.length > 0 ? `/uploads/${related.images[0]}` : '/placeholder-image.jpg'} 
                            alt={related.name}
                            className="w-full h-full object-cover transition duration-300 hover:scale-105"
                          />
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{related.name}</h3>
                          <p className="text-purple-600 font-bold">
                            {related.discountPrice ? (
                              <>
                                ${related.discountPrice.toFixed(2)}
                                <span className="ml-2 text-sm text-gray-400 line-through">${related.price.toFixed(2)}</span>
                              </>
                            ) : (
                              `$${related.price.toFixed(2)}`
                            )}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Product not found.</p>
            <Link to="/shop" className="text-purple-600 font-medium hover:text-purple-700 mt-4 inline-block">
              Return to Shop
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetailPage;