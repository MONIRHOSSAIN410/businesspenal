import express from 'express';
import {
  getOpeningStockList,
  getOpeningStock,
  createOpeningStock,
  updateOpeningStock,
  deleteOpeningStock,
} from '../controllers/openingStockController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getOpeningStockList)
  .post(authorize('admin', 'manager', 'editor'), createOpeningStock);

router
  .route('/:id')
  .get(getOpeningStock)
  .put(authorize('admin', 'manager', 'editor'), updateOpeningStock)
  .delete(authorize('admin', 'manager'), deleteOpeningStock);

export default router;
