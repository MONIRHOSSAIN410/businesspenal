import express from 'express';
import {
  getCategoryList,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCategoryList)
  .post(authorize('admin', 'manager', 'editor'), createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(authorize('admin', 'manager', 'editor'), updateCategory)
  .delete(authorize('admin', 'manager'), deleteCategory);

export default router;
