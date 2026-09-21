import asyncHandler from 'express-async-handler';
import JournalEntry from '../models/JournalEntry.js';

// @desc    Get all Journal Entries (search + pagination)
// @route   GET /api/journal-entries
// @access  Private
export const getJournalEntryList = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.entryNumber = { $regex: search, $options: 'i' };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [items, total] = await Promise.all([
    JournalEntry.find(query)
      .populate('debitAccount').populate('creditAccount')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    JournalEntry.countDocuments(query),
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

// @desc    Get single Journal Entry
// @route   GET /api/journal-entries/:id
// @access  Private
export const getJournalEntry = asyncHandler(async (req, res) => {
  const item = await JournalEntry.findById(req.params.id).populate('debitAccount').populate('creditAccount');
  if (!item) {
    res.status(404);
    throw new Error('Journal Entry not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create Journal Entry
// @route   POST /api/journal-entries
// @access  Private
export const createJournalEntry = asyncHandler(async (req, res) => {
  const item = await JournalEntry.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update Journal Entry
// @route   PUT /api/journal-entries/:id
// @access  Private
export const updateJournalEntry = asyncHandler(async (req, res) => {
  const item = await JournalEntry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('Journal Entry not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Delete Journal Entry
// @route   DELETE /api/journal-entries/:id
// @access  Private
export const deleteJournalEntry = asyncHandler(async (req, res) => {
  const item = await JournalEntry.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Journal Entry not found');
  }
  await item.deleteOne();
  res.json({ success: true, data: {} });
});
