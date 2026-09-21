import mongoose from 'mongoose';

const openingBalanceSchema = new mongoose.Schema(
  {
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: [true, 'account is required'] },
    amount: { type: Number, required: [true, 'amount is required'], default: 0 },
    type: { type: String, enum: ["Debit","Credit"], default: "Debit" },
    date: { type: Date, default: Date.now },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

openingBalanceSchema.index({ createdAt: -1 });

export default mongoose.model('OpeningBalance', openingBalanceSchema);
