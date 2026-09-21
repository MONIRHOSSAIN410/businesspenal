import mongoose from 'mongoose';

const openingStockSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: [true, 'product is required'] },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    quantity: { type: Number, required: [true, 'quantity is required'], default: 0 },
    unitCost: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

openingStockSchema.index({ createdAt: -1 });

export default mongoose.model('OpeningStock', openingStockSchema);
