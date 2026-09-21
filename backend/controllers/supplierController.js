import asyncHandler from 'express-async-handler';
import Supplier from '../models/Supplier.js';

// @desc    Get all Suppliers (search + pagination)
// @route   GET /api/suppliers
// @access  Private
export const getSupplierList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Supplier.find(query)
      
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Supplier.countDocuments(query),
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

// @desc    Get single Supplier
// @route   GET /api/suppliers/:id
// @access  Private
export const getSupplier = asyncHandler(async (req, res) => {
  const item = await Supplier.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Supplier not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Supplier
// @route   POST /api/suppliers
// @access  Private
export const createSupplier = asyncHandler(async (req, res) => {
  const item = await Supplier.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Supplier
// @route   PUT /api/suppliers/:id
// @access  Private
export const updateSupplier = asyncHandler(async (req, res) => {
  const item = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Supplier not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
export const deleteSupplier = asyncHandler(async (req, res) => {
  const item = await Supplier.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Supplier not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
