// backend/scripts/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

const createAdmin = async (username, password) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`Admin user "${username}" already exists!`);
      process.exit(0);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create admin
    const admin = new Admin({
      username,
      password: hashedPassword
    });
    
    await admin.save();
    console.log(`Admin user "${username}" created successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

console.log('Create Admin User');
console.log('=================');

rl.question('Enter username: ', (username) => {
  rl.question('Enter password: ', (password) => {
    createAdmin(username, password);
    rl.close();
  });
});