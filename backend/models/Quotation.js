import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema(
  {
    quoteNumber: { type: String, required: [true, 'quoteNumber is required'], unique: true, trim: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: [true, 'customer is required'] },
    date: { type: Date, default: Date.now },
    validUntil: { type: Date },
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
    status: { type: String, enum: ["Draft","Sent","Accepted","Rejected"], default: "Draft" },
  },
  { timestamps: true }
);

quotationSchema.index({ createdAt: -1 });

export default mongoose.model('Quotation', quotationSchema);
