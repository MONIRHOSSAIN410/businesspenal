import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'title is required'], trim: true },
    category: { type: String, trim: true },
    amount: { type: Number, required: [true, 'amount is required'], default: 0 },
    date: { type: Date, default: Date.now },
    paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

expenseSchema.index({ createdAt: -1 });

export default mongoose.model('Expense', expenseSchema);
