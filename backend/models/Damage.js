import mongoose from 'mongoose';

const damageSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: [true, 'product is required'] },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    quantity: { type: Number, required: [true, 'quantity is required'], default: 0 },
    reason: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    lossAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

damageSchema.index({ createdAt: -1 });

export default mongoose.model('Damage', damageSchema);
