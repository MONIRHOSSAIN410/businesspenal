import express from 'express';
import {
  getCustomerList,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCustomerList)
  .post(authorize('admin', 'manager', 'editor'), createCustomer);

router
  .route('/:id')
  .get(getCustomer)
  .put(authorize('admin', 'manager', 'editor'), updateCustomer)
  .delete(authorize('admin', 'manager'), deleteCustomer);

export default router;
