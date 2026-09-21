import asyncHandler from 'express-async-handler';
import Purchase from '../models/Purchase.js';

// @desc    Get all Purchases (search + pagination)
// @route   GET /api/purchases
// @access  Private
export const getPurchaseList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.invoiceNumber = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Purchase.find(query)
      .populate('supplier').populate('warehouse')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Purchase.countDocuments(query),
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

// @desc    Get single Purchase
// @route   GET /api/purchases/:id
// @access  Private
export const getPurchase = asyncHandler(async (req, res) => {
  const item = await Purchase.findById(req.params.id).populate('supplier').populate('warehouse');
  if (!item) {
    res.status(404);
    throw new Error('Purchase not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Purchase
// @route   POST /api/purchases
// @access  Private
export const createPurchase = asyncHandler(async (req, res) => {
  const item = await Purchase.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Purchase
// @route   PUT /api/purchases/:id
// @access  Private
export const updatePurchase = asyncHandler(async (req, res) => {
  const item = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Purchase not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Purchase
// @route   DELETE /api/purchases/:id
// @access  Private
export const deletePurchase = asyncHandler(async (req, res) => {
  const item = await Purchase.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Purchase not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
