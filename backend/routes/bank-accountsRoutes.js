import express from 'express';
import {
  getBankAccountList,
  getBankAccount,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
} from '../controllers/bankAccountController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getBankAccountList)
  .post(authorize('admin', 'manager', 'editor'), createBankAccount);

router
  .route('/:id')
  .get(getBankAccount)
  .put(authorize('admin', 'manager', 'editor'), updateBankAccount)
  .delete(authorize('admin', 'manager'), deleteBankAccount);

export default router;
