import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api, { getErrorMessage } from '../api/axios.js';
import Spinner from '../components/ui/Spinner.jsx';

const TABS = [
  { key: 'sales', label: 'Sales Report' },
  { key: 'purchases', label: 'Purchase Report' },
  { key: 'stock', label: 'Stock Report' },
  { key: 'profit-loss', label: 'Profit & Loss' },
  { key: 'damages', label: 'Damage Report' },
];

const COLORS = ['#22a39e', '#ca8a04', '#dc2626', '#4f46e5', '#16a34a'];

export default function Reports() {
  const [tab, setTab] = useState('sales');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/dashboard/reports/${tab}`);
        setData(data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Reports</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Business insights across sales, purchases, stock and profitability.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            {t.label}
            {tab === t.key && (
              <motion.div
                layoutId="report-tab-underline"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-primary-500"
              />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size={28} className="text-primary-500" />
        </div>
      ) : (
        <div className="card p-5">
          {tab === 'sales' && <SalesReport data={data} />}
          {tab === 'purchases' && <PurchaseReport data={data} />}
          {tab === 'stock' && <StockReport data={data} />}
          {tab === 'profit-loss' && <ProfitLossReport data={data} />}
          {tab === 'damages' && <DamageReport data={data} />}
        </div>
      )}
    </motion.div>
  );
}

function SalesReport({ data }) {
  const chartData = (data?.grouped || []).map((g) => ({ date: g._id?.slice(5), total: g.totalSales }));
  return (
    <div>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Total sales this period: <b className="text-slate-700 dark:text-slate-200">৳{(data?.summary?.total || 0).toLocaleString()}</b>{' '}
        across {data?.summary?.count || 0} invoice(s)
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
            <Bar dataKey="total" fill="#22a39e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PurchaseReport({ data }) {
  const chartData = (data?.grouped || []).map((g) => ({ date: g._id?.slice(5), total: g.totalPurchase }));
  return (
    <div>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Total purchases this period:{' '}
        <b className="text-slate-700 dark:text-slate-200">৳{(data?.summary?.total || 0).toLocaleString()}</b> across{' '}
        {data?.summary?.count || 0} invoice(s)
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
            <Bar dataKey="total" fill="#ca8a04" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StockReport({ data }) {
  const lowStock = data?.lowStock || [];
  return (
    <div>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Total stock value:{' '}
        <b className="text-slate-700 dark:text-slate-200">৳{(data?.totalStockValue || 0).toLocaleString()}</b> ·{' '}
        {lowStock.length} product(s) at or below reorder level
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Reorder Level</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((p) => (
              <tr key={p._id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="py-2 pr-4 font-medium text-slate-700 dark:text-slate-200">{p.name}</td>
                <td className="py-2 pr-4 text-red-500">{p.stockQty}</td>
                <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">{p.reorderLevel}</td>
              </tr>
            ))}
            {lowStock.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-slate-400">
                  No low-stock products 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfitLossReport({ data }) {
  const pieData = [
    { name: 'Cost of Goods', value: data?.costOfGoods || 0 },
    { name: 'Damage Loss', value: data?.damageLoss || 0 },
    { name: 'Profit', value: Math.max(data?.profit || 0, 0) },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="grid grid-cols-2 gap-4">
        <MetricBox label="Revenue" value={data?.revenue} color="text-primary-600 dark:text-primary-400" />
        <MetricBox label="Cost of Goods" value={data?.costOfGoods} color="text-amber-600 dark:text-amber-400" />
        <MetricBox label="Damage Loss" value={data?.damageLoss} color="text-red-600 dark:text-red-400" />
        <MetricBox
          label="Net Profit"
          value={data?.profit}
          color={data?.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}
          sub={`Margin: ${data?.margin ?? 0}%`}
        />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {pieData.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MetricBox({ label, value, color, sub }) {
  return (
    <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-700">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-1 text-xl font-bold ${color}`}>৳{Number(value || 0).toLocaleString()}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

function DamageReport({ data }) {
  const damages = data?.damages || [];
  return (
    <div>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Total loss from damages:{' '}
        <b className="text-red-500">৳{(data?.totalLoss || 0).toLocaleString()}</b>
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Warehouse</th>
              <th className="py-2 pr-4">Qty</th>
              <th className="py-2 pr-4">Loss</th>
              <th className="py-2 pr-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {damages.map((d) => (
              <tr key={d._id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="py-2 pr-4 font-medium text-slate-700 dark:text-slate-200">{d.product?.name || '—'}</td>
                <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">{d.warehouse?.name || '—'}</td>
                <td className="py-2 pr-4">{d.quantity}</td>
                <td className="py-2 pr-4 text-red-500">৳{Number(d.lossAmount).toLocaleString()}</td>
                <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">
                  {new Date(d.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {damages.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">
                  No damages recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
