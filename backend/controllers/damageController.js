import asyncHandler from 'express-async-handler';
import Damage from '../models/Damage.js';

// @desc    Get all Damages (search + pagination)
// @route   GET /api/damages
// @access  Private
export const getDamageList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.reason = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Damage.find(query)
      .populate('product').populate('warehouse')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Damage.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
    },
  });
});

// @desc    Get single Damage
// @route   GET /api/damages/:id
// @access  Private
export const getDamage = asyncHandler(async (req, res) => {
  const item = await Damage.findById(req.params.id).populate('product').populate('warehouse');
  if (!item) {
    res.status(404);
    throw new Error('Damage not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Damage
// @route   POST /api/damages
// @access  Private
export const createDamage = asyncHandler(async (req, res) => {
  const item = await Damage.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Damage
// @route   PUT /api/damages/:id
// @access  Private
export const updateDamage = asyncHandler(async (req, res) => {
  const item = await Damage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Damage not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Damage
// @route   DELETE /api/damages/:id
// @access  Private
export const deleteDamage = asyncHandler(async (req, res) => {
  const item = await Damage.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Damage not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
