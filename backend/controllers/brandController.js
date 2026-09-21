import asyncHandler from 'express-async-handler';
import Brand from '../models/Brand.js';

// @desc    Get all Brands (search + pagination)
// @route   GET /api/brands
// @access  Private
export const getBrandList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Brand.find(query)
      
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Brand.countDocuments(query),
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

// @desc    Get single Brand
// @route   GET /api/brands/:id
// @access  Private
export const getBrand = asyncHandler(async (req, res) => {
  const item = await Brand.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Brand not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Brand
// @route   POST /api/brands
// @access  Private
export const createBrand = asyncHandler(async (req, res) => {
  const item = await Brand.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Brand
// @route   PUT /api/brands/:id
// @access  Private
export const updateBrand = asyncHandler(async (req, res) => {
  const item = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Brand not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Brand
// @route   DELETE /api/brands/:id
// @access  Private
export const deleteBrand = asyncHandler(async (req, res) => {
  const item = await Brand.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Brand not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
