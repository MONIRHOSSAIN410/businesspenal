import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: [true, 'invoiceNumber is required'], unique: true, trim: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: [true, 'supplier is required'] },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    purchaseDate: { type: Date, default: Date.now },
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
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending","Completed"], default: "Completed" },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

purchaseSchema.index({ createdAt: -1 });

export default mongoose.model('Purchase', purchaseSchema);
