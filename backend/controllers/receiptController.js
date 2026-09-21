import asyncHandler from 'express-async-handler';
import Receipt from '../models/Receipt.js';

// @desc    Get all Receipts (search + pagination)
// @route   GET /api/receipts
// @access  Private
export const getReceiptList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.receiptNumber = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Receipt.find(query)
      .populate('customer').populate('paymentMethod')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Receipt.countDocuments(query),
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

// @desc    Get single Receipt
// @route   GET /api/receipts/:id
// @access  Private
export const getReceipt = asyncHandler(async (req, res) => {
  const item = await Receipt.findById(req.params.id).populate('customer').populate('paymentMethod');
  if (!item) {
    res.status(404);
    throw new Error('Receipt not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Receipt
// @route   POST /api/receipts
// @access  Private
export const createReceipt = asyncHandler(async (req, res) => {
  const item = await Receipt.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Receipt
// @route   PUT /api/receipts/:id
// @access  Private
export const updateReceipt = asyncHandler(async (req, res) => {
  const item = await Receipt.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Receipt not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Receipt
// @route   DELETE /api/receipts/:id
// @access  Private
export const deleteReceipt = asyncHandler(async (req, res) => {
  const item = await Receipt.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Receipt not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
