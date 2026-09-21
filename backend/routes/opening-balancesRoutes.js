import express from 'express';
import {
  getOpeningBalanceList,
  getOpeningBalance,
  createOpeningBalance,
  updateOpeningBalance,
  deleteOpeningBalance,
} from '../controllers/openingBalanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getOpeningBalanceList)
  .post(authorize('admin', 'manager', 'editor'), createOpeningBalance);

router
  .route('/:id')
  .get(getOpeningBalance)
  .put(authorize('admin', 'manager', 'editor'), updateOpeningBalance)
  .delete(authorize('admin', 'manager'), deleteOpeningBalance);

export default router;
