// frontend/src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { Pencil, X, Plus, Trash2, Save, ChevronDown, ChevronUp, Search, LogOut } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/Context';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'crystals',
    inStock: true,
    featured: false,
    images: []
  });

  const categories = [
    { id: 'crystals', label: 'Crystals' },
    { id: 'jewellery', label: 'Jewellery' },
    { id: 'chakra', label: '7 Chakra Products' },
    { id: 'decor', label: 'Decor & Stands' },
    { id: 'selfcare', label: 'Self Care' },
    { id: 'offers', label: 'Offers' },
  ];

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Fetch products with authentication
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    
    try {
      let url = 'http://localhost:4000/api/products';
      if (selectedCategory) {
        url += `/category/${selectedCategory}`;
      }
      if (searchTerm) {
        url += `?search=${searchTerm}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortField === 'price') {
      return sortDirection === 'asc' 
        ? a.price - b.price 
        : b.price - a.price;
    } else {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    }
  });

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      
      // If successful, remove the product from state
      setProducts(products.filter(product => product._id !== id));
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  // Start editing product
  const handleEditProduct = (product) => {
    setEditingProduct({...product});
  };

  // Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    
    // Add text fields to form data
    Object.keys(editingProduct).forEach(key => {
      if (key !== 'images' && key !== 'newImages' && key !== '_id' && key !== '__v' && key !== 'createdAt') {
        formData.append(key, editingProduct[key]);
      }
    });
    
    // Add new image files if any
    if (editingProduct.newImages && editingProduct.newImages.length > 0) {
      for (let i = 0; i < editingProduct.newImages.length; i++) {
        formData.append('images', editingProduct.newImages[i]);
      }
    }
    
    try {
      const response = await fetch(`http://localhost:4000/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      
      const updatedProduct = await response.json();
      
      setProducts(products.map(p => 
        p._id === updatedProduct._id ? updatedProduct : p
      ));
      
      setEditingProduct(null);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(newProduct).forEach(key => {
      if (key !== 'images') {
        formData.append(key, newProduct[key]);
      }
    });
    
    // Add image files
    if (newProduct.images && newProduct.images.length > 0) {
      for (let i = 0; i < newProduct.images.length; i++) {
        formData.append('images', newProduct.images[i]);
      }
    }
    
    try {
      const response = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
      
      const createdProduct = await response.json();
      setProducts([...products, createdProduct]);
      setIsAdding(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        category: 'crystals',
        inStock: true,
        featured: false,
        images: []
      });
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  // File input handler
  const handleFileInputChange = (e, isEditing) => {
    const files = Array.from(e.target.files);
    
    if (isEditing) {
      setEditingProduct({...editingProduct, newImages: files});
    } else {
      setNewProduct({...newProduct, images: files});
    }
    
    // Show preview of selected files (optional)
    console.log("Files selected:", files.map(f => f.name).join(", "));
  };

  if (loading) return <div className="p-8 text-center">Loading products...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <button
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
        
        {/* Filters and Search */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search products..."
                className="border border-gray-300 rounded-l p-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
          
          <div>
            <select
              className="border border-gray-300 rounded p-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="bg-green-500 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-green-600"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={20} /> Add Product
          </button>
        </div>
        
        {/* Rest of the component remains the same (add product form, product table, etc.) */}
        {/* ... */}
        
        {/* Add Product Form */}
        {isAdding && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Product</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsAdding(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct}>
              {/* Form fields remain the same */}
              {/* ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (optional)</label>
                  <input
                    type="number"
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newProduct.discountPrice}
                    onChange={(e) => setNewProduct({...newProduct, discountPrice: e.target.value})}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="border border-gray-300 rounded p-2 w-full h-32"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="border border-gray-300 rounded p-2 w-full"
                    onChange={(e) => handleFileInputChange(e, false)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={newProduct.inStock}
                        onChange={(e) => setNewProduct({...newProduct, inStock: e.target.checked})}
                      />
                      <span className="text-sm font-medium text-gray-700">In Stock</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={newProduct.featured}
                        onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                      />
                      <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="mr-2 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Product Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {sortField === 'price' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Table content remains the same */}
              {/* ... */}
              {sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                sortedProducts.map(product => (
                  <React.Fragment key={product._id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-16 w-16 bg-gray-200 rounded overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:4000${product.images[0]}`} 
                              alt={product.name} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                console.error("Image failed to load:", product.images[0]);
                                e.target.src = '/api/placeholder/300/200';
                                e.target.alt = 'Image not found';
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                        {product.discountPrice && (
                          <div className="text-xs text-red-500">Sale: ${product.discountPrice.toFixed(2)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {product.inStock ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              In Stock
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Out of Stock
                            </span>
                          )}
                          {product.featured && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  

{/* Edit Form Row */}
{editingProduct && editingProduct._id === product._id && (
  <tr className="bg-blue-50">
    <td colSpan="6" className="px-6 py-4">
      <form onSubmit={handleUpdateProduct}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded p-2 w-full"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="border border-gray-300 rounded p-2 w-full"
              value={editingProduct.category}
              onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              className="border border-gray-300 rounded p-2 w-full"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
            <input
              type="number"
              className="border border-gray-300 rounded p-2 w-full"
              value={editingProduct.discountPrice || ''}
              onChange={(e) => setEditingProduct({...editingProduct, discountPrice: e.target.value})}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="border border-gray-300 rounded p-2 w-full h-32"
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
              required
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="border border-gray-300 rounded p-2 w-full"
              onChange={(e) => handleFileInputChange(e, true)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={editingProduct.inStock}
                  onChange={(e) => setEditingProduct({...editingProduct, inStock: e.target.checked})}
                />
                <span className="text-sm font-medium text-gray-700">In Stock</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={editingProduct.featured}
                  onChange={(e) => setEditingProduct({...editingProduct, featured: e.target.checked})}
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Current Images */}
        {editingProduct.images && editingProduct.images.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
            <div className="flex flex-wrap gap-2">
              {editingProduct.images.map((img, index) => (
                <div key={index} className="relative h-20 w-20 bg-gray-200 rounded overflow-hidden">
                  <img 
                    src={img.startsWith('http') ? img : `http://localhost:4000${img}`} 
                    alt={`Product ${index}`} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", img);
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button 
            type="button" 
            className="mr-2 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 flex items-center gap-1"
            onClick={() => setEditingProduct(null)}
          >
            <X size={16} /> Cancel
          </button>
          <button 
            type="submit" 
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center gap-1"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </td>
  </tr>
)}
</React.Fragment>
))
)}
</tbody>
</table>
</div>
</div>
<Footer />
</>
);
};

export default AdminPanel;