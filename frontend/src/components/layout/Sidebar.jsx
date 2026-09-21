import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiBox, FiX } from 'react-icons/fi';
import menu from '../../config/menu.js';
import { useAuth } from '../../context/AuthContext.jsx';

function canSee(item, hasRole) {
  if (!item.roles) return true;
  return hasRole(...item.roles);
}

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const location = useLocation();
  const { hasRole } = useAuth();
  const [openMenus, setOpenMenus] = useState(() => {
    const active = menu.find((m) =>
      m.children?.some((c) => location.pathname.startsWith(c.path))
    );
    return active ? { [active.label]: true } : {};
  });

  useEffect(() => {
    const active = menu.find((m) =>
      m.children?.some((c) => location.pathname.startsWith(c.path))
    );
    if (active) setOpenMenus((prev) => ({ ...prev, [active.label]: true }));
  }, [location.pathname]);

  const toggle = (label) =>
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

  const content = (
    <div className="flex h-full flex-col bg-sidebar text-slate-200">
      <div className="flex items-center justify-between gap-2 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/20 text-primary-400">
            <FiBox size={20} />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">Business Panel</span>
        </div>
        <button
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 lg:hidden"
          onClick={onCloseMobile}
        >
          <FiX size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {menu.filter((item) => canSee(item, hasRole)).map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const visibleChildren = item.children.filter((c) => canSee(c, hasRole));
            if (visibleChildren.length === 0) return null;
            const isOpen = !!openMenus[item.label];
            const isActive = visibleChildren.some((c) => location.pathname.startsWith(c.path));

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggle(item.label)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-500/15 text-primary-300'
                      : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {item.label}
                  </span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <FiChevronDown size={16} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-4">
                        {visibleChildren.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={onCloseMobile}
                            className={({ isActive }) =>
                              `block rounded-lg px-3 py-2 text-sm transition-colors ${
                                isActive
                                  ? 'bg-primary-500/20 font-medium text-primary-300'
                                  : 'text-slate-400 hover:bg-sidebar-hover hover:text-white'
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-500/15 text-primary-300'
                    : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={18} />
                {item.label}
              </span>
              {item.restricted && (
                <span className="rounded-full bg-primary-500/20 px-2 py-0.5 text-[10px] font-semibold text-primary-300">
                  Restricted
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside className="hidden w-72 shrink-0 lg:block">{content}</aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
