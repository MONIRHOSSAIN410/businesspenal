import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], unique: true, trim: true },
    description: { type: String, trim: true },
    permissions: { type: [String], default: [] },
  },
  { timestamps: true }
);

roleSchema.index({ createdAt: -1 });

export default mongoose.model('Role', roleSchema);
