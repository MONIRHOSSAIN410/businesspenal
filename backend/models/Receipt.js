import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema(
  {
    receiptNumber: { type: String, required: [true, 'receiptNumber is required'], unique: true, trim: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' },
    amount: { type: Number, required: [true, 'amount is required'], default: 0 },
    date: { type: Date, default: Date.now },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

receiptSchema.index({ createdAt: -1 });

export default mongoose.model('Receipt', receiptSchema);
