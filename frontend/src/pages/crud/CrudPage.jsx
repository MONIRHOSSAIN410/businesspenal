import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api, { getErrorMessage } from '../../api/axios.js';
import { getEntity } from '../../config/entities.js';
import DataTable from '../../components/ui/DataTable.jsx';
import Modal from '../../components/ui/Modal.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import FormField from '../../components/ui/FormField.jsx';
import ItemsEditor from '../../components/ui/ItemsEditor.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const emptyFromFields = (fields) => {
  const obj = {};
  fields.forEach((f) => {
    obj[f.name] = f.type === 'number' ? '' : '';
  });
  return obj;
};

const genNumber = (prefix) =>
  `${prefix}-${Date.now().toString().slice(-8)}`;

// Generic list + create + edit + delete page, driven entirely by
// src/config/entities.js. This single component renders every "module"
// page in the sidebar (Categories, Products, Purchases, Sales, ...).
export default function CrudPage({ entityKey: entityKeyProp }) {
  const params = useParams();
  const entityKey = entityKeyProp || params.entityKey;
  const entity = getEntity(entityKey);
  const { hasRole } = useAuth();

  const canWrite = hasRole('admin', 'manager', 'editor');
  const canDelete = hasRole('admin', 'manager');

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = useCallback(async () => {
    if (!entity) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/${entity.endpoint}`, {
        params: { search, page, limit: 10 },
      });
      setRows(data.data || []);
      setPages(data.pagination?.pages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [entity, search, page]);

  useEffect(() => {
    setPage(1);
  }, [entityKey]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  if (!entity) {
    return (
      <div className="card p-8 text-center text-slate-500">
        Unknown module: <code>{entityKey}</code>
      </div>
    );
  }

  const openCreate = () => {
    setEditingRow(null);
    const initial = emptyFromFields(entity.fields || []);
    const autoField = (entity.fields || []).find((f) => f.auto);
    if (autoField) initial[autoField.name] = genNumber(autoField.auto);
    setFormData(initial);
    setItems([]);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    const data = {};
    (entity.fields || []).forEach((f) => {
      const val = row[f.name];
      data[f.name] = val && typeof val === 'object' && val._id ? val._id : val ?? '';
    });
    setFormData(data);
    setItems(row.items || []);
    setModalOpen(true);
  };

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const computeTotal = () =>
    items.reduce(
      (sum, it) =>
        sum + (Number(it.quantity) || 0) * (Number(it[entity.priceField]) || 0),
      0
    );

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === '') delete payload[k];
      });
      if (entity.hasItems) {
        payload.items = items.map((it) => ({
          product: it.product?._id || it.product,
          quantity: Number(it.quantity) || 0,
          [entity.priceField]: Number(it[entity.priceField]) || 0,
        }));
        payload.totalAmount = computeTotal();
      }

      if (editingRow) {
        await api.put(`/${entity.endpoint}/${editingRow._id}`, payload);
        toast.success(`${entity.title.replace(/s$/, '')} updated`);
      } else {
        await api.post(`/${entity.endpoint}`, payload);
        toast.success(`${entity.title.replace(/s$/, '')} created`);
      }
      setModalOpen(false);
      fetchRows();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/${entity.endpoint}/${deleteTarget._id}`);
      toast.success('Record deleted');
      setDeleteTarget(null);
      fetchRows();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {entity.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {total} total record{total === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <DataTable
        columns={entity.columns}
        rows={rows}
        loading={loading}
        onEdit={canWrite ? openEdit : undefined}
        onDelete={canDelete ? (row) => setDeleteTarget(row) : undefined}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        page={page}
        pages={pages}
        total={total}
        onPageChange={setPage}
        onAddNew={canWrite ? openCreate : undefined}
        addLabel={entity.title.replace(/s$/, '')}
      />

      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editingRow ? `Edit ${entity.title}` : `Add ${entity.title}`}
        size={entity.hasItems ? 'xl' : 'md'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(entity.fields || []).map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <FormField field={field} value={formData[field.name]} onChange={handleFieldChange} />
              </div>
            ))}
          </div>

          {entity.hasItems && (
            <ItemsEditor items={items} onChange={setItems} priceField={entity.priceField} />
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`This will permanently delete this record from ${entity.title}.`}
      />
    </motion.div>
  );
}
