import asyncHandler from 'express-async-handler';
import Warehouse from '../models/Warehouse.js';

// @desc    Get all Warehouses (search + pagination)
// @route   GET /api/warehouses
// @access  Private
export const getWarehouseList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Warehouse.find(query)
      
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Warehouse.countDocuments(query),
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

// @desc    Get single Warehouse
// @route   GET /api/warehouses/:id
// @access  Private
export const getWarehouse = asyncHandler(async (req, res) => {
  const item = await Warehouse.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Warehouse not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Warehouse
// @route   POST /api/warehouses
// @access  Private
export const createWarehouse = asyncHandler(async (req, res) => {
  const item = await Warehouse.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Warehouse
// @route   PUT /api/warehouses/:id
// @access  Private
export const updateWarehouse = asyncHandler(async (req, res) => {
  const item = await Warehouse.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Warehouse not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Warehouse
// @route   DELETE /api/warehouses/:id
// @access  Private
export const deleteWarehouse = asyncHandler(async (req, res) => {
  const item = await Warehouse.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Warehouse not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
