import asyncHandler from 'express-async-handler';
import Sale from '../models/Sale.js';

// @desc    Get all Sales (search + pagination)
// @route   GET /api/sales
// @access  Private
export const getSaleList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.invoiceNumber = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Sale.find(query)
      .populate('customer').populate('warehouse').populate('paymentMethod')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Sale.countDocuments(query),
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

// @desc    Get single Sale
// @route   GET /api/sales/:id
// @access  Private
export const getSale = asyncHandler(async (req, res) => {
  const item = await Sale.findById(req.params.id).populate('customer').populate('warehouse').populate('paymentMethod');
  if (!item) {
    res.status(404);
    throw new Error('Sale not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Sale
// @route   POST /api/sales
// @access  Private
export const createSale = asyncHandler(async (req, res) => {
  const item = await Sale.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Sale
// @route   PUT /api/sales/:id
// @access  Private
export const updateSale = asyncHandler(async (req, res) => {
  const item = await Sale.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Sale not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Sale
// @route   DELETE /api/sales/:id
// @access  Private
export const deleteSale = asyncHandler(async (req, res) => {
  const item = await Sale.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Sale not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
