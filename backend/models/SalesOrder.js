import mongoose from 'mongoose';

const salesOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: [true, 'orderNumber is required'], unique: true, trim: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: [true, 'customer is required'] },
    orderDate: { type: Date, default: Date.now },
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
    status: { type: String, enum: ["Pending","Confirmed","Delivered","Cancelled"], default: "Pending" },
  },
  { timestamps: true }
);

salesOrderSchema.index({ createdAt: -1 });

export default mongoose.model('SalesOrder', salesOrderSchema);
