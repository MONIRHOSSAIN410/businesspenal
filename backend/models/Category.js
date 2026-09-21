import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], unique: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

categorySchema.index({ createdAt: -1 });

export default mongoose.model('Category', categorySchema);
