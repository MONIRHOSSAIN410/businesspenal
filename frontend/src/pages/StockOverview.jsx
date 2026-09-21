import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';
import api, { getErrorMessage } from '../api/axios.js';
import Spinner from '../components/ui/Spinner.jsx';

export default function StockOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/dashboard/reports/stock');
        setData(data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const products = (data?.products || []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Stock Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total stock value: ৳{(data?.totalStockValue || 0).toLocaleString()} · Low stock:{' '}
            {data?.lowStock?.length || 0}
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input className="input pl-9" placeholder="Search product…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Warehouse</th>
                <th className="px-4 py-3">Stock Qty</th>
                <th className="px-4 py-3">Reorder Level</th>
                <th className="px-4 py-3">Stock Value</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <Spinner className="text-primary-500" size={26} />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="border-t border-slate-100 dark:border-slate-700">
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{p.name}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{p.category?.name || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{p.warehouse?.name || '—'}</td>
                    <td className="px-4 py-3">{p.stockQty}</td>
                    <td className="px-4 py-3">{p.reorderLevel}</td>
                    <td className="px-4 py-3">৳{(p.stockQty * p.purchasePrice).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={p.stockQty <= p.reorderLevel ? 'badge-red' : 'badge-green'}>
                        {p.stockQty <= p.reorderLevel ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
