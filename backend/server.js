const express = require("express")
const cors = require("cors");
const path = require("path")
const connectDB = require('./config/db')
const productRoutes = require('./routes/productRoutes');

const dotenv = require('dotenv');

dotenv.config();

const app = express();



app.use(cors());
app.use(express.json());


connectDB();

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);

app.get('/' , (req , res ) => {
    res.send('Server works fine!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
  });
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });