import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: { type: String, required: [true, 'poNumber is required'], unique: true, trim: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: [true, 'supplier is required'] },
    orderDate: { type: Date, default: Date.now },
    expectedDate: { type: Date },
    status: { type: String, enum: ["Pending","Approved","Received","Cancelled"], default: "Pending" },
    items: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          quantity: { type: Number, default: 1 },
          unitCost: { type: Number, default: 0 },
          _id: false,
        },
      ],
      default: [],
    },
    totalAmount: { type: Number, default: 0 },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

purchaseOrderSchema.index({ createdAt: -1 });

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);
