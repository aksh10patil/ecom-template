const Product = require('../models/Product');


// Get all products

exports.getProducts = async ( req , res ) => {
    try {
        const { category , featured , search } = req.query;
        const filter = {};

        // Apply category filter if provided
        if ( category ) {
            filter.category = category;
        }

         // Apply featured filter if provided
        if ( featured ) {
            filter.featured = featured === 'true';
        }

       if ( search ) {
        filter.name = {$regex: search , $options: 'i'};
       }

       const products = await Product.find(filter);
       res.json( products);
    } catch ( error ) {
        res.status(500).json({ message : ' Server Error ', error : error.message})
    }
};



// GET SINGLE PRODUCT BY ID
exports.getProductById = async ( req , res ) => {
    try {
        const product = await Product.findById( req.params.id);
        if ( !product) {
            return res.status(404).json({
                message : 'Product was not found'
            })
        }
        res.json(product);
    } catch ( error) {
        res.status(500).json({ message : ' Server Error ', error : error.message});
    }
}


// Create a new Product 


exports.createProduct = async ( req , res ) => {
    try {
        const { name, description, price, discountPrice, category, inStock, featured } = req.body;

        // Handle images upload 
        const images = req.files ? req.files.map( file => `/uploads/${file.filename}`) : [];
        
        
        if ( images.length === 0) {
            return res.status(400).json({ message : 'At least one images is required'})
        }

        const product = new Product( {
            name , 
            description,
            price,
            discountPrice,
            category,
            images,
            inStock: inStock === 'true',
            featured: featured === 'true'
        });


        const createdProduct = await product.save();
        res.status(201).json(createdProduct)
    } catch ( error) {
        res.status(500).json({ message : ' Server Error ', error : error.message});
    }
}


//Update a product 
exports.updateProduct = async (req, res) => {
    try {
      const { name, description, price, discountPrice, category, inStock, featured } = req.body;
      
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Update fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.category = category || product.category;
      product.inStock = inStock !== undefined ? inStock === 'true' : product.inStock;
      product.featured = featured !== undefined ? featured === 'true' : product.featured;
      
      // Handle image uploads for update
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => `/uploads/${file.filename}`);
        product.images = [...product.images, ...newImages];
      }
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  // Delete product
  exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Use findByIdAndDelete instead of the deprecated remove() method
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed' });
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  // Get products by category
  exports.getProductsByCategory = async (req, res) => {
    try {
      console.log("Category param:", req.params.category);
      const products = await Product.find({ category: req.params.category });
      console.log("Products found:", products);
      console.log("Is array:", Array.isArray(products));
      console.log("Length:", products.length);
      res.json(products);
    } catch (error) {
      console.error("Error in getProductsByCategory:", error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };

