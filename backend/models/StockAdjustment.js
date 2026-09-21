import mongoose from 'mongoose';

const stockAdjustmentSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: [true, 'product is required'] },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    adjustmentType: { type: String, required: [true, 'adjustmentType is required'], enum: ["Increase","Decrease"] },
    quantity: { type: Number, required: [true, 'quantity is required'], default: 0 },
    reason: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

stockAdjustmentSchema.index({ createdAt: -1 });

export default mongoose.model('StockAdjustment', stockAdjustmentSchema);
