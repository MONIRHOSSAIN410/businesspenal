import asyncHandler from 'express-async-handler';
import Role from '../models/Role.js';

// @desc    Get all Roles (search + pagination)
// @route   GET /api/roles
// @access  Private
export const getRoleList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Role.find(query)
      
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Role.countDocuments(query),
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

// @desc    Get single Role
// @route   GET /api/roles/:id
// @access  Private
export const getRole = asyncHandler(async (req, res) => {
  const item = await Role.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Role not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Role
// @route   POST /api/roles
// @access  Private
export const createRole = asyncHandler(async (req, res) => {
  const item = await Role.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Role
// @route   PUT /api/roles/:id
// @access  Private
export const updateRole = asyncHandler(async (req, res) => {
  const item = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Role not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Role
// @route   DELETE /api/roles/:id
// @access  Private
export const deleteRole = asyncHandler(async (req, res) => {
  const item = await Role.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Role not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
