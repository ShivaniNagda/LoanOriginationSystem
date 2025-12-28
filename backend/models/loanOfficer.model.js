import mongoose from 'mongoose';

const loanOfficerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  branch: { type: String }
}, { timestamps: true });

const loanOfficerModel = mongoose.model('LoanOfficer', loanOfficerSchema);
export default loanOfficerModel;
