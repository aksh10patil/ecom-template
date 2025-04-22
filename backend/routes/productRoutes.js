// backend/routes/productRoutes.js (modified to require authentication for certain operations)
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i');
    
    const products = await Product.find({
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } }
      ]
    });
    
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get products by category (public)
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i');
    
    const products = await Product.find({
      category: categoryId,
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } }
      ]
    });
    
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create product (admin only)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, inStock, featured } = req.body;
    
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const product = new Product({
      name,
      description,
      price,
      discountPrice: discountPrice || null,
      category,
      inStock: inStock === 'true',
      featured: featured === 'true',
      images: imagePaths
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Update product (admin only)
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, inStock, featured } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.discountPrice = discountPrice || null;
    product.category = category;
    product.inStock = inStock === 'true';
    product.featured = featured === 'true';
    
    // Add new images if any
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
      product.images = [...product.images, ...newImagePaths];
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;