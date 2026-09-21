import express from 'express';
import {
  getReceiptList,
  getReceipt,
  createReceipt,
  updateReceipt,
  deleteReceipt,
} from '../controllers/receiptController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getReceiptList)
  .post(authorize('admin', 'manager', 'editor'), createReceipt);

router
  .route('/:id')
  .get(getReceipt)
  .put(authorize('admin', 'manager', 'editor'), updateReceipt)
  .delete(authorize('admin', 'manager'), deleteReceipt);

export default router;
