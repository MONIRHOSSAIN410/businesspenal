import express from 'express';
import {
  getStockTransferList,
  getStockTransfer,
  createStockTransfer,
  updateStockTransfer,
  deleteStockTransfer,
} from '../controllers/stockTransferController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getStockTransferList)
  .post(authorize('admin', 'manager', 'editor'), createStockTransfer);

router
  .route('/:id')
  .get(getStockTransfer)
  .put(authorize('admin', 'manager', 'editor'), updateStockTransfer)
  .delete(authorize('admin', 'manager'), deleteStockTransfer);

export default router;
