import asyncHandler from 'express-async-handler';
import SalesOrder from '../models/SalesOrder.js';

// @desc    Get all Sales Orders (search + pagination)
// @route   GET /api/sales-orders
// @access  Private
export const getSalesOrderList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.orderNumber = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    SalesOrder.find(query)
      .populate('customer')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    SalesOrder.countDocuments(query),
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

// @desc    Get single Sales Order
// @route   GET /api/sales-orders/:id
// @access  Private
export const getSalesOrder = asyncHandler(async (req, res) => {
  const item = await SalesOrder.findById(req.params.id).populate('customer');
  if (!item) {
    res.status(404);
    throw new Error('Sales Order not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Sales Order
// @route   POST /api/sales-orders
// @access  Private
export const createSalesOrder = asyncHandler(async (req, res) => {
  const item = await SalesOrder.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Sales Order
// @route   PUT /api/sales-orders/:id
// @access  Private
export const updateSalesOrder = asyncHandler(async (req, res) => {
  const item = await SalesOrder.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Sales Order not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Sales Order
// @route   DELETE /api/sales-orders/:id
// @access  Private
export const deleteSalesOrder = asyncHandler(async (req, res) => {
  const item = await SalesOrder.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Sales Order not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
