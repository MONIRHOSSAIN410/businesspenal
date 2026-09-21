import asyncHandler from 'express-async-handler';
import PurchaseOrder from '../models/PurchaseOrder.js';

// @desc    Get all Purchase Orders (search + pagination)
// @route   GET /api/purchase-orders
// @access  Private
export const getPurchaseOrderList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.poNumber = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    PurchaseOrder.find(query)
      .populate('supplier')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    PurchaseOrder.countDocuments(query),
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

// @desc    Get single Purchase Order
// @route   GET /api/purchase-orders/:id
// @access  Private
export const getPurchaseOrder = asyncHandler(async (req, res) => {
  const item = await PurchaseOrder.findById(req.params.id).populate('supplier');
  if (!item) {
    res.status(404);
    throw new Error('Purchase Order not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Purchase Order
// @route   POST /api/purchase-orders
// @access  Private
export const createPurchaseOrder = asyncHandler(async (req, res) => {
  const item = await PurchaseOrder.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Purchase Order
// @route   PUT /api/purchase-orders/:id
// @access  Private
export const updatePurchaseOrder = asyncHandler(async (req, res) => {
  const item = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Purchase Order not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Purchase Order
// @route   DELETE /api/purchase-orders/:id
// @access  Private
export const deletePurchaseOrder = asyncHandler(async (req, res) => {
  const item = await PurchaseOrder.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Purchase Order not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
