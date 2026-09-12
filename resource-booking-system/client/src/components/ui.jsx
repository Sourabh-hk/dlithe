import clsx from 'clsx';

export const StatusBadge = ({ status }) => {
  const config = {
    CONFIRMED: { label: 'Confirmed', cls: 'bg-green-50 text-green-700 border border-green-200' },
    COMPLETED: { label: 'Completed', cls: 'bg-slate-100 text-slate-600 border border-slate-200' },
    CANCELLED: { label: 'Cancelled', cls: 'bg-red-50 text-red-700 border border-red-200' },
    AVAILABLE: { label: 'Available', cls: 'bg-green-50 text-green-700 border border-green-200' },
    MAINTENANCE: { label: 'Maintenance', cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
    INACTIVE: { label: 'Inactive', cls: 'bg-slate-100 text-slate-500 border border-slate-200' },
    ADMIN: { label: 'Admin', cls: 'bg-blue-50 text-blue-700 border border-blue-200' },
    USER: { label: 'User', cls: 'bg-slate-100 text-slate-600 border border-slate-200' },
  };
  const c = config[status] || { label: status, cls: 'bg-slate-100 text-slate-600' };
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', c.cls)}>
      {c.label}
    </span>
  );
};

export const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled, loading, ...props }) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-400',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
};

export const Input = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
    <input
      className={clsx(
        'w-full px-3 py-2 text-sm border rounded-md bg-white text-slate-900 placeholder-slate-400 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        error ? 'border-red-400' : 'border-slate-300 hover:border-slate-400',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export const Select = ({ label, error, children, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
    <select
      className={clsx(
        'w-full px-3 py-2 text-sm border rounded-md bg-white text-slate-900 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        error ? 'border-red-400' : 'border-slate-300 hover:border-slate-400',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export const Textarea = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
    <textarea
      className={clsx(
        'w-full px-3 py-2 text-sm border rounded-md bg-white text-slate-900 placeholder-slate-400 resize-y transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        error ? 'border-red-400' : 'border-slate-300 hover:border-slate-400',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export const Card = ({ children, className = '', ...props }) => (
  <div className={clsx('bg-white border border-slate-200 rounded-lg', className)} {...props}>
    {children}
  </div>
);

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-slate-900/50" onClick={onClose} />
        <div className={clsx('relative bg-white rounded-lg shadow-xl w-full', sizes[size])}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'danger', loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-sm text-slate-600 mb-6">{message}</p>
    <div className="flex justify-end gap-3">
      <Button variant="secondary" onClick={onClose} disabled={loading}>Keep</Button>
      <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
    </div>
  </Modal>
);

export const Skeleton = ({ className = '' }) => (
  <div className={clsx('animate-pulse bg-slate-200 rounded', className)} />
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {Icon && <Icon className="w-10 h-10 text-slate-300 mb-3" />}
    <h3 className="text-sm font-semibold text-slate-700 mb-1">{title}</h3>
    {description && <p className="text-sm text-slate-500 mb-4 max-w-sm">{description}</p>}
    {action}
  </div>
);

export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 ml-4">{actions}</div>}
  </div>
);
