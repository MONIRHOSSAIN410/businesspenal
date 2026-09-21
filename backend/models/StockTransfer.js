import mongoose from 'mongoose';

const stockTransferSchema = new mongoose.Schema(
  {
    transferNumber: { type: String, required: [true, 'transferNumber is required'], unique: true, trim: true },
    fromWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: [true, 'fromWarehouse is required'] },
    toWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: [true, 'toWarehouse is required'] },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: [true, 'product is required'] },
    quantity: { type: Number, required: [true, 'quantity is required'], default: 0 },
    date: { type: Date, default: Date.now },
    note: { type: String, trim: true },
    status: { type: String, enum: ["Pending","Completed"], default: "Completed" },
  },
  { timestamps: true }
);

stockTransferSchema.index({ createdAt: -1 });

export default mongoose.model('StockTransfer', stockTransferSchema);
