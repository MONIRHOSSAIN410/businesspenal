import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], unique: true, trim: true },
    location: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

warehouseSchema.index({ createdAt: -1 });

export default mongoose.model('Warehouse', warehouseSchema);
