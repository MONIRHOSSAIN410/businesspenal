import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import api, { getErrorMessage } from '../api/axios.js';
import useRefOptions from '../hooks/useRefOptions.js';
import Spinner from '../components/ui/Spinner.jsx';

export default function POS() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState('');
  const [placing, setPlacing] = useState(false);

  const { options: customers } = useRefOptions('customers');
  const { options: paymentMethods } = useRefOptions('payment-methods');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products', { params: { search, limit: 40 } });
        setProducts(data.data || []);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search]);

  const addToCart = (product) => {
    if (product.stockQty <= 0) {
      toast.error('Out of stock');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1, unitPrice: product.salePrice }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product._id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        )
        .filter(Boolean)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.product._id !== id));

  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0),
    [cart]
  );
  const total = Math.max(0, subtotal - (Number(discount) || 0));

  const checkout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setPlacing(true);
    try {
      const payload = {
        invoiceNumber: `INV-${Date.now().toString().slice(-8)}`,
        customer: customer || undefined,
        paymentMethod: paymentMethod || undefined,
        saleDate: new Date().toISOString(),
        discount: Number(discount) || 0,
        paidAmount: Number(paidAmount) || total,
        dueAmount: Math.max(0, total - (Number(paidAmount) || total)),
        status: (Number(paidAmount) || total) >= total ? 'Completed' : 'Due',
        items: cart.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        totalAmount: total,
      };
      await api.post('/sales', payload);
      toast.success('Sale completed!');
      setCart([]);
      setDiscount(0);
      setPaidAmount('');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            className="input pl-9"
            placeholder="Search products by name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner size={28} className="text-primary-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <motion.button
                key={p._id}
                onClick={() => addToCart(p)}
                whileTap={{ scale: 0.96 }}
                className="card flex flex-col items-start gap-1 p-3 text-left hover:border-primary-400 hover:shadow-md"
              >
                <span className="flex h-16 w-full items-center justify-center rounded-lg bg-slate-100 text-slate-300 dark:bg-slate-700">
                  <FiShoppingCart size={22} />
                </span>
                <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {p.name}
                </p>
                <p className="text-xs text-slate-400">{p.sku}</p>
                <div className="mt-auto flex w-full items-center justify-between pt-1">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    ৳{p.salePrice}
                  </span>
                  <span className={`text-xs ${p.stockQty <= p.reorderLevel ? 'text-red-500' : 'text-slate-400'}`}>
                    Stock: {p.stockQty}
                  </span>
                </div>
              </motion.button>
            ))}
            {products.length === 0 && (
              <p className="col-span-full py-10 text-center text-slate-400">No products found</p>
            )}
          </div>
        )}
      </div>

      <div className="card flex flex-col p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <FiShoppingCart size={16} /> Cart ({cart.length})
        </h3>

        <div className="flex-1 space-y-2 overflow-y-auto" style={{ maxHeight: 320 }}>
          <AnimatePresence initial={false}>
            {cart.map((item) => (
              <motion.div
                key={item.product._id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="flex items-center gap-2 rounded-lg border border-slate-100 p-2 dark:border-slate-700"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-slate-400">৳{item.unitPrice} each</p>
                </div>
                <button onClick={() => updateQty(item.product._id, -1)} className="btn-ghost !p-1.5">
                  <FiMinus size={12} />
                </button>
                <span className="w-5 text-center text-sm">{item.quantity}</span>
                <button onClick={() => updateQty(item.product._id, 1)} className="btn-ghost !p-1.5">
                  <FiPlus size={12} />
                </button>
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-slate-300 hover:text-red-500"
                >
                  <FiTrash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {cart.length === 0 && <p className="py-8 text-center text-sm text-slate-400">Cart is empty</p>}
        </div>

        <div className="mt-4 space-y-3 border-t border-slate-200 pt-3 dark:border-slate-700">
          <select className="input" value={customer} onChange={(e) => setCustomer(e.target.value)}>
            <option value="">Walk-in Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <select className="input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="">Payment Method</option>
            {paymentMethods.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>

          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Subtotal</span>
            <span>৳{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Discount</span>
            <input
              type="number"
              className="input !w-28 text-right"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between text-base font-bold text-slate-800 dark:text-slate-100">
            <span>Total</span>
            <span>৳{total.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Paid</span>
            <input
              type="number"
              className="input !w-28 text-right"
              placeholder={String(total)}
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />
          </div>

          <button className="btn-primary w-full" onClick={checkout} disabled={placing}>
            {placing ? 'Processing…' : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}
