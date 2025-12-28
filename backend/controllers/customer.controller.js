// backend/controllers/customerController.js
import Customer from '../models/customer.model.js';
import User from '../models/user.model.js';
// Get customer profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Get Profile UserID:', userId);
    const customer = await Customer.findOne({ userId }).populate('userId', 'name email');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ message: 'Server error fetching profile', error: error.message });
  }
};

// Update customer profile (income, creditScore)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { income, creditScore } = req.body;

    let customer = await Customer.findOne({ userId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update fields if provided
    if (income !== undefined) {
      customer.income = income;
    }
    if (creditScore !== undefined) {
      customer.creditScore = creditScore;
    }

    await customer.save();

    // Populate userId before sending response
    await customer.populate('userId', 'name email');

    res.json({
      message: 'Profile updated successfully',
      customer
    });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

