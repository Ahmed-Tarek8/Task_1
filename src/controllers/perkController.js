import Joi from 'joi';
import { Perk } from '../models/Perk.js';

// Schema for creating a new perk (all required rules)
const perkSchema = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().allow(''),
  category: Joi.string().valid('food', 'tech', 'travel', 'fitness', 'other').default('other'),
  discountPercent: Joi.number().min(0).max(100).default(0),
  merchant: Joi.string().allow('')
});

// Schema for updating a perk (all optional)
const perkUpdateSchema = Joi.object({
  title: Joi.string().min(2),
  description: Joi.string().allow(''),
  category: Joi.string().valid('food', 'tech', 'travel', 'fitness', 'other'),
  discountPercent: Joi.number().min(0).max(100),
  merchant: Joi.string().allow('')
}).min(1); // at least one field must be provided

// Filter perks by exact title match if title query parameter is provided 
export async function filterPerks(req, res, next) {
  try {
    const { title } = req.query;
    if (title) {
      const perks = await Perk.find({ title: title }).sort({ createdAt: -1 });
      res.status(200).json(perks);
    } else {
      res.status(400).json({ message: 'Title query parameter is required' });
    }
  } catch (err) { next(err); }
}

// Get a single perk by ID 
export async function getPerk(req, res, next) {
  try {
    const perk = await Perk.findById(req.params.id);
    if (!perk) return res.status(404).json({ message: 'Perk not found' });
    res.json({ perk });
  } catch (err) { next(err); }
}

// Get all perks
export async function getAllPerks(req, res, next) {
  try {
    const perks = await Perk.find().sort({ createdAt: -1 });
    res.json(perks);
  } catch (err) { next(err); }
}

// Create a new perk
export async function createPerk(req, res, next) {
  try {
    const { value, error } = perkSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const doc = await Perk.create({ ...value });
    res.status(201).json({ perk: doc });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Duplicate perk for this merchant' });
    next(err);
  }
}

// Update ANY field of a perk by ID
export async function updatePerk(req, res, next) {
  try {
    const { value, error } = perkUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const doc = await Perk.findByIdAndUpdate(
      req.params.id,
      { $set: value },
      { new: true } // return updated doc
    );

    if (!doc) return res.status(404).json({ message: 'Perk not found' });
    res.json({ perk: doc });
  } catch (err) { next(err); }
}

// Delete a perk by ID
export async function deletePerk(req, res, next) {
  try {
    const doc = await Perk.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Perk not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
}
