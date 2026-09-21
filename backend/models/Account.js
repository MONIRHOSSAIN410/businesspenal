import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], trim: true },
    accountType: { type: String, enum: ["Asset","Liability","Equity","Income","Expense"], default: "Asset" },
    openingBalance: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

accountSchema.index({ createdAt: -1 });

export default mongoose.model('Account', accountSchema);
