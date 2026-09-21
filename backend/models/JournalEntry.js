import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema(
  {
    entryNumber: { type: String, required: [true, 'entryNumber is required'], unique: true, trim: true },
    date: { type: Date, default: Date.now },
    debitAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    creditAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    amount: { type: Number, required: [true, 'amount is required'], default: 0 },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

journalEntrySchema.index({ createdAt: -1 });

export default mongoose.model('JournalEntry', journalEntrySchema);
