import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: [true, 'invoiceNumber is required'], unique: true, trim: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    saleDate: { type: Date, default: Date.now },
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
    discount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' },
    status: { type: String, enum: ["Completed","Due","Cancelled"], default: "Completed" },
  },
  { timestamps: true }
);

saleSchema.index({ createdAt: -1 });

export default mongoose.model('Sale', saleSchema);
