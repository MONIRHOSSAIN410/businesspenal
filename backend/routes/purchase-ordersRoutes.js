import express from 'express';
import {
  getPurchaseOrderList,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from '../controllers/purchaseOrderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getPurchaseOrderList)
  .post(authorize('admin', 'manager', 'editor'), createPurchaseOrder);

router
  .route('/:id')
  .get(getPurchaseOrder)
  .put(authorize('admin', 'manager', 'editor'), updatePurchaseOrder)
  .delete(authorize('admin', 'manager'), deletePurchaseOrder);

export default router;
