// Sidebar navigation structure. Mirrors the legacy "Software Panel" layout
// from the screenshot (User Settings, Product Setting, Accounts Setting,
// Opening, Purchase, Lists, Transactions, Advanced Sales, Sales, Damages,
// Stock, Super Editor, Reports) rebuilt as a modern React SPA: each entry
// below is a real, working route wired to the backend API - nothing here is
// a placeholder link.
import {
  FiGrid,
  FiUsers,
  FiBox,
  FiCreditCard,
  FiLogIn,
  FiShoppingBag,
  FiList,
  FiRepeat,
  FiTrendingUp,
  FiShoppingCart,
  FiAlertTriangle,
  FiPackage,
  FiTool,
  FiBarChart2,
} from 'react-icons/fi';

export const menu = [
  { label: 'Dashboard', icon: FiGrid, path: '/' },
  {
    label: 'User Settings',
    icon: FiUsers,
    roles: ['admin', 'manager'],
    children: [
      { label: 'Users', path: '/user-settings/users' },
      { label: 'Roles & Permissions', path: '/user-settings/roles' },
      { label: 'My Profile', path: '/user-settings/profile', roles: ['admin', 'manager', 'editor', 'viewer'] },
    ],
  },
  {
    label: 'Product Setting',
    icon: FiBox,
    children: [
      { label: 'Categories', path: '/product-setting/categories' },
      { label: 'Brands', path: '/product-setting/brands' },
      { label: 'Units', path: '/product-setting/units' },
      { label: 'Warehouses', path: '/product-setting/warehouses' },
      { label: 'Products', path: '/product-setting/products' },
    ],
  },
  {
    label: 'Accounts Setting',
    icon: FiCreditCard,
    children: [
      { label: 'Accounts', path: '/accounts-setting/accounts' },
      { label: 'Bank Accounts', path: '/accounts-setting/bank-accounts' },
      { label: 'Payment Methods', path: '/accounts-setting/payment-methods' },
    ],
  },
  {
    label: 'Opening',
    icon: FiLogIn,
    children: [
      { label: 'Opening Stock', path: '/opening/opening-stocks' },
      { label: 'Opening Balance', path: '/opening/opening-balances' },
    ],
  },
  {
    label: 'Purchase',
    icon: FiShoppingBag,
    children: [
      { label: 'Purchase Orders', path: '/purchase/purchase-orders' },
      { label: 'Purchases', path: '/purchase/purchases' },
      { label: 'Purchase Returns', path: '/purchase/purchase-returns' },
    ],
  },
  {
    label: 'Lists',
    icon: FiList,
    children: [
      { label: 'Suppliers', path: '/lists/suppliers' },
      { label: 'Customers', path: '/lists/customers' },
      { label: 'Employees', path: '/lists/employees' },
    ],
  },
  {
    label: 'Transactions',
    icon: FiRepeat,
    children: [
      { label: 'Payments', path: '/transactions/payments' },
      { label: 'Receipts', path: '/transactions/receipts' },
      { label: 'Journal Entries', path: '/transactions/journal-entries' },
      { label: 'Expenses', path: '/transactions/expenses' },
    ],
  },
  {
    label: 'Advanced Sales',
    icon: FiTrendingUp,
    children: [
      { label: 'Quotations', path: '/advanced-sales/quotations' },
      { label: 'Sales Orders', path: '/advanced-sales/sales-orders' },
      { label: 'Sales Returns', path: '/advanced-sales/sales-returns' },
    ],
  },
  {
    label: 'Sales',
    icon: FiShoppingCart,
    children: [
      { label: 'New Sale (POS)', path: '/sales/pos' },
      { label: 'Sales List', path: '/sales/sales-list' },
    ],
  },
  {
    label: 'Damages',
    icon: FiAlertTriangle,
    children: [{ label: 'Damages', path: '/damages/damages' }],
  },
  {
    label: 'Stock',
    icon: FiPackage,
    children: [
      { label: 'Stock Overview', path: '/stock/overview' },
      { label: 'Stock Transfers', path: '/stock/stock-transfers' },
      { label: 'Stock Adjustments', path: '/stock/stock-adjustments' },
    ],
  },
  {
    label: 'Super Editor',
    icon: FiTool,
    path: '/super-editor',
    roles: ['admin'],
    restricted: true,
  },
  { label: 'Reports', icon: FiBarChart2, path: '/reports' },
];

export default menu;
