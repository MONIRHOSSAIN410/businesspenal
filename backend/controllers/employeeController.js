import asyncHandler from 'express-async-handler';
import Employee from '../models/Employee.js';

// @desc    Get all Employees (search + pagination)
// @route   GET /api/employees
// @access  Private
export const getEmployeeList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    Employee.find(query)
      
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Employee.countDocuments(query),
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

// @desc    Get single Employee
// @route   GET /api/employees/:id
// @access  Private
export const getEmployee = asyncHandler(async (req, res) => {
  const item = await Employee.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Employee not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Employee
// @route   POST /api/employees
// @access  Private
export const createEmployee = asyncHandler(async (req, res) => {
  const item = await Employee.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Employee
// @route   PUT /api/employees/:id
// @access  Private
export const updateEmployee = asyncHandler(async (req, res) => {
  const item = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Employee not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Employee
// @route   DELETE /api/employees/:id
// @access  Private
export const deleteEmployee = asyncHandler(async (req, res) => {
  const item = await Employee.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Employee not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
