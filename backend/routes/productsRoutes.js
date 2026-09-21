import express from 'express';
import {
  getProductList,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getProductList)
  .post(authorize('admin', 'manager', 'editor'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(authorize('admin', 'manager', 'editor'), updateProduct)
  .delete(authorize('admin', 'manager'), deleteProduct);

export default router;
