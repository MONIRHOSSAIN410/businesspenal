import asyncHandler from 'express-async-handler';
import StockAdjustment from '../models/StockAdjustment.js';

// @desc    Get all Stock Adjustments (search + pagination)
// @route   GET /api/stock-adjustments
// @access  Private
export const getStockAdjustmentList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.reason = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    StockAdjustment.find(query)
      .populate('product').populate('warehouse')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    StockAdjustment.countDocuments(query),
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

// @desc    Get single Stock Adjustment
// @route   GET /api/stock-adjustments/:id
// @access  Private
export const getStockAdjustment = asyncHandler(async (req, res) => {
  const item = await StockAdjustment.findById(req.params.id).populate('product').populate('warehouse');
  if (!item) {
    res.status(404);
    throw new Error('Stock Adjustment not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Stock Adjustment
// @route   POST /api/stock-adjustments
// @access  Private
export const createStockAdjustment = asyncHandler(async (req, res) => {
  const item = await StockAdjustment.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Stock Adjustment
// @route   PUT /api/stock-adjustments/:id
// @access  Private
export const updateStockAdjustment = asyncHandler(async (req, res) => {
  const item = await StockAdjustment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Stock Adjustment not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Stock Adjustment
// @route   DELETE /api/stock-adjustments/:id
// @access  Private
export const deleteStockAdjustment = asyncHandler(async (req, res) => {
  const item = await StockAdjustment.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Stock Adjustment not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
