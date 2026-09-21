import express from 'express';
import {
  getSalesReturnList,
  getSalesReturn,
  createSalesReturn,
  updateSalesReturn,
  deleteSalesReturn,
} from '../controllers/salesReturnController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getSalesReturnList)
  .post(authorize('admin', 'manager', 'editor'), createSalesReturn);

router
  .route('/:id')
  .get(getSalesReturn)
  .put(authorize('admin', 'manager', 'editor'), updateSalesReturn)
  .delete(authorize('admin', 'manager'), deleteSalesReturn);

export default router;
