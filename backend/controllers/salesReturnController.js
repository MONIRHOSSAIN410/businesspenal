import asyncHandler from 'express-async-handler';
import SalesReturn from '../models/SalesReturn.js';

// @desc    Get all Sales Returns (search + pagination)
// @route   GET /api/sales-returns
// @access  Private
export const getSalesReturnList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.returnNumber = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    SalesReturn.find(query)
      .populate('customer').populate('sale')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    SalesReturn.countDocuments(query),
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

// @desc    Get single Sales Return
// @route   GET /api/sales-returns/:id
// @access  Private
export const getSalesReturn = asyncHandler(async (req, res) => {
  const item = await SalesReturn.findById(req.params.id).populate('customer').populate('sale');
  if (!item) {
    res.status(404);
    throw new Error('Sales Return not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Sales Return
// @route   POST /api/sales-returns
// @access  Private
export const createSalesReturn = asyncHandler(async (req, res) => {
  const item = await SalesReturn.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Sales Return
// @route   PUT /api/sales-returns/:id
// @access  Private
export const updateSalesReturn = asyncHandler(async (req, res) => {
  const item = await SalesReturn.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Sales Return not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Sales Return
// @route   DELETE /api/sales-returns/:id
// @access  Private
export const deleteSalesReturn = asyncHandler(async (req, res) => {
  const item = await SalesReturn.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Sales Return not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
