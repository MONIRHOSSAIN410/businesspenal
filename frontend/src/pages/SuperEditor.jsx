import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiDatabase, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import api, { getErrorMessage } from '../api/axios.js';
import Modal from '../components/ui/Modal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import Spinner from '../components/ui/Spinner.jsx';

// Powerful raw-data tool: pick any collection, see every field as JSON, and
// edit/delete records directly. Admin-only (guarded both by the route and by
// the backend's authorize('admin') middleware on /api/super-editor/*).
export default function SuperEditor() {
  const [collections, setCollections] = useState([]);
  const [selected, setSelected] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const { data } = await api.get('/super-editor/collections');
        setCollections(data.data || []);
        if (data.data?.length) setSelected(data.data[0].key);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    };
    loadCollections();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/super-editor/${selected}`, { params: { limit: 50 } });
        setRecords(data.data || []);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selected]);

  const openEdit = (row) => {
    setEditingRow(row);
    setJsonText(JSON.stringify(row, null, 2));
    setJsonError('');
  };

  const handleSave = async () => {
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setJsonError('Invalid JSON');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/super-editor/${selected}/${editingRow._id}`, parsed);
      toast.success('Record updated');
      setEditingRow(null);
      const { data } = await api.get(`/super-editor/${selected}`, { params: { limit: 50 } });
      setRecords(data.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/super-editor/${selected}/${deleteTarget._id}`);
      toast.success('Record deleted');
      setRecords((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const fields = records[0]
    ? Object.keys(records[0]).filter((k) => k !== '__v')
    : [];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
          <FiDatabase size={18} />
        </span>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Super Editor</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Raw database access — admin only. Edit any record in any collection.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {collections.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelected(c.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selected === c.key
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {c.key} <span className="opacity-70">({c.count})</span>
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
              <tr>
                {fields.slice(0, 6).map((f) => (
                  <th key={f} className="whitespace-nowrap px-4 py-3">
                    {f}
                  </th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <Spinner className="text-primary-500" size={26} />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No records in this collection
                  </td>
                </tr>
              ) : (
                records.map((row) => (
                  <tr key={row._id} className="border-t border-slate-100 dark:border-slate-700">
                    {fields.slice(0, 6).map((f) => (
                      <td key={f} className="max-w-[180px] truncate px-4 py-3 text-slate-600 dark:text-slate-300">
                        {typeof row[f] === 'object' ? JSON.stringify(row[f]) : String(row[f] ?? '—')}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(row)} className="rounded-lg p-2 text-slate-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!editingRow}
        onClose={() => setEditingRow(null)}
        title={`Edit raw record — ${selected}`}
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setEditingRow(null)}>
              <FiX size={15} /> Cancel
            </button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              <FiSave size={15} /> {saving ? 'Saving…' : 'Save Raw JSON'}
            </button>
          </>
        }
      >
        <textarea
          className="input min-h-[320px] font-mono text-xs"
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setJsonError('');
          }}
        />
        {jsonError && <p className="mt-2 text-sm text-red-500">{jsonError}</p>}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message="This permanently deletes the raw record from the database."
      />
    </motion.div>
  );
}
