import express from 'express';
import {
  getSupplierList,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getSupplierList)
  .post(authorize('admin', 'manager', 'editor'), createSupplier);

router
  .route('/:id')
  .get(getSupplier)
  .put(authorize('admin', 'manager', 'editor'), updateSupplier)
  .delete(authorize('admin', 'manager'), deleteSupplier);

export default router;
