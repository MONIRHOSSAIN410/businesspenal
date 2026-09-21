import express from 'express';
import {
  getPaymentList,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getPaymentList)
  .post(authorize('admin', 'manager', 'editor'), createPayment);

router
  .route('/:id')
  .get(getPayment)
  .put(authorize('admin', 'manager', 'editor'), updatePayment)
  .delete(authorize('admin', 'manager'), deletePayment);

export default router;
