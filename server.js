const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  referralCode: { type: String, unique: true },
  referredBy: { type: String, default: null },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tier: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// User Model
const User = mongoose.model('User', userSchema);

// Generate referral code
function generateReferralCode(username) {
  return username.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Register route
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, referredBy } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate referral code
    const referralCode = generateReferralCode(username);
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      referralCode,
      referredBy
    });
    
    // If referred by someone, update their referrals
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });
      if (referrer) {
        referrer.referrals.push(newUser._id);
        
        // Update tier based on number of referrals
        if (referrer.referrals.length >= 20) {
          referrer.tier = 3;
        } else if (referrer.referrals.length >= 10) {
          referrer.tier = 2;
        } else if (referrer.referrals.length >= 5) {
          referrer.tier = 1;
        }
        
        await referrer.save();
      }
    }
    
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        referralCode: newUser.referralCode,
        tier: newUser.tier
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        referralCode: user.referralCode,
        tier: user.tier
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user info with referral stats
app.get('/api/user', async (req, res) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user with referral info
    const user = await User.findById(decoded.id).populate('referrals', 'username createdAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      username: user.username,
      email: user.email,
      referralCode: user.referralCode,
      referralLink: `https://roksarahmed111.github.io/?ref=${user.referralCode}`,
      referrals: user.referrals,
      referralCount: user.referrals.length,
      tier: user.tier
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add these security headers
app.use((req, res, next) => {
  // Prevent CORS issues by restricting to your domain
  res.header('Access-Control-Allow-Origin', 'https://roksarahmed111.github.io');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Security headers
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  
  next();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 

// If you need this API_URL for frontend, move it to a frontend config file
// Or if it's needed in the server, move it to the top of the file 