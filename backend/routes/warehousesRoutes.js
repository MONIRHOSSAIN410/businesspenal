import express from 'express';
import {
  getWarehouseList,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from '../controllers/warehouseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getWarehouseList)
  .post(authorize('admin', 'manager', 'editor'), createWarehouse);

router
  .route('/:id')
  .get(getWarehouse)
  .put(authorize('admin', 'manager', 'editor'), updateWarehouse)
  .delete(authorize('admin', 'manager'), deleteWarehouse);

export default router;
