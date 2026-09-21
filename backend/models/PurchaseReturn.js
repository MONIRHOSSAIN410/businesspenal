import mongoose from 'mongoose';

const purchaseReturnSchema = new mongoose.Schema(
  {
    returnNumber: { type: String, required: [true, 'returnNumber is required'], unique: true, trim: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    purchase: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' },
    returnDate: { type: Date, default: Date.now },
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
    reason: { type: String, trim: true },
  },
  { timestamps: true }
);

purchaseReturnSchema.index({ createdAt: -1 });

export default mongoose.model('PurchaseReturn', purchaseReturnSchema);
