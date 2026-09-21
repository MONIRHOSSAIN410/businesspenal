import express from 'express';
import {
  getBrandList,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getBrandList)
  .post(authorize('admin', 'manager', 'editor'), createBrand);

router
  .route('/:id')
  .get(getBrand)
  .put(authorize('admin', 'manager', 'editor'), updateBrand)
  .delete(authorize('admin', 'manager'), deleteBrand);

export default router;
