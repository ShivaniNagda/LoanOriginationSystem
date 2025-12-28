import LoanApplication from '../models/loanApplication.model.js';
import Customer from '../models/customer.model.js';
// Evaluate loan eligibility
export const evaluateLoan = async (applicationId) => {
  try {
    // Fetch application
    const application = await LoanApplication.findById(applicationId);
    
    if (!application) {
      throw new Error('Loan application not found');
    }

    // Get customer details
    const customer = await Customer.findById(application.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const income = customer.income || 0;
    const creditScore = customer.creditScore || 0;
    const amountRequested = application.amountRequested || 0;

    // Normalize credit score to 0-1 scale (assuming credit score range is 300-850)
    const creditScoreMin = 300;
    const creditScoreMax = 850;
    const creditScoreNorm = Math.max(0, Math.min(1, (creditScore - creditScoreMin) / (creditScoreMax - creditScoreMin)));

    // Normalize income to 0-1 scale (assuming income range up to 10,000,000)
    // You can adjust these thresholds based
    const incomeMin = 0;
    const incomeMax = 10000000;
    const incomeNorm = Math.max(0, Math.min(1, (income - incomeMin) / (incomeMax - incomeMin)));

    // Calculate eligibility score
    const eligibilityScore = (0.6 * creditScoreNorm) + (0.4 * incomeNorm);

    // Determine threshold based on loan amount
    // Higher loan amounts require higher eligibility scores
    let threshold = 0.5; // Base threshold
    
    if (amountRequested > 1000000) {
      threshold = 0.75;
    } else if (amountRequested > 500000) {
      threshold = 0.65;
    } else if (amountRequested > 200000) {
      threshold = 0.55;
    }

    // Update application with eligibility score
    // Status remains PENDING until officer reviews it
    application.eligibilityScore = eligibilityScore;
    
    // Calculate suggested interest rate based on eligibility score (for officer reference)
    // Base interest rate of 8%, adjusted by eligibility score
    // Higher score = lower interest rate
    if (eligibilityScore >= threshold) {
      application.interestRate = 8 + (1 - eligibilityScore) * 4; // Range: 8% to 12%
    }

    await application.save();

    return {
      eligibilityScore,
      suggestedStatus: eligibilityScore >= threshold ? 'APPROVED' : 'REJECTED',
      interestRate: application.interestRate
    };
  } catch (error) {
    console.error('Error evaluating loan:', error);
    throw error;
  }
};

