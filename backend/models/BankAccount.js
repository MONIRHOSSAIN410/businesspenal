import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema(
  {
    bankName: { type: String, required: [true, 'bankName is required'], trim: true },
    accountName: { type: String, required: [true, 'accountName is required'], trim: true },
    accountNumber: { type: String, required: [true, 'accountNumber is required'], unique: true, trim: true },
    branch: { type: String, trim: true },
    openingBalance: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bankAccountSchema.index({ createdAt: -1 });

export default mongoose.model('BankAccount', bankAccountSchema);
