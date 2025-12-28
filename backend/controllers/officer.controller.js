import LoanApplication from '../models/loanApplication.model.js';
import LoanOfficer from '../models/loanOfficer.model.js';
import Customer from '../models/customer.model.js';
import User from '../models/user.model.js';

// Get all pending loan applications
export const getPendingLoans = async (req, res) => {
  try {
    const pendingLoans = await LoanApplication.find({ status: 'PENDING' })
      .populate({
        path: 'customerId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate('officerId', 'branch')
      .sort({ createdAt: -1 });

    res.json(pendingLoans);
  } catch (error) {
    console.error('Error fetching pending loans:', error);
    res.status(500).json({ message: 'Server error fetching pending loans', error: error.message });
  }
};

// Review loan (approve/reject)
export const reviewLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'APPROVE' or 'REJECT'
    const officerId = req.user.userId;

    // Validate action
    if (!action || !['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({ message: 'Action must be APPROVE or REJECT' });
    }

    // Find loan application
    const loanApplication = await LoanApplication.findById(id);
    if (!loanApplication) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    // Find officer
    const officer = await LoanOfficer.findOne({ userId: officerId });
    if (!officer) {
      return res.status(404).json({ message: 'Loan officer not found' });
    }

    // Update loan application
    loanApplication.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    loanApplication.officerId = officer._id;
    
    // If approving, ensure interest rate is set
    if (action === 'APPROVE' && !loanApplication.interestRate) {
      // Default interest rate based on eligibility score
      const baseRate = 8;
      const score = loanApplication.eligibilityScore || 0.7;
      loanApplication.interestRate = baseRate + (1 - score) * 4;
    }

    await loanApplication.save();

    res.json({
      message: `Loan application ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully`,
      loanApplication
    });
  } catch (error) {
    console.error('Error reviewing loan:', error);
    res.status(500).json({ message: 'Server error reviewing loan', error: error.message });
  }
};

// Get all loans reviewed by officer
export const getOfficerLoans = async (req, res) => {
  try {
    const officerId = req.user.userId;
    
    // Find officer
    const officer = await LoanOfficer.findOne({ userId: officerId });
    if (!officer) {
      return res.status(404).json({ message: 'Loan officer not found' });
    }

    const loans = await LoanApplication.find({ officerId: officer._id })
      .populate({
        path: 'customerId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.json(loans);
  } catch (error) {
    console.error('Error fetching officer loans:', error);
    res.status(500).json({ message: 'Server error fetching loans', error: error.message });
  }
};

