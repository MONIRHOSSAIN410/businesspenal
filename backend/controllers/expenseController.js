import asyncHandler from 'express-async-handler';
import Expense from '../models/Expense.js';

// @desc    Get all Expenses (search + pagination)
// @route   GET /api/expenses
// @access  Private
export const getExpenseList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Expense.find(query)
      .populate('paymentMethod')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Expense.countDocuments(query),
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

// @desc    Get single Expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpense = asyncHandler(async (req, res) => {
  const item = await Expense.findById(req.params.id).populate('paymentMethod');
  if (!item) {
    res.status(404);
    throw new Error('Expense not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = asyncHandler(async (req, res) => {
  const item = await Expense.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = asyncHandler(async (req, res) => {
  const item = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Expense not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = asyncHandler(async (req, res) => {
  const item = await Expense.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Expense not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
