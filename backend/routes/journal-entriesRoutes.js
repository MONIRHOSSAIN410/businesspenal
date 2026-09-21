import express from 'express';
import {
  getJournalEntryList,
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '../controllers/journalEntryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getJournalEntryList)
  .post(authorize('admin', 'manager', 'editor'), createJournalEntry);

router
  .route('/:id')
  .get(getJournalEntry)
  .put(authorize('admin', 'manager', 'editor'), updateJournalEntry)
  .delete(authorize('admin', 'manager'), deleteJournalEntry);

export default router;
