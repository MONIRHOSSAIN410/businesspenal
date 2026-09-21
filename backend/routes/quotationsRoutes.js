import express from 'express';
import {
  getQuotationList,
  getQuotation,
  createQuotation,
  updateQuotation,
  deleteQuotation,
} from '../controllers/quotationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getQuotationList)
  .post(authorize('admin', 'manager', 'editor'), createQuotation);

router
  .route('/:id')
  .get(getQuotation)
  .put(authorize('admin', 'manager', 'editor'), updateQuotation)
  .delete(authorize('admin', 'manager'), deleteQuotation);

export default router;
