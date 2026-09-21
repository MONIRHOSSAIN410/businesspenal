import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Users from './pages/Users.jsx';
import POS from './pages/POS.jsx';
import StockOverview from './pages/StockOverview.jsx';
import Reports from './pages/Reports.jsx';
import SuperEditor from './pages/SuperEditor.jsx';
import NotFound from './pages/NotFound.jsx';
import CrudPage from './pages/crud/CrudPage.jsx';
import { useTheme } from './context/ThemeContext.jsx';

// Thin wrapper so <Route element={<Crud entityKey="products" />} /> reads
// cleanly below - every one of these renders the same generic CrudPage but
// is wired to its own backend module via src/config/entities.js.
const Crud = (entityKey) => <CrudPage entityKey={entityKey} />;

export default function App() {
  const { isDark } = useTheme();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f1f5f9' : '#1e293b',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />

          {/* User Settings */}
          <Route
            path="/user-settings/users"
            element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-settings/roles"
            element={
              <ProtectedRoute roles={['admin', 'manager']}>
                {Crud('roles')}
              </ProtectedRoute>
            }
          />
          <Route path="/user-settings/profile" element={<Profile />} />

          {/* Product Setting */}
          <Route path="/product-setting/categories" element={Crud('categories')} />
          <Route path="/product-setting/brands" element={Crud('brands')} />
          <Route path="/product-setting/units" element={Crud('units')} />
          <Route path="/product-setting/warehouses" element={Crud('warehouses')} />
          <Route path="/product-setting/products" element={Crud('products')} />

          {/* Accounts Setting */}
          <Route path="/accounts-setting/accounts" element={Crud('accounts')} />
          <Route path="/accounts-setting/bank-accounts" element={Crud('bank-accounts')} />
          <Route path="/accounts-setting/payment-methods" element={Crud('payment-methods')} />

          {/* Opening */}
          <Route path="/opening/opening-stocks" element={Crud('opening-stocks')} />
          <Route path="/opening/opening-balances" element={Crud('opening-balances')} />

          {/* Purchase */}
          <Route path="/purchase/purchase-orders" element={Crud('purchase-orders')} />
          <Route path="/purchase/purchases" element={Crud('purchases')} />
          <Route path="/purchase/purchase-returns" element={Crud('purchase-returns')} />

          {/* Lists */}
          <Route path="/lists/suppliers" element={Crud('suppliers')} />
          <Route path="/lists/customers" element={Crud('customers')} />
          <Route path="/lists/employees" element={Crud('employees')} />

          {/* Transactions */}
          <Route path="/transactions/payments" element={Crud('payments')} />
          <Route path="/transactions/receipts" element={Crud('receipts')} />
          <Route path="/transactions/journal-entries" element={Crud('journal-entries')} />
          <Route path="/transactions/expenses" element={Crud('expenses')} />

          {/* Advanced Sales */}
          <Route path="/advanced-sales/quotations" element={Crud('quotations')} />
          <Route path="/advanced-sales/sales-orders" element={Crud('sales-orders')} />
          <Route path="/advanced-sales/sales-returns" element={Crud('sales-returns')} />

          {/* Sales */}
          <Route path="/sales/pos" element={<POS />} />
          <Route path="/sales/sales-list" element={Crud('sales')} />

          {/* Damages */}
          <Route path="/damages/damages" element={Crud('damages')} />

          {/* Stock */}
          <Route path="/stock/overview" element={<StockOverview />} />
          <Route path="/stock/stock-transfers" element={Crud('stock-transfers')} />
          <Route path="/stock/stock-adjustments" element={Crud('stock-adjustments')} />

          {/* Super Editor - admin only */}
          <Route
            path="/super-editor"
            element={
              <ProtectedRoute roles={['admin']}>
                <SuperEditor />
              </ProtectedRoute>
            }
          />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
