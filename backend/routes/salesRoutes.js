import express from 'express';
import {
  getSaleList,
  getSale,
  createSale,
  updateSale,
  deleteSale,
} from '../controllers/saleController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getSaleList)
  .post(authorize('admin', 'manager', 'editor'), createSale);

router
  .route('/:id')
  .get(getSale)
  .put(authorize('admin', 'manager', 'editor'), updateSale)
  .delete(authorize('admin', 'manager'), deleteSale);

export default router;
