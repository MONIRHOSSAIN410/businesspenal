import express from 'express';
import {
  listCollections,
  getCollectionRecords,
  updateCollectionRecord,
  deleteCollectionRecord,
  bulkDeleteRecords,
} from '../controllers/superEditorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Super Editor is a powerful, raw-data tool - admin role only.
router.use(protect, authorize('admin'));

router.get('/collections', listCollections);
router.get('/:collection', getCollectionRecords);
router.put('/:collection/:id', updateCollectionRecord);
router.delete('/:collection/:id', deleteCollectionRecord);
router.post('/:collection/bulk-delete', bulkDeleteRecords);

export default router;
