import asyncHandler from 'express-async-handler';
import Unit from '../models/Unit.js';

// @desc    Get all Units (search + pagination)
// @route   GET /api/units
// @access  Private
export const getUnitList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Unit.find(query)
      
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Unit.countDocuments(query),
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

// @desc    Get single Unit
// @route   GET /api/units/:id
// @access  Private
export const getUnit = asyncHandler(async (req, res) => {
  const item = await Unit.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Unit not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Unit
// @route   POST /api/units
// @access  Private
export const createUnit = asyncHandler(async (req, res) => {
  const item = await Unit.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Unit
// @route   PUT /api/units/:id
// @access  Private
export const updateUnit = asyncHandler(async (req, res) => {
  const item = await Unit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Unit not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Unit
// @route   DELETE /api/units/:id
// @access  Private
export const deleteUnit = asyncHandler(async (req, res) => {
  const item = await Unit.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Unit not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
