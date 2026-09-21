import asyncHandler from 'express-async-handler';
import modelRegistry, { getModel } from '../utils/modelRegistry.js';

// @desc    List every collection name available to the Super Editor
// @route   GET /api/super-editor/collections
// @access  Private/Admin
export const listCollections = asyncHandler(async (req, res) => {
  const collections = await Promise.all(
    Object.keys(modelRegistry).map(async (key) => ({
      key,
      count: await modelRegistry[key].countDocuments(),
    }))
  );
  res.json({ success: true, data: collections });
});

// @desc    Get raw records for a given collection (with pagination/search)
// @route   GET /api/super-editor/:collection
// @access  Private/Admin
export const getCollectionRecords = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.collection);
  if (!Model) {
    res.status(404);
    throw new Error(`Unknown collection: ${req.params.collection}`);
  }

  const { page = 1, limit = 25 } = req.query;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 25;

  const [items, total] = await Promise.all([
    Model.find()
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    Model.countDocuments(),
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

// @desc    Raw update of any document in any collection (bypasses normal
//          per-module controllers - use with care, admin-only)
// @route   PUT /api/super-editor/:collection/:id
// @access  Private/Admin
export const updateCollectionRecord = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.collection);
  if (!Model) {
    res.status(404);
    throw new Error(`Unknown collection: ${req.params.collection}`);
  }

  const body = { ...req.body };
  delete body._id;
  delete body.__v;

  const item = await Model.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Record not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Raw delete of any document in any collection
// @route   DELETE /api/super-editor/:collection/:id
// @access  Private/Admin
export const deleteCollectionRecord = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.collection);
  if (!Model) {
    res.status(404);
    throw new Error(`Unknown collection: ${req.params.collection}`);
  }

  const item = await Model.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Record not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});

// @desc    Bulk delete records by id array
// @route   POST /api/super-editor/:collection/bulk-delete
// @access  Private/Admin
export const bulkDeleteRecords = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.collection);
  if (!Model) {
    res.status(404);
    throw new Error(`Unknown collection: ${req.params.collection}`);
  }
  const { ids = [] } = req.body;
  const result = await Model.deleteMany({ _id: { $in: ids } });
  res.json({ success: true, data: { deletedCount: result.deletedCount } });
});
