import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], trim: true },
    designation: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    salary: { type: Number, default: 0 },
    joiningDate: { type: Date },
    status: { type: String, enum: ["active","inactive"], default: "active" },
  },
  { timestamps: true }
);

employeeSchema.index({ createdAt: -1 });

export default mongoose.model('Employee', employeeSchema);
