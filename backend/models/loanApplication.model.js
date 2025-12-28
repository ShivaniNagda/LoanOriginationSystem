import mongoose from 'mongoose';

const loanApplicationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanOfficer' },
  amountRequested: { type: Number, required: true },
  tenureMonths: { type: Number, required: true },
  interestRate: { type: Number },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  eligibilityScore: { type: Number }
}, { timestamps: true });

const loanApplicationModel = mongoose.model('LoanApplication', loanApplicationSchema);
export default loanApplicationModel;
