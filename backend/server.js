const express = require("express")
const cors = require("cors");

const connectDB = require('./config/db')
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes')

const dotenv = require('dotenv');

dotenv.config();

const app = express();

const fs = require('fs');
const path = require('path');




app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

app.use(express.json());


connectDB();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created');
}

// Static folder for uploaded images
app.use('/uploads/', express.static(path.join(__dirname, 'uploads')));

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

  app.use('/api/admin', require('./routes/adminRoutes'));
  
  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });