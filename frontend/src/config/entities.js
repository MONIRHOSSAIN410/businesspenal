// ============================================================================
// Single source of truth for every generic CRUD page in the app. Each key
// matches the backend route (backend/routes/<key>Routes.js -> /api/<key>).
// `columns`   -> what the table shows
// `fields`    -> the add/edit modal form (simple documents)
// `hasItems`  -> true for "document" style records (purchase/sale/quotation
//                etc.) that carry a repeatable product line-items table,
//                handled by <ItemsEditor /> instead of plain fields.
// ============================================================================

export const entities = {
  roles: {
    title: 'Roles & Permissions',
    endpoint: 'roles',
    idField: '_id',
    columns: [
      { key: 'name', label: 'Role Name' },
      { key: 'description', label: 'Description' },
      { key: 'permissions', label: 'Permissions', render: (r) => (r.permissions || []).join(', ') || '—' },
    ],
    fields: [
      { name: 'name', label: 'Role Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      {
        name: 'permissions',
        label: 'Permissions (comma separated)',
        type: 'tags',
        placeholder: 'products, sales, purchases',
      },
    ],
  },

  categories: {
    title: 'Categories',
    endpoint: 'categories',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
    ],
    fields: [
      { name: 'name', label: 'Category Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },

  brands: {
    title: 'Brands',
    endpoint: 'brands',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
    ],
    fields: [
      { name: 'name', label: 'Brand Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },

  units: {
    title: 'Units',
    endpoint: 'units',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'shortName', label: 'Short Name' },
    ],
    fields: [
      { name: 'name', label: 'Unit Name', type: 'text', required: true },
      { name: 'shortName', label: 'Short Name', type: 'text', placeholder: 'pcs, kg, box' },
    ],
  },

  warehouses: {
    title: 'Warehouses',
    endpoint: 'warehouses',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'location', label: 'Location' },
      { key: 'phone', label: 'Phone' },
    ],
    fields: [
      { name: 'name', label: 'Warehouse Name', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
    ],
  },

  products: {
    title: 'Products',
    endpoint: 'products',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'sku', label: 'SKU' },
      { key: 'category', label: 'Category', render: (r) => r.category?.name || '—' },
      { key: 'brand', label: 'Brand', render: (r) => r.brand?.name || '—' },
      { key: 'salePrice', label: 'Sale Price', render: (r) => `৳${Number(r.salePrice || 0).toLocaleString()}` },
      { key: 'stockQty', label: 'Stock', render: (r) => (
          r.stockQty <= r.reorderLevel
            ? { badge: 'red', text: r.stockQty }
            : { badge: 'green', text: r.stockQty }
        ) },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { name: 'name', label: 'Product Name', type: 'text', required: true },
      { name: 'sku', label: 'SKU', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'ref-select', refEndpoint: 'categories' },
      { name: 'brand', label: 'Brand', type: 'ref-select', refEndpoint: 'brands' },
      { name: 'unit', label: 'Unit', type: 'ref-select', refEndpoint: 'units' },
      { name: 'warehouse', label: 'Warehouse', type: 'ref-select', refEndpoint: 'warehouses' },
      { name: 'purchasePrice', label: 'Purchase Price', type: 'number' },
      { name: 'salePrice', label: 'Sale Price', type: 'number' },
      { name: 'stockQty', label: 'Stock Quantity', type: 'number' },
      { name: 'reorderLevel', label: 'Reorder Level', type: 'number' },
      { name: 'image', label: 'Image URL', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
    ],
  },

  accounts: {
    title: 'Accounts (Chart of Accounts)',
    endpoint: 'accounts',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'accountType', label: 'Type' },
      { key: 'openingBalance', label: 'Opening Balance', render: (r) => `৳${Number(r.openingBalance || 0).toLocaleString()}` },
      { key: 'currentBalance', label: 'Current Balance', render: (r) => `৳${Number(r.currentBalance || 0).toLocaleString()}` },
    ],
    fields: [
      { name: 'name', label: 'Account Name', type: 'text', required: true },
      { name: 'accountType', label: 'Account Type', type: 'select', options: ['Asset', 'Liability', 'Equity', 'Income', 'Expense'] },
      { name: 'openingBalance', label: 'Opening Balance', type: 'number' },
      { name: 'currentBalance', label: 'Current Balance', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },

  'bank-accounts': {
    title: 'Bank Accounts',
    endpoint: 'bank-accounts',
    columns: [
      { key: 'bankName', label: 'Bank' },
      { key: 'accountName', label: 'Account Name' },
      { key: 'accountNumber', label: 'Account No.' },
      { key: 'currentBalance', label: 'Balance', render: (r) => `৳${Number(r.currentBalance || 0).toLocaleString()}` },
    ],
    fields: [
      { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
      { name: 'accountName', label: 'Account Name', type: 'text', required: true },
      { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
      { name: 'branch', label: 'Branch', type: 'text' },
      { name: 'openingBalance', label: 'Opening Balance', type: 'number' },
      { name: 'currentBalance', label: 'Current Balance', type: 'number' },
    ],
  },

  'payment-methods': {
    title: 'Payment Methods',
    endpoint: 'payment-methods',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'type', label: 'Type' },
    ],
    fields: [
      { name: 'name', label: 'Method Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['Cash', 'Bank', 'Mobile Banking', 'Card', 'Other'] },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },

  'opening-stocks': {
    title: 'Opening Stock',
    endpoint: 'opening-stocks',
    columns: [
      { key: 'product', label: 'Product', render: (r) => r.product?.name || '—' },
      { key: 'warehouse', label: 'Warehouse', render: (r) => r.warehouse?.name || '—' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'unitCost', label: 'Unit Cost', render: (r) => `৳${Number(r.unitCost || 0).toLocaleString()}` },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    fields: [
      { name: 'product', label: 'Product', type: 'ref-select', refEndpoint: 'products', required: true },
      { name: 'warehouse', label: 'Warehouse', type: 'ref-select', refEndpoint: 'warehouses' },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'unitCost', label: 'Unit Cost', type: 'number' },
      { name: 'date', label: 'Date', type: 'date' },
    ],
  },

  'opening-balances': {
    title: 'Opening Balance',
    endpoint: 'opening-balances',
    columns: [
      { key: 'account', label: 'Account', render: (r) => r.account?.name || '—' },
      { key: 'type', label: 'Type' },
      { key: 'amount', label: 'Amount', render: (r) => `৳${Number(r.amount || 0).toLocaleString()}` },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    fields: [
      { name: 'account', label: 'Account', type: 'ref-select', refEndpoint: 'accounts', required: true },
      { name: 'amount', label: 'Amount', type: 'number', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['Debit', 'Credit'] },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'note', label: 'Note', type: 'textarea' },
    ],
  },

  suppliers: {
    title: 'Suppliers',
    endpoint: 'suppliers',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'company', label: 'Company' },
      { key: 'phone', label: 'Phone' },
      { key: 'openingBalance', label: 'Opening Balance', render: (r) => `৳${Number(r.openingBalance || 0).toLocaleString()}` },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { name: 'name', label: 'Supplier Name', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'address', label: 'Address', type: 'textarea' },
      { name: 'openingBalance', label: 'Opening Balance', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
    ],
  },

  customers: {
    title: 'Customers',
    endpoint: 'customers',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'openingBalance', label: 'Opening Balance', render: (r) => `৳${Number(r.openingBalance || 0).toLocaleString()}` },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { name: 'name', label: 'Customer Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'address', label: 'Address', type: 'textarea' },
      { name: 'openingBalance', label: 'Opening Balance', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
    ],
  },

  employees: {
    title: 'Employees',
    endpoint: 'employees',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'designation', label: 'Designation' },
      { key: 'phone', label: 'Phone' },
      { key: 'salary', label: 'Salary', render: (r) => `৳${Number(r.salary || 0).toLocaleString()}` },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { name: 'name', label: 'Employee Name', type: 'text', required: true },
      { name: 'designation', label: 'Designation', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'address', label: 'Address', type: 'textarea' },
      { name: 'salary', label: 'Salary', type: 'number' },
      { name: 'joiningDate', label: 'Joining Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
    ],
  },

  'purchase-orders': {
    title: 'Purchase Orders',
    endpoint: 'purchase-orders',
    hasItems: true,
    priceField: 'unitCost',
    columns: [
      { key: 'poNumber', label: 'PO Number' },
      { key: 'supplier', label: 'Supplier', render: (r) => r.supplier?.name || '—' },
      { key: 'orderDate', label: 'Order Date', type: 'date' },
      { key: 'totalAmount', label: 'Total', render: (r) => `৳${Number(r.totalAmount || 0).toLocaleString()}` },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { name: 'poNumber', label: 'PO Number', type: 'text', required: true, auto: 'PO' },
      { name: 'supplier', label: 'Supplier', type: 'ref-select', refEndpoint: 'suppliers', required: true },
      { name: 'orderDate', label: 'Order Date', type: 'date' },
      { name: 'expectedDate', label: 'Expected Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Received', 'Cancelled'] },
      { name: 'note', label: 'Note', type: 'textarea' },
    ],
  },

  purchases: {
    title: 'Purchases',
    endpoint: 'purchases',
    hasItems: true,
    priceField: 'unitCost',
    updatesStock: 'increase',
    columns: [
      { key: 'invoiceNumber', label: 'Invoice #' },
      { key: 'supplier', label: 'Supplier', render: (r) => r.supplier?.name || '—' },
      { key: 'purchaseDate', label: 'Date', type: 'date' },
      { key: 'totalAmount', label: 'Total', render: (r) => `৳${Number(r.totalAmount || 0).toLocaleString()}` },
      { key: 'dueAmount', label: 'Due', render: (r) => `৳${Number(r.dueAmount || 0).toLocaleString()}` },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', required: true, auto: 'PUR' },
      { name: 'supplier', label: 'Supplier', type: 'ref-select', refEndpoint: 'suppliers', required: true },
      { name: 'warehouse', label: 'Warehouse', type: 'ref-select', refEndpoint: 'warehouses' },
      { name: 'purchaseDate', label: 'Purchase Date', type: 'date' },
      { name: 'paidAmount', label: 'Paid Amount', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Completed'] },
      { name: 'note', label: 'Note', type: 'textarea' },
    ],
  },

  'purchase-returns': {
    title: 'Purchase Returns',
    endpoint: 'purchase-returns',
    hasItems: true,
    priceField: 'unitCost',
    columns: [
      { key: 'returnNumber', label: 'Return #' },
      { key: 'supplier', label: 'Supplier', render: (r) => r.supplier?.name || '—' },
      { key: 'returnDate', label: 'Date', type: 'date' },
      { key: 'totalAmount', label: 'Total', render: (r) => `৳${Number(r.totalAmount || 0).toLocaleString()}` },
    ],
    fields: [
      { name: 'returnNumber', label: 'Return Number', type: 'text', required: true, auto: 'PRTN' },
      { name: 'supplier', label: 'Supplier', type: 'ref-select', refEndpoint: 'suppliers' },
      { name: 'returnDate', label: 'Return Date', type: 'date' },
      { name: 'reason', label: 'Reason', type: 'textarea' },
    ],
  },

  payments: {
    title: 'Payments (Money Out)',
    endpoint: 'payments',
    columns: [
      { key: 'paymentNumber', label: 'Payment #' },
      { key: 'supplier', label: 'Supplier', render: (r) => r.supplier?.name || '—' },
      { key: 'amount', label: 'Amount', render: (r) => `৳${Number(r.amount || 0).toLocaleString()}` },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    fields: [
      { name: 'paymentNumber', label: 'Payment Number', type: 'text', required: true, auto: 'PAY' },
      { name: 'supplier', label: 'Supplier', type: 'ref-select', refEndpoint: 'suppliers' },
      { name: 'paymentMethod', label: 'Payment Method', type: 'ref-select', refEndpoint: 'payment-methods' },
      { name: 'amount', label: 'Amount', type: 'number', required: true },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'note', label: 'Note', type: 'textarea' },
    ],
  },

  receipts: {
    title: 'Receipts (Money In)',
    endpoint: 'receipts',
    columns: [
      { key: 'receiptNumber', label: 'Receipt #' },
      { key: 'customer', label: 'Customer', render: (r) => r.customer?.name || '—' },
      { key: 'amount', label: 'Amount', render: (r) => `৳${Number(r.amount || 0).toLocaleString()}` },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    fields: [
      { name: 'receiptNumber', label: 'Receipt Number', type: 'text', required: true, auto: 'RCP' },
      { name: 'customer', label: 'Customer', type: 'ref-select', refEndpoint: 'customers' },
      { name: 'paymentMethod', label: 'Payment Method', type: 'ref-select', refEndpoint: 'payment-methods' },
      { name: 'amount', label: 'Amount', type: 'number', required: true },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'note', label: 'Note', type: 'textarea' },
    ],
  },

  'journal-entries': {
    title: 'Journal Entries',
    endpoint: 'journal-entries',
    columns: [
      { key: 'entryNumber', label: 'Entry #' },
      { key: 'debitAccount', label: 'Debit Account', render: (r) => r.debitAccount?.name || '—' },
      { key: 'creditAccount', label: 'Credit Account', render: (r) => r.creditAccount?.name || '—' },
      { key: 'amount', label: 'Amount', render: (r) => `৳${Number(r.amount || 0).toLocaleString()}` },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    fields: [
      { name: 'entryNumber', label: 'Entry Number', type: 'text', required: true, auto: 'JRN' },
      { name: 'debitAccount', label: 'Debit Account', type: 'ref-select', refEndpoint: 'accounts' },
      { name: 'creditAccount', label: 'Credit Account', type: 'ref-select', refEndpoint: 'accounts' },
      { name: 'amount', label: 'Amount', type: 'number', required: true },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },

  expenses: {
    title: 'Expenses',
    endpoint: 'expenses',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'amount', label: 'Amount', render: (r) => `৳${Number(r.amount || 0).toLocaleString()}` },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'amount', label: 'Amount', type: 'number', required: true },
      { name: 'paymentMethod', label: 'Payment Method', type: 'ref-select', refEndpoint: 'payment-methods' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'note', label: 'Note', type: 'textarea' },
    ],
  },

  quotations: {
    title: 'Quotations',
    endpoint: 'quotations',
    hasItems: true,
    priceField: 'unitPrice',
    columns: [
      { key: 'quoteNumber', label: 'Quote #' },
      { key: 'customer', label: 'Customer', render: (r) => r.customer?.name || '—' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'totalAmount', label: 'Total', render: (r) => `৳${Number(r.totalAmount || 0).toLocaleString()}` },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { name: 'quoteNumber', label: 'Quote Number', type: 'text', required: true, auto: 'QUO' },
      { name: 'customer', label: 'Customer', type: 'ref-select', refEndpoint: 'customers', required: true },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'validUntil', label: 'Valid Until', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Draft', 'Sent', 'Accepted', 'Rejected'] },
    ],
  },

  'sales-orders': {
    title: 'Sales Orders',
    endpoint: 'sales-orders',
    hasItems: true,
    priceField: 'unitPrice',
    columns: [
      { key: 'orderNumber', label: 'Order #' },
      { key: 'customer', label: 'Customer', render: (r) => r.customer?.name || '—' },
      { key: 'orderDate', label: 'Date', type: 'date' },
      { key: 'totalAmount', label: 'Total', render: (r) => `৳${Number(r.totalAmount || 0).toLocaleString()}` },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { name: 'orderNumber', label: 'Order Number', type: 'text', required: true, auto: 'SO' },
      { name: 'customer', label: 'Customer', type: 'ref-select', refEndpoint: 'customers', required: true },
      { name: 'orderDate', label: 'Order Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'] },
    ],
  },

  'sales-returns': {
    title: 'Sales Returns',
    endpoint: 'sales-returns',
    hasItems: true,
    priceField: 'unitPrice',
    columns: [
      { key: 'returnNumber', label: 'Return #' },
      { key: 'customer', label: 'Customer', render: (r) => r.customer?.name || '—' },
      { key: 'returnDate', label: 'Date', type: 'date' },
      { key: 'totalAmount', label: 'Total', render: (r) => `৳${Number(r.totalAmount || 0).toLocaleString()}` },
    ],
    fields: [
      { name: 'returnNumber', label: 'Return Number', type: 'text', required: true, auto: 'SRTN' },
      { name: 'customer', label: 'Customer', type: 'ref-select', refEndpoint: 'customers' },
      { name: 'returnDate', label: 'Return Date', type: 'date' },
      { name: 'reason', label: 'Reason', type: 'textarea' },
    ],
  },

  sales: {
    title: 'Sales List',
    endpoint: 'sales',
    hasItems: true,
    priceField: 'unitPrice',
    updatesStock: 'decrease',
    columns: [
      { key: 'invoiceNumber', label: 'Invoice #' },
      { key: 'customer', label: 'Customer', render: (r) => r.customer?.name || 'Walk-in' },
      { key: 'saleDate', label: 'Date', type: 'date' },
      { key: 'totalAmount', label: 'Total', render: (r) => `৳${Number(r.totalAmount || 0).toLocaleString()}` },
      { key: 'dueAmount', label: 'Due', render: (r) => `৳${Number(r.dueAmount || 0).toLocaleString()}` },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', required: true, auto: 'INV' },
      { name: 'customer', label: 'Customer', type: 'ref-select', refEndpoint: 'customers' },
      { name: 'warehouse', label: 'Warehouse', type: 'ref-select', refEndpoint: 'warehouses' },
      { name: 'saleDate', label: 'Sale Date', type: 'date' },
      { name: 'discount', label: 'Discount', type: 'number' },
      { name: 'paidAmount', label: 'Paid Amount', type: 'number' },
      { name: 'paymentMethod', label: 'Payment Method', type: 'ref-select', refEndpoint: 'payment-methods' },
      { name: 'status', label: 'Status', type: 'select', options: ['Completed', 'Due', 'Cancelled'] },
    ],
  },

  damages: {
    title: 'Damages',
    endpoint: 'damages',
    columns: [
      { key: 'product', label: 'Product', render: (r) => r.product?.name || '—' },
      { key: 'warehouse', label: 'Warehouse', render: (r) => r.warehouse?.name || '—' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'lossAmount', label: 'Loss Amount', render: (r) => `৳${Number(r.lossAmount || 0).toLocaleString()}` },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    fields: [
      { name: 'product', label: 'Product', type: 'ref-select', refEndpoint: 'products', required: true },
      { name: 'warehouse', label: 'Warehouse', type: 'ref-select', refEndpoint: 'warehouses' },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'lossAmount', label: 'Loss Amount', type: 'number' },
      { name: 'reason', label: 'Reason', type: 'textarea' },
      { name: 'date', label: 'Date', type: 'date' },
    ],
  },

  'stock-transfers': {
    title: 'Stock Transfers',
    endpoint: 'stock-transfers',
    columns: [
      { key: 'transferNumber', label: 'Transfer #' },
      { key: 'fromWarehouse', label: 'From', render: (r) => r.fromWarehouse?.name || '—' },
      { key: 'toWarehouse', label: 'To', render: (r) => r.toWarehouse?.name || '—' },
      { key: 'product', label: 'Product', render: (r) => r.product?.name || '—' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { name: 'transferNumber', label: 'Transfer Number', type: 'text', required: true, auto: 'TRF' },
      { name: 'fromWarehouse', label: 'From Warehouse', type: 'ref-select', refEndpoint: 'warehouses', required: true },
      { name: 'toWarehouse', label: 'To Warehouse', type: 'ref-select', refEndpoint: 'warehouses', required: true },
      { name: 'product', label: 'Product', type: 'ref-select', refEndpoint: 'products', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Completed'] },
      { name: 'note', label: 'Note', type: 'textarea' },
    ],
  },

  'stock-adjustments': {
    title: 'Stock Adjustments',
    endpoint: 'stock-adjustments',
    columns: [
      { key: 'product', label: 'Product', render: (r) => r.product?.name || '—' },
      { key: 'warehouse', label: 'Warehouse', render: (r) => r.warehouse?.name || '—' },
      { key: 'adjustmentType', label: 'Type' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    fields: [
      { name: 'product', label: 'Product', type: 'ref-select', refEndpoint: 'products', required: true },
      { name: 'warehouse', label: 'Warehouse', type: 'ref-select', refEndpoint: 'warehouses' },
      { name: 'adjustmentType', label: 'Adjustment Type', type: 'select', options: ['Increase', 'Decrease'], required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'reason', label: 'Reason', type: 'textarea' },
      { name: 'date', label: 'Date', type: 'date' },
    ],
  },
};

export const getEntity = (key) => entities[key];

export default entities;
