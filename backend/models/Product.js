import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], trim: true },
    sku: { type: String, required: [true, 'sku is required'], unique: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    purchasePrice: { type: Number, default: 0 },
    salePrice: { type: Number, default: 0 },
    stockQty: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 0 },
    image: { type: String, trim: true },
    status: { type: String, enum: ["active","inactive"], default: "active" },
  },
  { timestamps: true }
);

productSchema.index({ createdAt: -1 });

export default mongoose.model('Product', productSchema);
