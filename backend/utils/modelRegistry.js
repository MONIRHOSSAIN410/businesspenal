// AUTO-GENERATED (initially) from dev-tools/entityConfig.mjs - registers every
// data model under a stable string key so generic tools (like the Super
// Editor) can look up any collection by name without a giant switch-statement.
import User from '../models/User.js';
import Role from '../models/Role.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Unit from '../models/Unit.js';
import Warehouse from '../models/Warehouse.js';
import Product from '../models/Product.js';
import Account from '../models/Account.js';
import BankAccount from '../models/BankAccount.js';
import PaymentMethod from '../models/PaymentMethod.js';
import OpeningStock from '../models/OpeningStock.js';
import OpeningBalance from '../models/OpeningBalance.js';
import Supplier from '../models/Supplier.js';
import Customer from '../models/Customer.js';
import Employee from '../models/Employee.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Purchase from '../models/Purchase.js';
import PurchaseReturn from '../models/PurchaseReturn.js';
import Payment from '../models/Payment.js';
import Receipt from '../models/Receipt.js';
import JournalEntry from '../models/JournalEntry.js';
import Expense from '../models/Expense.js';
import Quotation from '../models/Quotation.js';
import SalesOrder from '../models/SalesOrder.js';
import SalesReturn from '../models/SalesReturn.js';
import Sale from '../models/Sale.js';
import Damage from '../models/Damage.js';
import StockTransfer from '../models/StockTransfer.js';
import StockAdjustment from '../models/StockAdjustment.js';

export const modelRegistry = {
  users: User,
  roles: Role,
  categories: Category,
  brands: Brand,
  units: Unit,
  warehouses: Warehouse,
  products: Product,
  accounts: Account,
  'bank-accounts': BankAccount,
  'payment-methods': PaymentMethod,
  'opening-stocks': OpeningStock,
  'opening-balances': OpeningBalance,
  suppliers: Supplier,
  customers: Customer,
  employees: Employee,
  'purchase-orders': PurchaseOrder,
  purchases: Purchase,
  'purchase-returns': PurchaseReturn,
  payments: Payment,
  receipts: Receipt,
  'journal-entries': JournalEntry,
  expenses: Expense,
  quotations: Quotation,
  'sales-orders': SalesOrder,
  'sales-returns': SalesReturn,
  sales: Sale,
  damages: Damage,
  'stock-transfers': StockTransfer,
  'stock-adjustments': StockAdjustment,
};

export const getModel = (key) => modelRegistry[key] || null;

export default modelRegistry;
