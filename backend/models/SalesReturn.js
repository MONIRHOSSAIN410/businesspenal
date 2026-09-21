import mongoose from 'mongoose';

const salesReturnSchema = new mongoose.Schema(
  {
    returnNumber: { type: String, required: [true, 'returnNumber is required'], unique: true, trim: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale' },
    returnDate: { type: Date, default: Date.now },
    items: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          quantity: { type: Number, default: 1 },
          unitPrice: { type: Number, default: 0 },
          _id: false,
        },
      ],
      default: [],
    },
    totalAmount: { type: Number, default: 0 },
    reason: { type: String, trim: true },
  },
  { timestamps: true }
);

salesReturnSchema.index({ createdAt: -1 });

export default mongoose.model('SalesReturn', salesReturnSchema);
