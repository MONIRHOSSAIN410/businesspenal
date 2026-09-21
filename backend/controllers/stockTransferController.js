import asyncHandler from 'express-async-handler';
import StockTransfer from '../models/StockTransfer.js';

// @desc    Get all Stock Transfers (search + pagination)
// @route   GET /api/stock-transfers
// @access  Private
export const getStockTransferList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.transferNumber = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    StockTransfer.find(query)
      .populate('fromWarehouse').populate('toWarehouse').populate('product')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    StockTransfer.countDocuments(query),
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

// @desc    Get single Stock Transfer
// @route   GET /api/stock-transfers/:id
// @access  Private
export const getStockTransfer = asyncHandler(async (req, res) => {
  const item = await StockTransfer.findById(req.params.id).populate('fromWarehouse').populate('toWarehouse').populate('product');
  if (!item) {
    res.status(404);
    throw new Error('Stock Transfer not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Stock Transfer
// @route   POST /api/stock-transfers
// @access  Private
export const createStockTransfer = asyncHandler(async (req, res) => {
  const item = await StockTransfer.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Stock Transfer
// @route   PUT /api/stock-transfers/:id
// @access  Private
export const updateStockTransfer = asyncHandler(async (req, res) => {
  const item = await StockTransfer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Stock Transfer not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Stock Transfer
// @route   DELETE /api/stock-transfers/:id
// @access  Private
export const deleteStockTransfer = asyncHandler(async (req, res) => {
  const item = await StockTransfer.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Stock Transfer not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
