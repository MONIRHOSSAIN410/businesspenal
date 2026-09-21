import express from 'express';
import {
  getPaymentMethodList,
  getPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '../controllers/paymentMethodController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getPaymentMethodList)
  .post(authorize('admin', 'manager', 'editor'), createPaymentMethod);

router
  .route('/:id')
  .get(getPaymentMethod)
  .put(authorize('admin', 'manager', 'editor'), updatePaymentMethod)
  .delete(authorize('admin', 'manager'), deletePaymentMethod);

export default router;
