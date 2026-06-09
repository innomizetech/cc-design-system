/* global React */

// ======================================================================
// Primitives: Button, Badge, Input, Checkbox, Segmented, Avatar, Chip,
//             Tabs, Card, KPI, Divider.
// All rely on class names from components.css; props are minimal.
// ======================================================================

const cls = (...xs) => xs.filter(Boolean).join(' ');

// ---------- Button ----------------------------------------------------
const Button = ({
  variant = 'secondary',
  size,
  icon,
  iconRight,
  children,
  className,
  ...rest
}) => (
  <button
    className={cls(
      'x-btn',
      `x-btn--${variant}`,
      size && `x-btn--${size}`,
      !children && icon && 'x-btn--icon',
      className,
    )}
    {...rest}
  >
    {icon && <Icon name={icon} size={14} />}
    {children}
    {iconRight && <Icon name={iconRight} size={14} />}
  </button>
);

// ---------- IconButton -----------------------------------------------
const IconButton = ({ icon, size = 'sm', variant = 'ghost', ...rest }) => (
  <Button variant={variant} size={size} icon={icon} {...rest} />
);

// ---------- Badge -----------------------------------------------------
const Badge = ({ variant = 'neutral', dot = false, children, className }) => (
  <span className={cls('x-badge', `x-badge--${variant}`, className)}>
    {dot && <span className="x-badge__dot" />}
    {children}
  </span>
);

// Domain-specific: invoice statuses map to semantic colors
const InvoiceStatus = ({ status }) => {
  const map = {
    draft: { variant: 'neutral', label: 'Draft' },
    submitted: { variant: 'info', label: 'Submitted' },
    in_review: { variant: 'warn', label: 'In review' },
    approved: { variant: 'success', label: 'Approved' },
    rejected: { variant: 'danger', label: 'Rejected' },
    paid: { variant: 'success', label: 'Paid' },
    disputed: { variant: 'danger', label: 'Disputed' },
    on_hold: { variant: 'warn', label: 'On hold' },
  };
  const s = map[status] || map.draft;
  return (
    <Badge variant={s.variant} dot>
      {s.label}
    </Badge>
  );
};

// ---------- Input & Field --------------------------------------------
const Input = React.forwardRef(({ className, invalid, ...rest }, ref) => (
  <input
    ref={ref}
    className={cls('x-input', className)}
    aria-invalid={invalid ? 'true' : undefined}
    {...rest}
  />
));

const Textarea = ({ className, rows = 4, ...rest }) => (
  <textarea className={cls('x-textarea', className)} rows={rows} {...rest} />
);

const Field = ({ label, required, hint, error, children }) => (
  <div className="x-field">
    {label && (
      <label className="x-label">
        {label}
        {required && <span className="x-label__required">*</span>}
      </label>
    )}
    {children}
    {error ? (
      <div className="x-error">{error}</div>
    ) : hint ? (
      <div className="x-hint">{hint}</div>
    ) : null}
  </div>
);

// ---------- Checkbox --------------------------------------------------
const Checkbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const innerRef = React.useRef();
  React.useImperativeHandle(ref, () => innerRef.current);
  React.useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return <input type="checkbox" ref={innerRef} className="x-check" {...rest} />;
});

// ---------- Avatar ----------------------------------------------------
const Avatar = ({ name = '', size = 'md', color, className }) => {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const hue = React.useMemo(() => {
    let h = 0;
    for (let i = 0; i < name.length; i++)
      h = (h * 31 + name.charCodeAt(i)) % 360;
    return h;
  }, [name]);
  const bg = color || `oklch(0.82 0.04 ${hue})`;
  const fg = color || `oklch(0.35 0.06 ${hue})`;
  return (
    <span
      className={cls(
        'x-avatar',
        size !== 'md' && `x-avatar--${size}`,
        className,
      )}
      style={{ background: bg, color: fg }}
    >
      {initials || '—'}
    </span>
  );
};

// ---------- Segmented Control ----------------------------------------
const Segmented = ({ value, onChange, options }) => (
  <div className="x-segmented" role="tablist">
    {options.map((opt) => (
      <button
        key={opt.value}
        className="x-segmented__item"
        aria-selected={value === opt.value}
        onClick={() => onChange(opt.value)}
      >
        {opt.icon && <Icon name={opt.icon} size={12} />}
        {opt.label}
      </button>
    ))}
  </div>
);

// ---------- Chip (filter pill with label/value) -----------------------
const Chip = ({ label, value, active, onRemove, onClick }) => (
  <span className={cls('x-chip', active && 'x-chip--active')} onClick={onClick}>
    {label && <span className="x-chip__label">{label}:</span>}
    <span className="x-chip__value">{value}</span>
    {onRemove && (
      <span
        className="x-chip__close"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <Icon name="x" size={12} />
      </span>
    )}
  </span>
);

// ---------- Tabs ------------------------------------------------------
const Tabs = ({ value, onChange, items }) => {
  const scrollRef = React.useRef(null);
  const [canScroll, setCanScroll] = React.useState({
    left: false,
    right: false,
  });

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 0,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    });
  }, []);

  React.useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 120, behavior: 'smooth' });
    setTimeout(checkScroll, 200);
  };

  const hasOverflow = canScroll.left || canScroll.right;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        minWidth: 0,
        flex: '1 1 auto',
      }}
    >
      {hasOverflow && canScroll.left && (
        <button
          type="button"
          className="x-tabs__arrow x-tabs__arrow--left"
          onClick={() => scroll(-1)}
        >
          <Icon name="chevronLeft" size={12} />
        </button>
      )}
      <div
        className="x-tabs"
        role="tablist"
        ref={scrollRef}
        onScroll={checkScroll}
      >
        {items.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={value === t.value}
            className="x-tab"
            onClick={() => onChange(t.value)}
          >
            {t.icon && <Icon name={t.icon} size={14} />}
            {t.label}
            {t.count != null && <span className="x-tab__count">{t.count}</span>}
          </button>
        ))}
      </div>
      {hasOverflow && canScroll.right && (
        <button
          type="button"
          className="x-tabs__arrow x-tabs__arrow--right"
          onClick={() => scroll(1)}
        >
          <Icon name="chevronRight" size={12} />
        </button>
      )}
    </div>
  );
};

// ---------- Card ------------------------------------------------------
const Card = ({
  title,
  actions,
  children,
  className,
  bodyClassName,
  noPad,
}) => (
  <div className={cls('x-card', className)}>
    {(title || actions) && (
      <div className="x-card__header">
        <div className="x-card__title">{title}</div>
        {actions && <div style={{ display: 'flex', gap: 4 }}>{actions}</div>}
      </div>
    )}
    <div className={cls(!noPad && 'x-card__body', bodyClassName)}>
      {children}
    </div>
  </div>
);

// ---------- CollapsibleCard ------------------------------------------
// Like Card, but the header is a button that toggles body visibility.
// `id` persists collapsed state in localStorage.
const CollapsibleCard = ({
  id,
  title,
  subtitle,
  actions,
  defaultCollapsed = false,
  children,
  className,
  bodyClassName,
  noPad,
  icon,
}) => {
  const storageKey = id ? `xtnd.card.${id}` : null;
  const [collapsed, setCollapsed] = React.useState(() => {
    if (!storageKey) return defaultCollapsed;
    try {
      const v = localStorage.getItem(storageKey);
      return v == null ? defaultCollapsed : v === '1';
    } catch {
      return defaultCollapsed;
    }
  });
  React.useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, collapsed ? '1' : '0');
    } catch {}
  }, [collapsed, storageKey]);

  return (
    <div
      className={cls(
        'x-card',
        'x-card--collapsible',
        collapsed && 'is-collapsed',
        className,
      )}
    >
      <div className="x-card__header">
        <button
          type="button"
          className="x-card__toggle"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((v) => !v)}
        >
          <span className="x-card__chevron" aria-hidden>
            <Icon name="chevronRight" size={12} />
          </span>
          {icon && (
            <Icon name={icon} size={14} style={{ color: 'var(--fg-3)' }} />
          )}
          <span className="x-card__title">{title}</span>
          {subtitle && <span className="x-card__subtitle">{subtitle}</span>}
        </button>
        {actions && <div style={{ display: 'flex', gap: 4 }}>{actions}</div>}
      </div>
      {!collapsed && (
        <div className={cls(!noPad && 'x-card__body', bodyClassName)}>
          {children}
        </div>
      )}
    </div>
  );
};

// ---------- KPI tile --------------------------------------------------
const KPI = ({ label, value, delta, deltaDir }) => (
  <div className="x-kpi">
    <div className="x-kpi__label">{label}</div>
    <div className="x-kpi__value">{value}</div>
    {delta && (
      <div
        className={cls(
          'x-kpi__delta',
          deltaDir === 'up' && 'x-kpi__delta--up',
          deltaDir === 'down' && 'x-kpi__delta--down',
        )}
      >
        <Icon name={deltaDir === 'up' ? 'sortUp' : 'sortDown'} size={10} />
        {delta}
      </div>
    )}
  </div>
);

// ---------- Divider ---------------------------------------------------
const Divider = ({ vertical }) =>
  vertical ? <span className="x-divider--v" /> : <hr className="x-divider" />;

// ---------- Detail drawer (full-width bottom-up) --------------------
const DetailDrawer = ({
  open,
  onClose,
  title,
  subtitle,
  actions,
  children,
}) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="x-detail-drawer__scrim" onClick={onClose} />
      <div className="x-detail-drawer">
        {(title || subtitle || actions) ? (
          <div className="x-detail-drawer__header">
            <div className="x-nav-arrows" style={{ flex: 'none' }}>
              <button type="button" onClick={onClose} title="Close">
                <Icon name="chevronLeft" size={14} />
              </button>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {title && <div className="x-detail-drawer__title">{title}</div>}
              {subtitle && (
                <div className="x-detail-drawer__subtitle">{subtitle}</div>
              )}
            </div>
            {actions && <div className="x-detail-drawer__actions">{actions}</div>}
            <IconButton icon="x" onClick={onClose} />
          </div>
        ) : null}
        <div className="x-detail-drawer__body">{children}</div>
      </div>
    </>
  );
};

// ---------- App footer ----------------------------------------------
const AppFooter = ({ version = 'v1.0.0', full = false }) => (
  <footer className={cls('x-footer', full && 'x-footer--full')}>
    <span className="x-footer__version">XTND {version}</span>
    <span className="x-footer__copy">
      &copy; {new Date().getFullYear()} XTND. All rights reserved.
    </span>
    <div className="x-footer__links">
      <a href="#" onClick={(e) => e.preventDefault()}>
        Privacy
      </a>
      <span className="x-footer__sep">|</span>
      <a href="#" onClick={(e) => e.preventDefault()}>
        Terms
      </a>
      <span className="x-footer__sep">|</span>
      <a href="#" onClick={(e) => e.preventDefault()}>
        Support
      </a>
    </div>
  </footer>
);

// ---------- Money formatter ------------------------------------------
const fmtMoney = (n, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(n);
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

Object.assign(window, {
  cls,
  Button,
  IconButton,
  Badge,
  InvoiceStatus,
  Input,
  Textarea,
  Field,
  Checkbox,
  Avatar,
  Segmented,
  Chip,
  Tabs,
  Card,
  CollapsibleCard,
  KPI,
  Divider,
  DetailDrawer,
  AppFooter,
  fmtMoney,
  fmtDate,
  fmtDateTime,
});
