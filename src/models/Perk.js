import mongoose from 'mongoose';

const perkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ['food', 'tech', 'travel', 'fitness', 'other'], default: 'other' },
    discountPercent: { type: Number, min: 0, max: 100, default: 0 },
    merchant: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);
// compound index to ensure unique title per merchant 
perkSchema.index({ title: 1, merchant: 1 }, { unique: true });

export const Perk = mongoose.model('Perk', perkSchema);
