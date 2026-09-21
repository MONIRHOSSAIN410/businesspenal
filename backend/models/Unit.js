import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], unique: true, trim: true },
    shortName: { type: String, trim: true },
  },
  { timestamps: true }
);

unitSchema.index({ createdAt: -1 });

export default mongoose.model('Unit', unitSchema);
