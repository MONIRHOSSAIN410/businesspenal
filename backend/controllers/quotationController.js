import asyncHandler from 'express-async-handler';
import Quotation from '../models/Quotation.js';

// @desc    Get all Quotations (search + pagination)
// @route   GET /api/quotations
// @access  Private
export const getQuotationList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.quoteNumber = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Quotation.find(query)
      .populate('customer')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Quotation.countDocuments(query),
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

// @desc    Get single Quotation
// @route   GET /api/quotations/:id
// @access  Private
export const getQuotation = asyncHandler(async (req, res) => {
  const item = await Quotation.findById(req.params.id).populate('customer');
  if (!item) {
    res.status(404);
    throw new Error('Quotation not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Quotation
// @route   POST /api/quotations
// @access  Private
export const createQuotation = asyncHandler(async (req, res) => {
  const item = await Quotation.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Quotation
// @route   PUT /api/quotations/:id
// @access  Private
export const updateQuotation = asyncHandler(async (req, res) => {
  const item = await Quotation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Quotation not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Quotation
// @route   DELETE /api/quotations/:id
// @access  Private
export const deleteQuotation = asyncHandler(async (req, res) => {
  const item = await Quotation.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Quotation not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
