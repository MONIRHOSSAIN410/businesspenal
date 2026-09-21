import asyncHandler from 'express-async-handler';
import PaymentMethod from '../models/PaymentMethod.js';

// @desc    Get all Payment Methods (search + pagination)
// @route   GET /api/payment-methods
// @access  Private
export const getPaymentMethodList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    PaymentMethod.find(query)
      
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    PaymentMethod.countDocuments(query),
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

// @desc    Get single Payment Method
// @route   GET /api/payment-methods/:id
// @access  Private
export const getPaymentMethod = asyncHandler(async (req, res) => {
  const item = await PaymentMethod.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Payment Method not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Payment Method
// @route   POST /api/payment-methods
// @access  Private
export const createPaymentMethod = asyncHandler(async (req, res) => {
  const item = await PaymentMethod.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Payment Method
// @route   PUT /api/payment-methods/:id
// @access  Private
export const updatePaymentMethod = asyncHandler(async (req, res) => {
  const item = await PaymentMethod.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Payment Method not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Payment Method
// @route   DELETE /api/payment-methods/:id
// @access  Private
export const deletePaymentMethod = asyncHandler(async (req, res) => {
  const item = await PaymentMethod.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Payment Method not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
