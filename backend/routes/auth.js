const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory users storage (replace with database in production)
let users = [];

// Initialize default users with properly hashed passwords
const initializeDefaultUsers = async () => {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);
  
  users = [
    {
      id: 1,
      username: 'admin',
      password: adminPassword,
      role: 'admin',
      email: 'admin@inventory.com',
      createdAt: new Date()
    },
    {
      id: 2,
      username: 'user',
      password: userPassword,
      role: 'user',
      email: 'user@inventory.com',
      createdAt: new Date()
    }
  ];
};

// Initialize on startup
initializeDefaultUsers();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Validation
    if (!username || !password || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username, password, and email are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user exists
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username already exists' 
      });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      email,
      role: role || 'user', // Default to 'user' role
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      token,
      user: { 
        id: newUser.id, 
        username: newUser.username, 
        role: newUser.role,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      });
    }

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get current user
router.get('/me', require('../middleware/auth').verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    }
  });
});

// Get all users (admin only) - for debugging
router.get('/users', require('../middleware/auth').verifyToken, require('../middleware/auth').isAdmin, (req, res) => {
  const sanitizedUsers = users.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json({ success: true, data: sanitizedUsers });
});

module.exports = router;