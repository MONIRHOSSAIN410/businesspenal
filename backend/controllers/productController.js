import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Get all Products (search + pagination)
// @route   GET /api/products
// @access  Private
export const getProductList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Product.find(query)
      .populate('category').populate('brand').populate('unit').populate('warehouse')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(query),
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

// @desc    Get single Product
// @route   GET /api/products/:id
// @access  Private
export const getProduct = asyncHandler(async (req, res) => {
  const item = await Product.findById(req.params.id).populate('category').populate('brand').populate('unit').populate('warehouse');
  if (!item) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Product
// @route   POST /api/products
// @access  Private
export const createProduct = asyncHandler(async (req, res) => {
  const item = await Product.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = asyncHandler(async (req, res) => {
  const item = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Product not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
