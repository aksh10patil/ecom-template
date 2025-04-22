// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// Register Admin (uncomment for first admin creation)
// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     
//     // Check if admin already exists
//     let admin = await Admin.findOne({ username });
//     if (admin) {
//       return res.status(400).json({ message: 'Admin already exists' });
//     }
//     
//     // Create new admin
//     admin = new Admin({
//       username,
//       password
//     });
//     
//     // Hash the password before saving
//     const salt = await bcrypt.genSalt(10);
//     admin.password = await bcrypt.hash(password, salt);
//     
//     await admin.save();
//     
//     // Generate JWT token
//     const payload = {
//       admin: {
//         id: admin.id
//       }
//     };
//     
//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// Login Admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if admin exists
    let admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const payload = {
      admin: {
        id: admin.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Verify Admin Token
router.get('/verify', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;