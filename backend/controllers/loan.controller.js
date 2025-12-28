// backend/controllers/loanController.js
import LoanApplication from '../models/loanApplication.model.js';
import Customer from '../models/customer.model.js';
import * as loanService from '../services/loanService.js';
// Create loan application
export const apply = async (req, res) => {
  try {
    const { amountRequested, tenureMonths } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!amountRequested || !tenureMonths) {
      return res.status(400).json({ message: 'amountRequested and tenureMonths are required' });
    }

    // Get customer from authenticated user
    const customer = await Customer.findOne({ userId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found. Please register as a customer.' });
    }

    // Create loan application
    const loanApplication = new LoanApplication({
      customerId: customer._id,
      amountRequested,
      tenureMonths,
      status: 'PENDING'
    });
    console.log('Creating loan application:', loanApplication);
    await loanApplication.save();

    // Evaluate loan eligibility (automatic scoring)
    try {
      await loanService.evaluateLoan(loanApplication._id);
    } catch (error) {
      console.error('Error evaluating loan:', error);
      // Continue even if evaluation fails - status remains PENDING
    }

    res.status(201).json({
      loanId: loanApplication._id,
      message: 'Loan application submitted.'
    });
  } catch (error) {
    console.error('Error creating loan application:', error);
    res.status(500).json({ message: 'Server error during loan application', error: error.message });
  }
};

// Get loan status
export const getStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const loanApplication = await LoanApplication.findById(id);
    if (!loanApplication) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    res.json({
      status: loanApplication.status,
      eligibilityScore: loanApplication.eligibilityScore,
      interestRate: loanApplication.interestRate,
      amountRequested: loanApplication.amountRequested,
      tenureMonths: loanApplication.tenureMonths
    });
  } catch (error) {
    console.error('Error fetching loan status:', error);
    res.status(500).json({ message: 'Server error fetching loan status', error: error.message });
  }
};

// Get all loans for a customer
export const getCustomerLoans = async (req, res) => {
  try {
    const customerId = req.user.userId;
    
    // Find customer by userId
    const customer = await Customer.findOne({ userId: customerId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const loans = await LoanApplication.find({ customerId: customer._id })
      .populate('officerId', 'branch')
      .sort({ createdAt: -1 });
console.log('Fetched loans for customer:', loans);
    res.json(loans);
  } catch (error) {
    console.error('Error fetching customer loans:', error);
    res.status(500).json({ message: 'Server error fetching loans', error: error.message });
  }
};

