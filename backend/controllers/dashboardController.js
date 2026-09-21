import asyncHandler from 'express-async-handler';
import Sale from '../models/Sale.js';
import Purchase from '../models/Purchase.js';
import Receipt from '../models/Receipt.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import Damage from '../models/Damage.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import User from '../models/User.js';

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfMonth = () => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const sumField = async (Model, field, match = {}) => {
  const result = await Model.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: `$${field}` }, count: { $sum: 1 } } },
  ]);
  return result[0] || { total: 0, count: 0 };
};

// @desc    Get dashboard summary stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  const today = startOfToday();

  const [
    salesToday,
    purchaseToday,
    cashInToday,
    cashOutToday,
    totalProducts,
    lowStockCount,
    totalCustomers,
    totalSuppliers,
    activeUsers,
    recentSales,
  ] = await Promise.all([
    sumField(Sale, 'totalAmount', { saleDate: { $gte: today } }),
    sumField(Purchase, 'totalAmount', { purchaseDate: { $gte: today } }),
    sumField(Receipt, 'amount', { date: { $gte: today } }),
    sumField(Payment, 'amount', { date: { $gte: today } }),
    Product.countDocuments(),
    Product.countDocuments({ $expr: { $lte: ['$stockQty', '$reorderLevel'] } }),
    Customer.countDocuments(),
    Supplier.countDocuments(),
    User.find({ status: 'active' }).select('name email role lastLogin').sort({ lastLogin: -1 }).limit(5),
    Sale.find().sort({ createdAt: -1 }).limit(5).populate('customer', 'name'),
  ]);

  res.json({
    success: true,
    data: {
      salesToday: { amount: salesToday.total, count: salesToday.count },
      purchaseToday: { amount: purchaseToday.total, count: purchaseToday.count },
      cashInToday: cashInToday.total,
      cashOutToday: cashOutToday.total,
      totalProducts,
      lowStockCount,
      totalCustomers,
      totalSuppliers,
      activeUsers,
      recentSales,
      logTime: new Date(),
    },
  });
});

// @desc    Sales report (grouped by day, last 30 days by default)
// @route   GET /api/dashboard/reports/sales
// @access  Private
export const getSalesReport = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const match = {};
  if (from || to) {
    match.saleDate = {};
    if (from) match.saleDate.$gte = new Date(from);
    if (to) match.saleDate.$lte = new Date(to);
  } else {
    match.saleDate = { $gte: startOfMonth() };
  }

  const grouped = await Sale.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$saleDate' } },
        totalSales: { $sum: '$totalAmount' },
        totalDue: { $sum: '$dueAmount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const summary = await sumField(Sale, 'totalAmount', match);

  res.json({ success: true, data: { grouped, summary } });
});

// @desc    Purchase report (grouped by day)
// @route   GET /api/dashboard/reports/purchases
// @access  Private
export const getPurchaseReport = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const match = {};
  if (from || to) {
    match.purchaseDate = {};
    if (from) match.purchaseDate.$gte = new Date(from);
    if (to) match.purchaseDate.$lte = new Date(to);
  } else {
    match.purchaseDate = { $gte: startOfMonth() };
  }

  const grouped = await Purchase.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$purchaseDate' } },
        totalPurchase: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const summary = await sumField(Purchase, 'totalAmount', match);

  res.json({ success: true, data: { grouped, summary } });
});

// @desc    Stock report - current stock levels across products
// @route   GET /api/dashboard/reports/stock
// @access  Private
export const getStockReport = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate('category', 'name')
    .populate('brand', 'name')
    .populate('warehouse', 'name')
    .sort({ stockQty: 1 });

  const totalStockValue = products.reduce(
    (sum, p) => sum + p.stockQty * p.purchasePrice,
    0
  );
  const lowStock = products.filter((p) => p.stockQty <= p.reorderLevel);

  res.json({
    success: true,
    data: { products, totalStockValue, lowStock },
  });
});

// @desc    Profit & Loss report (simple: sales - purchases - expenses - damages)
// @route   GET /api/dashboard/reports/profit-loss
// @access  Private
export const getProfitLossReport = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const dateMatch = {};
  if (from) dateMatch.$gte = new Date(from);
  if (to) dateMatch.$lte = new Date(to);
  const range = Object.keys(dateMatch).length ? dateMatch : { $gte: startOfMonth() };

  const [sales, purchases, damages] = await Promise.all([
    sumField(Sale, 'totalAmount', { saleDate: range }),
    sumField(Purchase, 'totalAmount', { purchaseDate: range }),
    sumField(Damage, 'lossAmount', { date: range }),
  ]);

  const revenue = sales.total;
  const cost = purchases.total + damages.total;
  const profit = revenue - cost;

  res.json({
    success: true,
    data: {
      revenue,
      costOfGoods: purchases.total,
      damageLoss: damages.total,
      profit,
      margin: revenue > 0 ? Number(((profit / revenue) * 100).toFixed(2)) : 0,
    },
  });
});

// @desc    Damage report
// @route   GET /api/dashboard/reports/damages
// @access  Private
export const getDamageReport = asyncHandler(async (req, res) => {
  const damages = await Damage.find()
    .populate('product', 'name sku')
    .populate('warehouse', 'name')
    .sort({ date: -1 });

  const totalLoss = damages.reduce((sum, d) => sum + (d.lossAmount || 0), 0);

  res.json({ success: true, data: { damages, totalLoss } });
});
