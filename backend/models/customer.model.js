import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  income: { type: Number },
  creditScore: { type: Number }
}, { timestamps: true });

 const customerModel = mongoose.model('Customer', customerSchema);

export default customerModel;