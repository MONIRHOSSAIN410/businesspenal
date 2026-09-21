import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import useRefOptions from '../../hooks/useRefOptions.js';

// Repeatable "product line item" table editor used by document-style records
// (Purchase Orders, Purchases, Quotations, Sales Orders, Sales, Returns).
// `priceField` is either 'unitCost' (purchase side) or 'unitPrice' (sale side).
export default function ItemsEditor({ items, onChange, priceField = 'unitCost' }) {
  const { options: products } = useRefOptions('products');

  const rows = items && items.length ? items : [];

  const updateRow = (idx, patch) => {
    const next = rows.map((row, i) => (i === idx ? { ...row, ...patch } : row));
    onChange(next);
  };

  const addRow = () => {
    onChange([...rows, { product: '', quantity: 1, [priceField]: 0 }]);
  };

  const removeRow = (idx) => {
    onChange(rows.filter((_, i) => i !== idx));
  };

  const onProductChange = (idx, productId) => {
    const product = products.find((p) => p._id === productId);
    updateRow(idx, {
      product: productId,
      [priceField]:
        priceField === 'unitPrice'
          ? product?.salePrice ?? 0
          : product?.purchasePrice ?? 0,
    });
  };

  const total = rows.reduce(
    (sum, r) => sum + (Number(r.quantity) || 0) * (Number(r[priceField]) || 0),
    0
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="label mb-0">Line Items</label>
        <button type="button" onClick={addRow} className="btn-secondary !px-2.5 !py-1 text-xs">
          <FiPlus size={14} /> Add Item
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2 w-24">Qty</th>
              <th className="px-3 py-2 w-32">{priceField === 'unitPrice' ? 'Unit Price' : 'Unit Cost'}</th>
              <th className="px-3 py-2 w-28">Subtotal</th>
              <th className="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((row, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-t border-slate-100 dark:border-slate-700"
                >
                  <td className="px-3 py-2">
                    <select
                      className="input !py-1.5"
                      value={row.product?._id || row.product || ''}
                      onChange={(e) => onProductChange(idx, e.target.value)}
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.sku})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      className="input !py-1.5"
                      value={row.quantity ?? 0}
                      onChange={(e) => updateRow(idx, { quantity: Number(e.target.value) })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      className="input !py-1.5"
                      value={row[priceField] ?? 0}
                      onChange={(e) => updateRow(idx, { [priceField]: Number(e.target.value) })}
                    />
                  </td>
                  <td className="px-3 py-2 font-medium text-slate-600 dark:text-slate-300">
                    ৳{((Number(row.quantity) || 0) * (Number(row[priceField]) || 0)).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-slate-400">
                  No items added yet. Click "Add Item" to start.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex justify-end text-sm font-semibold text-slate-700 dark:text-slate-200">
        Total: ৳{total.toLocaleString()}
      </div>
    </div>
  );
}
