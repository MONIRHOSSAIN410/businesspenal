import express from 'express';
import {
  getSalesOrderList,
  getSalesOrder,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
} from '../controllers/salesOrderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getSalesOrderList)
  .post(authorize('admin', 'manager', 'editor'), createSalesOrder);

router
  .route('/:id')
  .get(getSalesOrder)
  .put(authorize('admin', 'manager', 'editor'), updateSalesOrder)
  .delete(authorize('admin', 'manager'), deleteSalesOrder);

export default router;
