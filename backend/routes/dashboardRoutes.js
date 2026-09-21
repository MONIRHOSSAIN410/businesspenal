import express from 'express';
import {
  getDashboardStats,
  getSalesReport,
  getPurchaseReport,
  getStockReport,
  getProfitLossReport,
  getDamageReport,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/reports/sales', getSalesReport);
router.get('/reports/purchases', getPurchaseReport);
router.get('/reports/stock', getStockReport);
router.get('/reports/profit-loss', getProfitLossReport);
router.get('/reports/damages', getDamageReport);

export default router;
