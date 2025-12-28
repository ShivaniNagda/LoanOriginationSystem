import User from '../models/user.model.js';
import Customer from '../models/customer.model.js';
import LoanOfficer from '../models/loanOfficer.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role, iat: Math.floor(Date.now() / 1000) },
    process.env.JWT_SECRET || 'shivani',
    { expiresIn: '7d' }
  );
};

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['CUSTOMER', 'OFFICER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be CUSTOMER or OFFICER' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      passwordHash,
      role
    });

    await user.save();

    // Create role-specific profile
    if (role === 'CUSTOMER') {
      const customer = new Customer({
        userId: user._id
      });
      await customer.save();
    } else if (role === 'OFFICER') {
      const officer = new LoanOfficer({
        userId: user._id
      });
      await officer.save();
    }

    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
console.log('Login attempt for email:', email);
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);
console.log('Login token generated for user:', token);
    res.json({
      token,
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

