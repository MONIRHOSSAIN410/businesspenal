import express from 'express';
import {
  getPurchaseReturnList,
  getPurchaseReturn,
  createPurchaseReturn,
  updatePurchaseReturn,
  deletePurchaseReturn,
} from '../controllers/purchaseReturnController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getPurchaseReturnList)
  .post(authorize('admin', 'manager', 'editor'), createPurchaseReturn);

router
  .route('/:id')
  .get(getPurchaseReturn)
  .put(authorize('admin', 'manager', 'editor'), updatePurchaseReturn)
  .delete(authorize('admin', 'manager'), deletePurchaseReturn);

export default router;
