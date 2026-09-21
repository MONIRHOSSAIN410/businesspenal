import asyncHandler from 'express-async-handler';
import Account from '../models/Account.js';

// @desc    Get all Accounts (search + pagination)
// @route   GET /api/accounts
// @access  Private
export const getAccountList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Account.find(query)
      
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Account.countDocuments(query),
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

// @desc    Get single Account
// @route   GET /api/accounts/:id
// @access  Private
export const getAccount = asyncHandler(async (req, res) => {
  const item = await Account.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Account not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Account
// @route   POST /api/accounts
// @access  Private
export const createAccount = asyncHandler(async (req, res) => {
  const item = await Account.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Account
// @route   PUT /api/accounts/:id
// @access  Private
export const updateAccount = asyncHandler(async (req, res) => {
  const item = await Account.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Account not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Account
// @route   DELETE /api/accounts/:id
// @access  Private
export const deleteAccount = asyncHandler(async (req, res) => {
  const item = await Account.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Account not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
