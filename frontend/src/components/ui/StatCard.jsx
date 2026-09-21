import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, iconBg, iconColor, sub }) {
  return (
    <motion.div
      className="card flex items-center gap-4 p-5"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{ background: iconBg }}
      >
        <Icon size={22} style={{ color: iconColor }} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-2xl font-bold text-slate-800 dark:text-slate-100">
          {value}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        {sub && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
      </div>
    </motion.div>
  );
}
