import express from 'express';
import {
  getPurchaseList,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
} from '../controllers/purchaseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getPurchaseList)
  .post(authorize('admin', 'manager', 'editor'), createPurchase);

router
  .route('/:id')
  .get(getPurchase)
  .put(authorize('admin', 'manager', 'editor'), updatePurchase)
  .delete(authorize('admin', 'manager'), deletePurchase);

export default router;
