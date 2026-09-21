import asyncHandler from 'express-async-handler';
import Customer from '../models/Customer.js';

// @desc    Get all Customers (search + pagination)
// @route   GET /api/customers
// @access  Private
export const getCustomerList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Customer.find(query)
      
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Customer.countDocuments(query),
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

// @desc    Get single Customer
// @route   GET /api/customers/:id
// @access  Private
export const getCustomer = asyncHandler(async (req, res) => {
  const item = await Customer.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Customer not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = asyncHandler(async (req, res) => {
  const item = await Customer.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = asyncHandler(async (req, res) => {
  const item = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Customer not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Customer
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = asyncHandler(async (req, res) => {
  const item = await Customer.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Customer not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
