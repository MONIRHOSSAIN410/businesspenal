import asyncHandler from 'express-async-handler';
import BankAccount from '../models/BankAccount.js';

// @desc    Get all Bank Accounts (search + pagination)
// @route   GET /api/bank-accounts
// @access  Private
export const getBankAccountList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.bankName = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    BankAccount.find(query)
      
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    BankAccount.countDocuments(query),
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

// @desc    Get single Bank Account
// @route   GET /api/bank-accounts/:id
// @access  Private
export const getBankAccount = asyncHandler(async (req, res) => {
  const item = await BankAccount.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Bank Account not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Bank Account
// @route   POST /api/bank-accounts
// @access  Private
export const createBankAccount = asyncHandler(async (req, res) => {
  const item = await BankAccount.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Bank Account
// @route   PUT /api/bank-accounts/:id
// @access  Private
export const updateBankAccount = asyncHandler(async (req, res) => {
  const item = await BankAccount.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Bank Account not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Bank Account
// @route   DELETE /api/bank-accounts/:id
// @access  Private
export const deleteBankAccount = asyncHandler(async (req, res) => {
  const item = await BankAccount.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Bank Account not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
