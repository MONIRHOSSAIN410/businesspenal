import express from 'express';
import {
  getAccountList,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
} from '../controllers/accountController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getAccountList)
  .post(authorize('admin', 'manager', 'editor'), createAccount);

router
  .route('/:id')
  .get(getAccount)
  .put(authorize('admin', 'manager', 'editor'), updateAccount)
  .delete(authorize('admin', 'manager'), deleteAccount);

export default router;
