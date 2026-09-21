import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], trim: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    openingBalance: { type: Number, default: 0 },
    status: { type: String, enum: ["active","inactive"], default: "active" },
  },
  { timestamps: true }
);

supplierSchema.index({ createdAt: -1 });

export default mongoose.model('Supplier', supplierSchema);
