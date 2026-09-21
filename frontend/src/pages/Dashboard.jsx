import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiShoppingCart,
  FiTrendingUp,
  FiDollarSign,
  FiShoppingBag,
  FiBox,
  FiAlertTriangle,
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import api, { getErrorMessage } from '../api/axios.js';
import toast from 'react-hot-toast';
import StatCard from '../components/ui/StatCard.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, salesRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/reports/sales'),
        ]);
        setStats(statsRes.data.data);
        setSalesTrend(
          (salesRes.data.data.grouped || []).map((g) => ({
            date: g._id?.slice(5) || g._id,
            sales: g.totalSales,
          }))
        );
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size={32} className="text-primary-500" />
      </div>
    );
  }

  const cards = [
    {
      icon: FiShoppingCart,
      label: 'Sales Today',
      value: `৳${(stats?.salesToday?.amount || 0).toLocaleString()}`,
      sub: `${stats?.salesToday?.count || 0} invoice(s)`,
      iconBg: 'rgba(34,163,158,0.12)',
      iconColor: '#22a39e',
    },
    {
      icon: FiShoppingBag,
      label: 'Purchase Today',
      value: `৳${(stats?.purchaseToday?.amount || 0).toLocaleString()}`,
      sub: `${stats?.purchaseToday?.count || 0} invoice(s)`,
      iconBg: 'rgba(234,179,8,0.12)',
      iconColor: '#ca8a04',
    },
    {
      icon: FiDollarSign,
      label: 'Cash In Today',
      value: `৳${(stats?.cashInToday || 0).toLocaleString()}`,
      iconBg: 'rgba(34,197,94,0.12)',
      iconColor: '#16a34a',
    },
    {
      icon: FiTrendingUp,
      label: 'Cash Out Today',
      value: `৳${(stats?.cashOutToday || 0).toLocaleString()}`,
      iconBg: 'rgba(239,68,68,0.12)',
      iconColor: '#dc2626',
    },
    {
      icon: FiBox,
      label: 'Total Products',
      value: stats?.totalProducts ?? 0,
      iconBg: 'rgba(99,102,241,0.12)',
      iconColor: '#4f46e5',
    },
    {
      icon: FiAlertTriangle,
      label: 'Low Stock Items',
      value: stats?.lowStockCount ?? 0,
      iconBg: 'rgba(249,115,22,0.12)',
      iconColor: '#ea580c',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Here's what's happening with your business today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <StatCard {...c} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Sales Trend (This Month)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#22a39e"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Active Users</h3>
          <ul className="space-y-3">
            {(stats?.activeUsers || []).map((u) => (
              <li key={u._id} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500/10 text-sm font-semibold text-primary-600 dark:text-primary-400">
                  {u.name?.[0]?.toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {u.name}
                  </p>
                  <p className="truncate text-xs text-slate-400 capitalize">{u.role}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                </span>
              </li>
            ))}
            {(!stats?.activeUsers || stats.activeUsers.length === 0) && (
              <p className="text-sm text-slate-400">No active users yet.</p>
            )}
          </ul>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Recent Sales</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="py-2 pr-4">Invoice</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentSales || []).map((s) => (
                <tr key={s._id} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="py-2 pr-4 font-medium text-slate-700 dark:text-slate-200">
                    {s.invoiceNumber}
                  </td>
                  <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">
                    {s.customer?.name || 'Walk-in'}
                  </td>
                  <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">
                    {new Date(s.saleDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-4 font-medium text-slate-700 dark:text-slate-200">
                    ৳{Number(s.totalAmount).toLocaleString()}
                  </td>
                </tr>
              ))}
              {(!stats?.recentSales || stats.recentSales.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    No sales yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
