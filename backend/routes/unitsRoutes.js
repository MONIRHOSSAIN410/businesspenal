import express from 'express';
import {
  getUnitList,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
} from '../controllers/unitController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getUnitList)
  .post(authorize('admin', 'manager', 'editor'), createUnit);

router
  .route('/:id')
  .get(getUnit)
  .put(authorize('admin', 'manager', 'editor'), updateUnit)
  .delete(authorize('admin', 'manager'), deleteUnit);

export default router;
