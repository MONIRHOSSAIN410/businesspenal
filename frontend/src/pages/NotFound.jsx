import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 text-center dark:bg-slate-900">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400"
      >
        <FiAlertCircle size={30} />
      </motion.div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn-primary mt-2">
        Back to Dashboard
      </Link>
    </div>
  );
}
