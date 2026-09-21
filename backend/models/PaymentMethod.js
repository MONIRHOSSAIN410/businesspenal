import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], unique: true, trim: true },
    type: { type: String, enum: ["Cash","Bank","Mobile Banking","Card","Other"], default: "Cash" },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

paymentMethodSchema.index({ createdAt: -1 });

export default mongoose.model('PaymentMethod', paymentMethodSchema);
