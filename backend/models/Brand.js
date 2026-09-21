import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], unique: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

brandSchema.index({ createdAt: -1 });

export default mongoose.model('Brand', brandSchema);
