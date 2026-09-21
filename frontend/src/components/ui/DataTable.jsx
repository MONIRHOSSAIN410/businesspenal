import { FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiInbox } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from './Spinner.jsx';

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString() : '—');

function Cell({ col, row }) {
  if (col.render) {
    const result = col.render(row);
    if (result && typeof result === 'object' && 'badge' in result) {
      const map = {
        green: 'badge-green',
        red: 'badge-red',
        yellow: 'badge-yellow',
        slate: 'badge-slate',
      };
      return <span className={map[result.badge] || 'badge-slate'}>{result.text}</span>;
    }
    return <span>{result}</span>;
  }
  if (col.type === 'date') return <span>{fmtDate(row[col.key])}</span>;
  if (col.type === 'status') {
    const val = row[col.key];
    const cls = val === 'active' || val === 'Completed' || val === 'Approved' || val === 'Accepted'
      ? 'badge-green'
      : val === 'inactive' || val === 'Cancelled' || val === 'Rejected'
      ? 'badge-red'
      : 'badge-yellow';
    return <span className={cls}>{val}</span>;
  }
  const raw = row[col.key];
  if (raw === null || raw === undefined || raw === '') return <span className="text-slate-400">—</span>;
  return <span>{String(raw)}</span>;
}

export default function DataTable({
  columns,
  rows,
  loading,
  onEdit,
  onDelete,
  search,
  onSearchChange,
  page,
  pages,
  onPageChange,
  total,
  onAddNew,
  addLabel = 'Add New',
  extraActions,
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            className="input pl-9"
            placeholder="Search…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {extraActions}
          {onAddNew && (
            <button onClick={onAddNew} className="btn-primary whitespace-nowrap">
              + {addLabel}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3 font-semibold">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-14 text-center">
                  <Spinner className="text-primary-500" size={28} />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-14">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <FiInbox size={32} />
                    <p className="text-sm">No records found</p>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {rows.map((row) => (
                  <motion.tr
                    key={row._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-700/70 dark:hover:bg-slate-700/30"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
                        <Cell col={col} row={row} />
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30"
                              aria-label="Edit"
                            >
                              <FiEdit2 size={15} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                              aria-label="Delete"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <span>
            Page {page} of {pages} · {total} records
          </span>
          <div className="flex gap-1">
            <button
              className="btn-ghost !px-2.5 !py-1.5"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              className="btn-ghost !px-2.5 !py-1.5"
              disabled={page >= pages}
              onClick={() => onPageChange(page + 1)}
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
