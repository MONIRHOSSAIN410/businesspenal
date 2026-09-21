import asyncHandler from 'express-async-handler';
import Payment from '../models/Payment.js';

// @desc    Get all Payments (search + pagination)
// @route   GET /api/payments
// @access  Private
export const getPaymentList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.paymentNumber = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Payment.find(query)
      .populate('supplier').populate('paymentMethod')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Payment.countDocuments(query),
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

// @desc    Get single Payment
// @route   GET /api/payments/:id
// @access  Private
export const getPayment = asyncHandler(async (req, res) => {
  const item = await Payment.findById(req.params.id).populate('supplier').populate('paymentMethod');
  if (!item) {
    res.status(404);
    throw new Error('Payment not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Payment
// @route   POST /api/payments
// @access  Private
export const createPayment = asyncHandler(async (req, res) => {
  const item = await Payment.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Payment
// @route   PUT /api/payments/:id
// @access  Private
export const updatePayment = asyncHandler(async (req, res) => {
  const item = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Payment not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Payment
// @route   DELETE /api/payments/:id
// @access  Private
export const deletePayment = asyncHandler(async (req, res) => {
  const item = await Payment.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Payment not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
