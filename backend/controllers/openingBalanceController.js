import asyncHandler from 'express-async-handler';
import OpeningBalance from '../models/OpeningBalance.js';

// @desc    Get all Opening Balances (search + pagination)
// @route   GET /api/opening-balances
// @access  Private
export const getOpeningBalanceList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.note = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    OpeningBalance.find(query)
      .populate('account')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    OpeningBalance.countDocuments(query),
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

// @desc    Get single Opening Balance
// @route   GET /api/opening-balances/:id
// @access  Private
export const getOpeningBalance = asyncHandler(async (req, res) => {
  const item = await OpeningBalance.findById(req.params.id).populate('account');
  if (!item) {
    res.status(404);
    throw new Error('Opening Balance not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Opening Balance
// @route   POST /api/opening-balances
// @access  Private
export const createOpeningBalance = asyncHandler(async (req, res) => {
  const item = await OpeningBalance.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Opening Balance
// @route   PUT /api/opening-balances/:id
// @access  Private
export const updateOpeningBalance = asyncHandler(async (req, res) => {
  const item = await OpeningBalance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Opening Balance not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Opening Balance
// @route   DELETE /api/opening-balances/:id
// @access  Private
export const deleteOpeningBalance = asyncHandler(async (req, res) => {
  const item = await OpeningBalance.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Opening Balance not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
