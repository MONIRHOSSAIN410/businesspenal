import express from 'express';
import {
  getStockAdjustmentList,
  getStockAdjustment,
  createStockAdjustment,
  updateStockAdjustment,
  deleteStockAdjustment,
} from '../controllers/stockAdjustmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getStockAdjustmentList)
  .post(authorize('admin', 'manager', 'editor'), createStockAdjustment);

router
  .route('/:id')
  .get(getStockAdjustment)
  .put(authorize('admin', 'manager', 'editor'), updateStockAdjustment)
  .delete(authorize('admin', 'manager'), deleteStockAdjustment);

export default router;
