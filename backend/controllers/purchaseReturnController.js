import asyncHandler from 'express-async-handler';
import PurchaseReturn from '../models/PurchaseReturn.js';

// @desc    Get all Purchase Returns (search + pagination)
// @route   GET /api/purchase-returns
// @access  Private
export const getPurchaseReturnList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.returnNumber = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    PurchaseReturn.find(query)
      .populate('supplier').populate('purchase')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    PurchaseReturn.countDocuments(query),
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

// @desc    Get single Purchase Return
// @route   GET /api/purchase-returns/:id
// @access  Private
export const getPurchaseReturn = asyncHandler(async (req, res) => {
  const item = await PurchaseReturn.findById(req.params.id).populate('supplier').populate('purchase');
  if (!item) {
    res.status(404);
    throw new Error('Purchase Return not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Purchase Return
// @route   POST /api/purchase-returns
// @access  Private
export const createPurchaseReturn = asyncHandler(async (req, res) => {
  const item = await PurchaseReturn.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Purchase Return
// @route   PUT /api/purchase-returns/:id
// @access  Private
export const updatePurchaseReturn = asyncHandler(async (req, res) => {
  const item = await PurchaseReturn.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Purchase Return not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Purchase Return
// @route   DELETE /api/purchase-returns/:id
// @access  Private
export const deletePurchaseReturn = asyncHandler(async (req, res) => {
  const item = await PurchaseReturn.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Purchase Return not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
