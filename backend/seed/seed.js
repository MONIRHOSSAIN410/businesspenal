// Seeds a minimal but useful set of demo data so the app is not empty on
// first run. Run with:  npm run seed   (after MONGO_URI is configured)
import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Unit from '../models/Unit.js';
import Warehouse from '../models/Warehouse.js';
import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';
import Customer from '../models/Customer.js';
import PaymentMethod from '../models/PaymentMethod.js';
import Account from '../models/Account.js';

const run = async () => {
  await connectDB();

  const adminExists = await User.findOne({ email: 'admin@businesspanel.com' });
  if (!adminExists) {
    await User.create({
      name: 'Admin User',
      email: 'admin@businesspanel.com',
      password: 'Admin@123',
      role: 'admin',
      status: 'active',
    });
    console.log('Created admin user -> admin@businesspanel.com / Admin@123');
  } else {
    console.log('Admin user already exists, skipping');
  }

  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Groceries', description: 'Daily grocery items' },
      { name: 'Garments', description: 'Clothing and fashion' },
      { name: 'Stationery', description: 'Office and school supplies' },
    ]);

    const brands = await Brand.insertMany([
      { name: 'Generic' },
      { name: 'Samsung' },
      { name: 'Walton' },
      { name: 'Pran' },
    ]);

    const units = await Unit.insertMany([
      { name: 'Piece', shortName: 'pcs' },
      { name: 'Kilogram', shortName: 'kg' },
      { name: 'Box', shortName: 'box' },
      { name: 'Liter', shortName: 'ltr' },
    ]);

    const warehouses = await Warehouse.insertMany([
      { name: 'Main Warehouse', location: 'Dhaka' },
      { name: 'Chattogram Branch', location: 'Chattogram' },
    ]);

    await Product.insertMany([
      {
        name: 'LED Bulb 9W',
        sku: 'ELEC-001',
        category: categories[0]._id,
        brand: brands[1]._id,
        unit: units[0]._id,
        warehouse: warehouses[0]._id,
        purchasePrice: 80,
        salePrice: 120,
        stockQty: 250,
        reorderLevel: 30,
        status: 'active',
      },
      {
        name: 'Rice - Miniket (per kg)',
        sku: 'GROC-001',
        category: categories[1]._id,
        brand: brands[0]._id,
        unit: units[1]._id,
        warehouse: warehouses[0]._id,
        purchasePrice: 60,
        salePrice: 72,
        stockQty: 500,
        reorderLevel: 50,
        status: 'active',
      },
      {
        name: 'Cotton T-Shirt',
        sku: 'GARM-001',
        category: categories[2]._id,
        brand: brands[0]._id,
        unit: units[0]._id,
        warehouse: warehouses[1]._id,
        purchasePrice: 250,
        salePrice: 399,
        stockQty: 18,
        reorderLevel: 20,
        status: 'active',
      },
    ]);

    console.log('Seeded categories, brands, units, warehouses and products');
  }

  const supplierCount = await Supplier.countDocuments();
  if (supplierCount === 0) {
    await Supplier.insertMany([
      { name: 'ABC Traders', company: 'ABC Traders Ltd.', phone: '01700000001', status: 'active' },
      { name: 'City Wholesale', company: 'City Wholesale', phone: '01700000002', status: 'active' },
    ]);
  }

  const customerCount = await Customer.countDocuments();
  if (customerCount === 0) {
    await Customer.insertMany([
      { name: 'Walk-in Customer', phone: '', status: 'active' },
      { name: 'Rahim Store', phone: '01800000001', status: 'active' },
    ]);
  }

  const pmCount = await PaymentMethod.countDocuments();
  if (pmCount === 0) {
    await PaymentMethod.insertMany([
      { name: 'Cash', type: 'Cash' },
      { name: 'bKash', type: 'Mobile Banking' },
      { name: 'Bank Transfer', type: 'Bank' },
    ]);
  }

  const accountCount = await Account.countDocuments();
  if (accountCount === 0) {
    await Account.insertMany([
      { name: 'Cash in Hand', accountType: 'Asset', openingBalance: 50000, currentBalance: 50000 },
      { name: 'Sales Revenue', accountType: 'Income' },
      { name: 'Purchase Expense', accountType: 'Expense' },
    ]);
  }

  console.log('Seeding complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
