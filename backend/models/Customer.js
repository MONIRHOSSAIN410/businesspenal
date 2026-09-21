import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    openingBalance: { type: Number, default: 0 },
    status: { type: String, enum: ["active","inactive"], default: "active" },
  },
  { timestamps: true }
);

customerSchema.index({ createdAt: -1 });

export default mongoose.model('Customer', customerSchema);
