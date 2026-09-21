import asyncHandler from 'express-async-handler';
import OpeningStock from '../models/OpeningStock.js';

// @desc    Get all Opening Stocks (search + pagination)
// @route   GET /api/opening-stocks
// @access  Private
export const getOpeningStockList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  // This model has no default text field to search on.

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    OpeningStock.find(query)
      .populate('product').populate('warehouse')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    OpeningStock.countDocuments(query),
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

// @desc    Get single Opening Stock
// @route   GET /api/opening-stocks/:id
// @access  Private
export const getOpeningStock = asyncHandler(async (req, res) => {
  const item = await OpeningStock.findById(req.params.id).populate('product').populate('warehouse');
  if (!item) {
    res.status(404);
    throw new Error('Opening Stock not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Opening Stock
// @route   POST /api/opening-stocks
// @access  Private
export const createOpeningStock = asyncHandler(async (req, res) => {
  const item = await OpeningStock.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Opening Stock
// @route   PUT /api/opening-stocks/:id
// @access  Private
export const updateOpeningStock = asyncHandler(async (req, res) => {
  const item = await OpeningStock.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Opening Stock not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Opening Stock
// @route   DELETE /api/opening-stocks/:id
// @access  Private
export const deleteOpeningStock = asyncHandler(async (req, res) => {
  const item = await OpeningStock.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Opening Stock not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
