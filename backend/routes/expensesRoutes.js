import express from 'express';
import {
  getExpenseList,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getExpenseList)
  .post(authorize('admin', 'manager', 'editor'), createExpense);

router
  .route('/:id')
  .get(getExpense)
  .put(authorize('admin', 'manager', 'editor'), updateExpense)
  .delete(authorize('admin', 'manager'), deleteExpense);

export default router;
