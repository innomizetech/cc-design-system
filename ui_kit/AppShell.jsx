/* global React, Icon, Button, IconButton, Avatar, Badge, Segmented, AppFooter, cls */

// ======================================================================
// Module registry — the XTND product suite.
// Named for trees to reinforce the "deep-rooted, enduring" positioning.
// ======================================================================
const MODULES = [
  {
    id: 'willow',
    name: 'Willow',
    color: '#5a7a4b',
    icon: 'matter',
    tag: 'Billing console',
    current: true,
    desc: 'Pre-bills, invoices and review workflows for billing attorneys.',
  },
  {
    id: 'banyan',
    name: 'Banyan',
    color: '#8f3a28',
    icon: 'building',
    tag: 'Matter management',
    desc: 'Matter intake, budgets, timekeepers and engagement letters.',
  },
  {
    id: 'heartwood',
    name: 'Heartwood',
    color: '#6e4b2a',
    icon: 'ledger',
    tag: 'General ledger',
    desc: 'Trust accounting, receivables and firm-wide financial ledgers.',
  },
  {
    id: 'sycamore',
    name: 'Sycamore',
    color: '#3c6079',
    icon: 'vendor',
    tag: 'Vendor portal',
    desc: 'Outside-counsel bill submission, revisions and ebilling gateway.',
  },
  {
    id: 'cedar',
    name: 'Cedar',
    color: '#524d3e',
    icon: 'approval',
    tag: 'Compliance',
    desc: 'Conflict checks, engagement compliance and audit-ready trails.',
  },
  {
    id: 'aspen',
    name: 'Aspen',
    color: '#7a5a1a',
    icon: 'report',
    tag: 'Analytics',
    desc: 'Realization, leakage and timekeeper performance dashboards.',
  },
];

// ======================================================================
// NAV_ITEMS — single source of truth for all navigation modes.
// Supports up to 3 levels of nesting for sidebar mode.
// Structure: sections[] → items[] → children[] → children[]
// ======================================================================
const NAV_ITEMS = {
  // Start menu sections (scrollable)
  sections: [
    {
      label: 'Workspace',
      icon: 'dashboard',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        {
          id: 'invoices',
          label: 'Invoices',
          icon: 'invoice',
          count: 128,
          activeFor: ['invoices', 'detail'],
        },
        { id: 'bills', label: 'Vendor bills', icon: 'vendor', count: 10 },
        { id: 'approvals', label: 'Approvals', icon: 'approval', count: 7 },
        { id: 'workflows', label: 'Workflows', icon: 'workflow' },
      ],
    },
    {
      label: 'Records',
      icon: 'matter',
      items: [
        { id: 'matters', label: 'Matters', icon: 'matter' },
        { id: 'vendors', label: 'Clients', icon: 'vendor' },
        {
          id: 'ledger',
          label: 'Ledger',
          icon: 'ledger',
          children: [
            {
              id: 'ledger-trust',
              label: 'Trust',
              children: [
                { id: 'ledger-trust-balances', label: 'Balances' },
                { id: 'ledger-trust-transactions', label: 'Transactions' },
              ],
            },
            { id: 'ledger-receivables', label: 'Receivables' },
          ],
        },
        { id: 'reports', label: 'Reports', icon: 'report' },
      ],
    },
    {
      label: 'Paradigms',
      icon: 'grid',
      items: [
        {
          id: 'ps-tabs',
          label: 'Tab + Side Column',
          icon: 'invoice',
          activeFor: [
            'ps-tabs',
            'ps-1a',
            'ps-1b',
            'ps-matter',
            'ps-user-tabs',
            'ps-role-tabs',
          ],
          children: [
            { id: 'ps-1a', label: 'Invoice', navigateTo: 'ps-1a' },
            { id: 'ps-1b', label: 'Invoice (Full Width)', navigateTo: 'ps-1b' },
            { id: 'ps-matter', label: 'Matter', navigateTo: 'ps-matter' },
            { id: 'ps-user-tabs', label: 'User', navigateTo: 'ps-user-tabs' },
            { id: 'ps-role-tabs', label: 'Role', navigateTo: 'ps-role-tabs' },
          ],
        },
        {
          id: 'ps-stacked',
          label: 'Block Stacked',
          icon: 'list',
          activeFor: [
            'ps-stacked',
            'ps-invoice-stacked',
            'ps-2',
            'ps-user',
            'ps-role',
          ],
          children: [
            {
              id: 'ps-invoice-stacked',
              label: 'Invoice',
              navigateTo: 'ps-invoice-stacked',
            },
            { id: 'ps-2', label: 'Vendor Bill', navigateTo: 'ps-2' },
            { id: 'ps-user', label: 'User', navigateTo: 'ps-user' },
            { id: 'ps-role', label: 'Role', navigateTo: 'ps-role' },
          ],
        },
        {
          id: 'ps-crm',
          label: 'CRM Two-Column',
          icon: 'vendor',
          activeFor: ['ps-crm', 'ps-3', 'ps-user-crm'],
          children: [
            { id: 'ps-3', label: 'Vendor Bill', navigateTo: 'ps-3' },
            { id: 'ps-user-crm', label: 'User', navigateTo: 'ps-user-crm' },
          ],
        },
        {
          id: 'datagrid',
          label: 'DataGrid',
          icon: 'grid',
          activeFor: ['datagrid', 'datagrid-test'],
          children: [
            { id: 'datagrid', label: 'Showcase', navigateTo: 'datagrid' },
            { id: 'datagrid-test', label: 'Invoices', navigateTo: 'datagrid-test' },
          ],
        },
      ],
    },
  ],
  // End menu (above user info, always visible)
  endItems: [
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ],
  // Org info (fixed at bottom of sidebar)
  org: {
    id: 'ORG-SM-001',
    name: 'Sterling & McGill LLP',
    initials: 'SM',
    accountId: 'ACC-4821',
  },
  orgs: [
    {
      id: 'ORG-SM-001',
      name: 'Sterling & McGill LLP',
      initials: 'SM',
      accountId: 'ACC-4821',
    },
    {
      id: 'ORG-AP-002',
      name: 'Apex Legal Partners',
      initials: 'AP',
      accountId: 'ACC-7734',
    },
    {
      id: 'ORG-HC-003',
      name: 'Hartwell & Cooper',
      initials: 'HC',
      accountId: 'ACC-3192',
    },
  ],
};

// Flatten all items into a single list for horizontal/stacked modes.
// Each item keeps its children for dropdown/secondary panel rendering.
// Stacked: icon rail = primary items (level 1), secondary panel = children of selected item.
// Horizontal: level 1 as tabs, children as dropdown.
const NAV_ALL_ITEMS = [
  ...NAV_ITEMS.sections.flatMap((s) => s.items),
  ...NAV_ITEMS.endItems,
];

/** Check whether a nav item (or any of its children) is active */
const isNavActive = (item, current) => {
  if (item.activeFor) return item.activeFor.includes(current);
  if (current === item.id) return true;
  if (item.children) return item.children.some((c) => isNavActive(c, current));
  return false;
};

/** Resolve a nav item ID to the actual screen route.
 *  Child items (e.g., 'invoices-pending') navigate to their parent screen ('invoices').
 *  This maps nested menu IDs to real routes that index.html handles. */
const NAV_ROUTE_MAP = {};
(function buildRouteMap(items, parentId) {
  items.forEach((item) => {
    // If item has a navigateTo, use it. Otherwise use parentId if it's a child, else own id.
    NAV_ROUTE_MAP[item.id] = item.navigateTo || parentId || item.id;
    if (item.children)
      buildRouteMap(item.children, item.navigateTo || parentId || item.id);
  });
})(NAV_ALL_ITEMS, null);

const resolveRoute = (id) => NAV_ROUTE_MAP[id] || id;

// ---------- Module icon (rounded square with glyph) -----------------
const ModuleGlyph = ({ module, size = 32 }) => (
  <span
    className="x-module__icon"
    style={{ background: module.color, width: size, height: size }}
  >
    <Icon name={module.icon} size={Math.round(size * 0.55)} />
  </span>
);

// ---------- Module picker popover -----------------------------------
const ModulePicker = ({ open, current, onPick, onClose }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="x-modules"
      ref={ref}
      role="dialog"
      aria-label="Module picker"
    >
      <div className="x-modules__header">
        <div className="x-modules__eyebrow">XTND Suite</div>
        <div className="x-modules__title">Switch module</div>
      </div>
      {MODULES.map((m) => (
        <button
          key={m.id}
          type="button"
          className={cls('x-module', current === m.id && 'is-current')}
          onClick={() => onPick(m.id)}
        >
          <ModuleGlyph module={m} />
          <div className="x-module__meta">
            <div className="x-module__row">
              <span className="x-module__name">{m.name}</span>
              <span className="x-module__badge">· {m.tag}</span>
              {current === m.id && (
                <Badge variant="accent" size="sm">
                  Current
                </Badge>
              )}
            </div>
            <div className="x-module__desc">{m.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

// ---------- Flat nav item (no children, used in horizontal/stacked) ----
const NavItem = ({ icon, label, count, active, onClick }) => (
  <button
    className={cls('x-navitem', active && 'is-active')}
    aria-current={active ? 'page' : undefined}
    onClick={onClick}
    type="button"
    title={label}
  >
    <Icon name={icon} size={15} className="x-navitem__icon" />
    <span>{label}</span>
    {count != null && <span className="x-navitem__count">{count}</span>}
  </button>
);

// ---------- Recursive nav menu item (supports nesting up to 3 levels) --
const NavMenuItem = ({ item, current, onNavigate, depth = 0 }) => {
  const active = isNavActive(item, current);
  const hasChildren = item.children && item.children.length > 0;
  const [expanded, setExpanded] = React.useState(() => active && hasChildren);

  // Auto-expand when a child becomes active
  React.useEffect(() => {
    if (hasChildren && isNavActive(item, current)) setExpanded(true);
  }, [current]);

  const handleClick = () => {
    if (hasChildren) {
      setExpanded((v) => !v); // toggle only, no navigation
    } else {
      onNavigate(item.id); // navigate only for leaf items
    }
  };

  return (
    <>
      <button
        className={cls('x-navitem', active && !hasChildren && 'is-active')}
        aria-current={active && !hasChildren ? 'page' : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
        onClick={handleClick}
        type="button"
        title={item.label}
        style={{ paddingLeft: 12 + depth * 16 }}
      >
        {item.icon && depth === 0 && (
          <Icon name={item.icon} size={15} className="x-navitem__icon" />
        )}
        {depth > 0 && !item.icon && (
          <span style={{ width: 16, flex: 'none' }} />
        )}
        <span>{item.label}</span>
        {item.count != null && (
          <span className="x-navitem__count">{item.count}</span>
        )}
        {hasChildren && (
          <Icon
            name="chevronRight"
            size={11}
            style={{
              color: 'var(--fg-4)',
              flex: 'none',
              transform: expanded ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.12s ease',
            }}
          />
        )}
      </button>
      {hasChildren && expanded && (
        <div className="x-navitem__children">
          {item.children.map((child) => (
            <NavMenuItem
              key={child.id}
              item={child}
              current={current}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </>
  );
};

// ---------- Sidebar nav (sidebar mode) --------------------------------
// Structure: [Slot 1] → [Scrollable sections with nested menus] → [End menu] → [Slot 2] → [User info]
const Sidebar = ({
  current,
  onNavigate,
  module,
  startSlot,
  endSlot,
  width,
  onResize,
  collapsed,
  collapsedBehavior,
  isAutoExpanded,
  onMouseEnter,
  onMouseLeave,
}) => {
  const go = (k) => onNavigate && onNavigate(k); // pass raw ID — navigate() handles resolveRoute
  // Popover state for collapsed + popover mode
  const [popover, setPopover] = React.useState(null); // { item, rect }
  const popoverTimer = React.useRef(null);
  // Org switch
  const [orgOpen, setOrgOpen] = React.useState(false);
  const [currentOrg, setCurrentOrg] = React.useState(NAV_ITEMS.org);
  const orgRef = React.useRef(null);
  React.useEffect(() => {
    if (!orgOpen) return;
    const onClick = (e) => {
      if (orgRef.current && !orgRef.current.contains(e.target))
        setOrgOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOrgOpen(false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [orgOpen]);

  const sidebarStyle = width ? { width } : undefined;

  return (
    <>
      <aside
        className={cls('x-sidebar', isAutoExpanded && 'is-auto-expanded')}
        style={sidebarStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={(e) => {
          onMouseLeave && onMouseLeave(e);
          clearTimeout(popoverTimer.current);
          // Don't clear popover immediately — give time for mouse to reach the popover
          if (popover)
            popoverTimer.current = setTimeout(() => setPopover(null), 150);
        }}
      >
        {/* Resize handle */}
        {onResize && (
          <div
            className="x-sidebar__resizer"
            onMouseDown={onResize}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'var(--a-300)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          />
        )}
        {/* Slot 1 — optional fixed top content */}
        {startSlot && <div className="x-sidebar__slot">{startSlot}</div>}

        {/* Scrollable start menu with nested sections */}
        <nav className="x-sidebar__nav">
          {NAV_ITEMS.sections.map((section) => (
            <React.Fragment key={section.label}>
              <div className="x-sidebar__group-label">{section.label}</div>
              {section.items.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={(e) => {
                    if (
                      collapsed &&
                      collapsedBehavior === 'popover' &&
                      item.children &&
                      item.children.length > 0 &&
                      !isAutoExpanded
                    ) {
                      clearTimeout(popoverTimer.current);
                      const rect = e.currentTarget.getBoundingClientRect();
                      popoverTimer.current = setTimeout(
                        () => setPopover({ item, rect }),
                        50,
                      );
                    }
                  }}
                  onMouseLeave={() => {
                    clearTimeout(popoverTimer.current);
                  }}
                >
                  <NavMenuItem
                    item={item}
                    current={current}
                    onNavigate={go}
                    depth={0}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </nav>

        {/* End menu — always visible above user info */}
        {NAV_ITEMS.endItems.length > 0 && (
          <div className="x-sidebar__end">
            {NAV_ITEMS.endItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                count={item.count}
                active={isNavActive(item, current)}
                onClick={() => go(item.id)}
              />
            ))}
          </div>
        )}

        {/* Slot 2 — optional fixed bottom content */}
        {endSlot && <div className="x-sidebar__slot">{endSlot}</div>}

        {/* Org info — fixed at bottom */}
        <div ref={orgRef} style={{ position: 'relative' }}>
          <div
            className="x-sidebar__tenant"
            title="Switch organization"
            onClick={(e) => {
              e.stopPropagation();
              setOrgOpen((v) => !v);
            }}
          >
            <div className="x-sidebar__tenant-avatar">
              {currentOrg.initials}
            </div>
            <div className="x-sidebar__tenant-meta">
              <div className="x-sidebar__tenant-name">{currentOrg.name}</div>
            </div>
            <Icon
              name="caretDown"
              size={12}
              style={{ color: 'var(--fg-3)', flex: 'none' }}
            />
          </div>
          {orgOpen && (
            <div className="x-org-switch">
              <div className="x-org-switch__header">Switch organization</div>
              {NAV_ITEMS.orgs.map((org) => (
                <button
                  key={org.id}
                  type="button"
                  className={cls(
                    'x-org-switch__item',
                    currentOrg.id === org.id && 'is-active',
                  )}
                  onClick={() => {
                    setCurrentOrg(org);
                    setOrgOpen(false);
                  }}
                >
                  <div className="x-org-switch__avatar">{org.initials}</div>
                  <div className="x-org-switch__meta">
                    <div className="x-org-switch__name">{org.name}</div>
                    <div className="x-org-switch__id">{org.accountId}</div>
                  </div>
                  {currentOrg.id === org.id && (
                    <Icon
                      name="check"
                      size={14}
                      style={{ color: 'var(--fg-accent)', flex: 'none' }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
      {/* Popover for collapsed sidebar — shows children next to hovered icon */}
      {popover &&
        collapsed &&
        collapsedBehavior === 'popover' &&
        !isAutoExpanded &&
        ReactDOM.createPortal(
          <div
            className="x-horiznav__dropdown"
            style={{
              position: 'fixed',
              top: popover.rect.top,
              left: popover.rect.right + 8,
              minWidth: 180,
              maxHeight: 'calc(100vh - 100px)',
              overflowY: 'auto',
            }}
            onMouseEnter={() => clearTimeout(popoverTimer.current)}
            onMouseLeave={() => {
              setPopover(null);
            }}
          >
            <div
              style={{
                padding: '6px 10px 4px',
                fontSize: 'var(--fs-xs)',
                fontWeight: 600,
                color: 'var(--fg-3)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-caps)',
              }}
            >
              {popover.item.label}
            </div>
            <nav style={{ padding: 4 }}>
              {popover.item.children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  className={cls(
                    'x-horiznav__drop-item',
                    isNavActive(child, current) && 'is-active',
                  )}
                  onClick={() => {
                    go(child.id);
                    setPopover(null);
                  }}
                >
                  <span>{child.label}</span>
                  {child.count != null && (
                    <span className="x-horiznav__count">{child.count}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
};

// ---------- Horizontal nav item with optional children dropdown --------
const HorizDropItem = ({ item, current, onNavigate, onClose }) => {
  const hasKids = item.children && item.children.length > 0;
  const active = isNavActive(item, current);
  const [subOpen, setSubOpen] = React.useState(false);
  const timer = React.useRef(null);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const onEnter = () => {
    clearTimeout(timer.current);
    if (hasKids) timer.current = setTimeout(() => setSubOpen(true), 80);
  };
  const onLeave = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSubOpen(false), 200);
  };

  return (
    <div
      className={hasKids ? 'x-horiznav__drop-parent' : undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        className={cls(
          'x-horiznav__drop-item',
          (active || subOpen) && 'is-active',
        )}
        onClick={() => {
          onNavigate(item.id);
          if (!hasKids) onClose();
        }}
      >
        {item.icon && (
          <Icon
            name={item.icon}
            size={14}
            style={{ color: 'var(--fg-3)', flex: 'none' }}
          />
        )}
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.count != null && (
          <span className="x-horiznav__count">{item.count}</span>
        )}
        {hasKids && (
          <Icon
            name="chevronRight"
            size={10}
            style={{ color: 'var(--fg-4)', flex: 'none', marginLeft: 'auto' }}
          />
        )}
      </button>
      {hasKids && subOpen && (
        <div className="x-horiznav__dropdown">
          {item.children.map((child) => (
            <HorizDropItem
              key={child.id}
              item={child}
              current={current}
              onNavigate={onNavigate}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const HorizNavItem = ({ item, current, onNavigate: rawNav }) => {
  const onNavigate = (id) => rawNav(id); // pass raw ID — navigate() handles resolveRoute
  const [dropOpen, setDropOpen] = React.useState(false);
  const ref = React.useRef(null);
  const hoverTimer = React.useRef(null);
  const active = isNavActive(item, current);
  const hasChildren = item.children && item.children.length > 0;

  React.useEffect(() => {
    if (!dropOpen) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setDropOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setDropOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [dropOpen]);

  const onEnter = () => {
    if (hasChildren) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = setTimeout(() => setDropOpen(true), 50);
    }
  };
  const onLeave = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setDropOpen(false), 150);
  };

  return (
    <div
      ref={ref}
      style={{ position: 'relative' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        className={cls('x-horiznav__item', active && 'is-active')}
        aria-current={active ? 'page' : undefined}
        aria-haspopup={hasChildren || undefined}
        aria-expanded={hasChildren ? dropOpen : undefined}
        onClick={() => {
          hasChildren ? setDropOpen((v) => !v) : onNavigate(item.id);
        }}
      >
        {item.icon && (
          <Icon name={item.icon} size={14} className="x-horiznav__icon" />
        )}
        <span>{item.label}</span>
        {item.count != null && (
          <span className="x-horiznav__count">{item.count}</span>
        )}
        {hasChildren && (
          <Icon
            name="caretDown"
            size={10}
            style={{
              color: 'var(--fg-4)',
              marginLeft: 2,
              transform: dropOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.12s ease',
            }}
          />
        )}
      </button>
      {hasChildren && dropOpen && (
        <div className="x-horiznav__dropdown">
          {item.children.map((child) => (
            <HorizDropItem
              key={child.id}
              item={child}
              current={current}
              onNavigate={onNavigate}
              onClose={() => setDropOpen(false)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- Horizontal nav (horizontal mode) --------------------------
const HorizontalNav = ({ current, onNavigate }) => {
  // Show max 8 primary items, rest go to "More" dropdown
  const primarySections = NAV_ITEMS.sections.flatMap((s) => s.items);
  const endItems = NAV_ITEMS.endItems;
  const maxVisible = 8;
  const visiblePrimary = primarySections.slice(0, maxVisible);
  const overflowItems = [...primarySections.slice(maxVisible), ...endItems];
  const hasOverflow = overflowItems.length > 0;

  const [moreOpen, setMoreOpen] = React.useState(false);
  const moreRef = React.useRef(null);
  const moreTimer = React.useRef(null);

  return (
    <nav className="x-horiznav" aria-label="Main navigation">
      {visiblePrimary.map((item) => (
        <HorizNavItem
          key={item.id}
          item={item}
          current={current}
          onNavigate={onNavigate}
        />
      ))}
      {hasOverflow && (
        <>
          <span className="x-horiznav__sep" />
          <div
            ref={moreRef}
            style={{ position: 'relative', flexShrink: 0 }}
            onMouseEnter={() => {
              clearTimeout(moreTimer.current);
              moreTimer.current = setTimeout(() => setMoreOpen(true), 50);
            }}
            onMouseLeave={() => {
              clearTimeout(moreTimer.current);
              moreTimer.current = setTimeout(() => setMoreOpen(false), 150);
            }}
          >
            <button
              className={cls(
                'x-horiznav__item',
                (moreOpen ||
                  overflowItems.some((it) => isNavActive(it, current))) &&
                  'is-active',
              )}
              onClick={(e) => {
                e.stopPropagation();
                setMoreOpen((v) => !v);
              }}
              type="button"
            >
              More
              <Icon name="caretDown" size={10} />
            </button>
            {moreOpen && (
              <div
                className="x-horiznav__dropdown"
                style={{ right: 0, left: 'auto', minWidth: 200 }}
              >
                {overflowItems.map((item) => (
                  <HorizDropItem
                    key={item.id}
                    item={item}
                    current={current}
                    onNavigate={onNavigate}
                    onClose={() => setMoreOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

// ---------- Stacked nav (stacked mode) --------------------------------
// Two columns only: Primary rail + Secondary panel.
// Click: permanently selects an item, secondary panel shows its children.
// Hover: temporarily swaps secondary panel content. Mouse leave reverts to clicked item.
const StackedNav = ({ current, onNavigate, collapsed }) => {
  const go = (k) => onNavigate && onNavigate(k);

  const activeItemIndex = React.useMemo(() => {
    for (let i = 0; i < NAV_ALL_ITEMS.length; i++) {
      if (isNavActive(NAV_ALL_ITEMS[i], current)) return i;
    }
    return 0;
  }, [current]);

  // Clicked/permanent selection — initialize based on current page
  const initItem = NAV_ALL_ITEMS[activeItemIndex];
  const [selectedIdx, setSelectedIdx] = React.useState(activeItemIndex);
  const [secNavOpen, setSecNavOpen] = React.useState(
    () =>
      !!(
        initItem &&
        initItem.children &&
        initItem.children.length > 0 &&
        isNavActive(initItem, current)
      ),
  );
  const [secWidth, setSecWidth] = React.useState(200);
  const [railWidth, setRailWidth] = React.useState(collapsed ? 56 : 200);

  const onRailResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = railWidth;
    const onMove = (ev) =>
      setRailWidth(Math.max(56, Math.min(300, startW + (ev.clientX - startX))));
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // Hover preview — temporarily overrides secondary panel content
  const [previewIdx, setPreviewIdx] = React.useState(null);
  const hoverTimer = React.useRef(null);

  // No useEffect to auto-sync — click handlers manage selectedIdx and secNavOpen explicitly.

  // The item to display in the secondary panel: hover preview overrides clicked selection
  const displayIdx = previewIdx != null ? previewIdx : selectedIdx;
  const displayItem = NAV_ALL_ITEMS[displayIdx] || NAV_ALL_ITEMS[0];
  // Panel shows from click (persistent) OR hover (temporary preview).
  // Always the same grid column — never a popup.
  const showSecondary =
    (secNavOpen || previewIdx != null) &&
    displayItem.children &&
    displayItem.children.length > 0;

  const onIconHover = (idx) => {
    clearTimeout(hoverTimer.current);
    const item = NAV_ALL_ITEMS[idx];
    if (item.children && item.children.length > 0) {
      hoverTimer.current = setTimeout(() => setPreviewIdx(idx), 80);
    }
  };
  const onIconLeave = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setPreviewIdx(null), 100);
  };
  const onSecEnter = () => {
    clearTimeout(hoverTimer.current);
  };
  const onSecLeave = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setPreviewIdx(null), 100);
  };

  const onSecResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = secWidth;
    const onMove = (ev) =>
      setSecWidth(Math.max(160, Math.min(360, startW + (ev.clientX - startX))));
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const isPreview = previewIdx != null && previewIdx !== selectedIdx;

  return (
    <>
      {/* Primary rail */}
      <div
        className={cls('x-iconrail', collapsed && 'is-collapsed')}
        role="tablist"
        aria-label="Navigation"
        style={{ width: collapsed ? 56 : railWidth }}
      >
        {/* Resize handle */}
        {!collapsed && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 4,
              cursor: 'col-resize',
              zIndex: 2,
              transition: 'background 0.1s ease',
            }}
            onMouseDown={onRailResize}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'var(--a-300)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          />
        )}
        {NAV_ALL_ITEMS.map((item, idx) => {
          const isPreviewing = idx === previewIdx;
          const hasActivePage = isNavActive(item, current);
          const isActive =
            hasActivePage ||
            isPreviewing ||
            (idx === selectedIdx && secNavOpen && previewIdx == null);
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cls('x-iconrail__btn', isActive && 'is-active')}
              title={collapsed ? item.label : undefined}
              onMouseEnter={() => onIconHover(idx)}
              onMouseLeave={onIconLeave}
              onClick={() => {
                clearTimeout(hoverTimer.current);
                setPreviewIdx(null);
                setSelectedIdx(idx);
                if (item.children && item.children.length > 0) {
                  // parent: toggle panel only, no navigation
                  if (selectedIdx === idx && secNavOpen) setSecNavOpen(false);
                  else setSecNavOpen(true);
                } else {
                  // leaf: navigate
                  go(item.id);
                  setSecNavOpen(false);
                }
              }}
            >
              <Icon name={item.icon} size={collapsed ? 18 : 15} />
              {!collapsed && (
                <span className="x-iconrail__label">{item.label}</span>
              )}
              {!collapsed && item.count != null && (
                <span className="x-iconrail__count">{item.count}</span>
              )}
            </button>
          );
        })}
        <div className="x-iconrail__spacer" />
        <div className="x-iconrail__tenant" title={NAV_ITEMS.org.name}>
          {NAV_ITEMS.org.initials}
        </div>
      </div>

      {/* Secondary panel — grid column, from click (persistent) or hover (temporary) */}
      {showSecondary && (
        <div
          className="x-secnav"
          role="tabpanel"
          style={{ width: secWidth }}
          onMouseEnter={onSecEnter}
          onMouseLeave={onSecLeave}
        >
          <div className="x-secnav__resizer" onMouseDown={onSecResize} />
          <div className="x-secnav__header">
            <span className="x-secnav__title">
              {displayItem.label}
              {isPreview ? '' : ''}
            </span>
            <button
              type="button"
              className="x-secnav__collapse"
              title="Collapse"
              onClick={() => {
                setSecNavOpen(false);
                setPreviewIdx(null);
              }}
            >
              <Icon name="chevronLeft" size={12} />
            </button>
          </div>
          <nav className="x-secnav__list">
            {displayItem.children.map((child) => {
              const active = isNavActive(child, current);
              const hasGc = child.children && child.children.length > 0;
              return (
                <React.Fragment key={child.id}>
                  <button
                    type="button"
                    className={cls(
                      'x-secnav__item',
                      active && !hasGc && 'is-active',
                    )}
                    onClick={() => {
                      go(child.id);
                      setSelectedIdx(displayIdx);
                      setSecNavOpen(true);
                      setPreviewIdx(null);
                    }}
                  >
                    <span>{child.label}</span>
                    {child.count != null && (
                      <span className="x-secnav__item-count">
                        {child.count}
                      </span>
                    )}
                  </button>
                  {hasGc &&
                    child.children.map((gc) => (
                      <button
                        key={gc.id}
                        type="button"
                        className={cls(
                          'x-secnav__item x-secnav__item--nested',
                          isNavActive(gc, current) && 'is-active',
                        )}
                        onClick={() => {
                          go(gc.id);
                          setSelectedIdx(displayIdx);
                          setSecNavOpen(true);
                          setPreviewIdx(null);
                        }}
                      >
                        <span>{gc.label}</span>
                      </button>
                    ))}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
};

// ---------- Appearance Settings Panel ---------------------------------
const AppearancePanel = ({
  open,
  onClose,
  theme,
  onThemeChange,
  density,
  onDensityChange,
  navLayout,
  onNavLayoutChange,
  iconSize = 'small',
  onIconSizeChange,
  collapsedBehavior = 'popover',
  onCollapsedBehaviorChange,
}) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('keydown', onKey);
    // Use a timeout so the click that opened the panel doesn't immediately close it
    const t = setTimeout(
      () => document.addEventListener('mousedown', onClick),
      0,
    );
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="x-appearance"
      ref={ref}
      role="dialog"
      aria-label="Appearance settings"
    >
      <div className="x-appearance__header">
        <span className="x-appearance__title">Appearance</span>
        <button
          type="button"
          className="x-appearance__close"
          onClick={onClose}
          title="Close"
        >
          <Icon name="x" size={14} />
        </button>
      </div>

      <div className="x-appearance__section">
        <div className="x-appearance__label">Theme</div>
        <div className="x-appearance__row">
          <button
            type="button"
            className={cls(
              'x-appearance__opt',
              theme === 'light' && 'is-active',
            )}
            onClick={() => onThemeChange('light')}
          >
            <Icon name="sun" size={14} />
            <span>Light</span>
          </button>
          <button
            type="button"
            className={cls(
              'x-appearance__opt',
              theme === 'dark' && 'is-active',
            )}
            onClick={() => onThemeChange('dark')}
          >
            <Icon name="moon" size={14} />
            <span>Dark</span>
          </button>
        </div>
      </div>

      <div className="x-appearance__section">
        <div className="x-appearance__label">Density</div>
        <div className="x-appearance__row">
          {[
            { value: 'compact', label: 'Compact' },
            { value: 'default', label: 'Default' },
            { value: 'comfortable', label: 'Airy' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={cls(
                'x-appearance__opt',
                density === opt.value && 'is-active',
              )}
              onClick={() => onDensityChange(opt.value)}
            >
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="x-appearance__section">
        <div className="x-appearance__label">Navigation</div>
        <div className="x-appearance__nav-grid">
          {[
            {
              value: 'sidebar',
              label: 'Sidebar',
              iconEl: (
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="27"
                    height="19"
                    rx="2"
                    stroke="currentColor"
                  />
                  <rect
                    x="0.5"
                    y="0.5"
                    width="8"
                    height="19"
                    rx="1"
                    fill="currentColor"
                    opacity="0.15"
                    stroke="currentColor"
                  />
                  <line
                    x1="0.5"
                    y1="4"
                    x2="8.5"
                    y2="4"
                    stroke="currentColor"
                    opacity="0.3"
                  />
                </svg>
              ),
            },
            {
              value: 'horizontal',
              label: 'Horizontal',
              iconEl: (
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="27"
                    height="19"
                    rx="2"
                    stroke="currentColor"
                  />
                  <rect
                    x="0.5"
                    y="0.5"
                    width="27"
                    height="4"
                    rx="1"
                    fill="currentColor"
                    opacity="0.15"
                    stroke="currentColor"
                  />
                  <rect
                    x="0.5"
                    y="4.5"
                    width="27"
                    height="3"
                    rx="0"
                    fill="currentColor"
                    opacity="0.08"
                    stroke="currentColor"
                    strokeOpacity="0.5"
                  />
                </svg>
              ),
            },
            {
              value: 'stacked',
              label: 'Stacked',
              iconEl: (
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="27"
                    height="19"
                    rx="2"
                    stroke="currentColor"
                  />
                  <rect
                    x="0.5"
                    y="0.5"
                    width="4"
                    height="19"
                    rx="1"
                    fill="currentColor"
                    opacity="0.2"
                    stroke="currentColor"
                  />
                  <rect
                    x="4.5"
                    y="0.5"
                    width="7"
                    height="19"
                    rx="0"
                    fill="currentColor"
                    opacity="0.08"
                    stroke="currentColor"
                    strokeOpacity="0.5"
                  />
                  <line
                    x1="0.5"
                    y1="4"
                    x2="4.5"
                    y2="4"
                    stroke="currentColor"
                    opacity="0.3"
                  />
                </svg>
              ),
            },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={cls(
                'x-appearance__nav-card',
                navLayout === opt.value && 'is-active',
              )}
              onClick={() => onNavLayoutChange(opt.value)}
            >
              <span className="x-appearance__nav-icon">{opt.iconEl}</span>
              <span className="x-appearance__nav-label">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="x-appearance__section">
        <div className="x-appearance__label">Sidebar Options</div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-group)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--fg-3)',
                marginBottom: 'var(--sp-inline)',
              }}
            >
              Icon size
            </div>
            <div className="x-appearance__row">
              <button
                type="button"
                className={cls(
                  'x-appearance__opt',
                  iconSize === 'small' && 'is-active',
                )}
                onClick={() => onIconSizeChange && onIconSizeChange('small')}
              >
                <Icon name="grid" size={12} />
                <span>Small</span>
              </button>
              <button
                type="button"
                className={cls(
                  'x-appearance__opt',
                  iconSize === 'large' && 'is-active',
                )}
                onClick={() => onIconSizeChange && onIconSizeChange('large')}
              >
                <Icon name="grid" size={18} />
                <span>Large</span>
              </button>
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--fg-3)',
                marginBottom: 'var(--sp-inline)',
              }}
            >
              Collapsed behavior
            </div>
            <div className="x-appearance__row">
              <button
                type="button"
                className={cls(
                  'x-appearance__opt',
                  collapsedBehavior === 'popover' && 'is-active',
                )}
                onClick={() =>
                  onCollapsedBehaviorChange &&
                  onCollapsedBehaviorChange('popover')
                }
              >
                <Icon name="external" size={14} />
                <span>Popover</span>
              </button>
              <button
                type="button"
                className={cls(
                  'x-appearance__opt',
                  collapsedBehavior === 'auto-expand' && 'is-active',
                )}
                onClick={() =>
                  onCollapsedBehaviorChange &&
                  onCollapsedBehaviorChange('auto-expand')
                }
              >
                <Icon name="sidebar" size={14} />
                <span>Auto-expand</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Topbar ----------------------------------------------------
const Topbar = ({
  currentModuleId,
  onPickModule,
  onToggleSidebar,
  onOpenNotifications,
  onNavigate,
  unreadCount = 0,
  theme,
  onToggleTheme,
  navLayout,
  onNavLayoutChange,
  density,
  onDensityChange,
  onThemeChange,
  iconSize,
  onIconSizeChange,
  collapsedBehavior,
  onCollapsedBehaviorChange,
}) => {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [appearanceOpen, setAppearanceOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const profileRef = React.useRef(null);
  React.useEffect(() => {
    if (!profileOpen) return;
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [profileOpen]);
  const mod = MODULES.find((m) => m.id === currentModuleId) || MODULES[0];

  return (
    <header className="x-topbar">
      <div className="x-topbar__left">
        {(navLayout === 'sidebar' || navLayout === 'stacked') && (
          <button
            type="button"
            className="x-topbar__iconbtn"
            onClick={onToggleSidebar}
            title="Toggle navigation"
          >
            <Icon name="sidebar" size={16} />
          </button>
        )}
        <button
          type="button"
          className={cls('x-topbar__iconbtn', pickerOpen && 'is-active')}
          onClick={() => setPickerOpen((v) => !v)}
          title="Switch module"
        >
          <Icon name="grid" size={16} />
        </button>
        <button
          type="button"
          className="x-modulechip"
          onClick={() => setPickerOpen((v) => !v)}
        >
          <span
            className="x-modulechip__icon"
            style={{ '--module-color': mod.color, background: mod.color }}
          >
            <Icon name={mod.icon} size={12} />
          </span>
          <span className="x-modulechip__name">{mod.name}</span>
          <span className="x-modulechip__caret">
            <Icon name="caretDown" size={12} />
          </span>
        </button>
        <ModulePicker
          open={pickerOpen}
          current={currentModuleId}
          onPick={(id) => {
            onPickModule(id);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
        <div
          style={{
            width: 1,
            height: 20,
            background: 'var(--border-subtle)',
            margin: '0 4px',
            flex: 'none',
          }}
        />
        <div className="x-topbar__brand">
          <span className="x-topbar__brand-word">XTND</span>
          <span className="x-topbar__brand-tag">Revenue realized</span>
        </div>
        {/* Tenant info for horizontal mode (moved from sidebar) */}
        {navLayout === 'horizontal' && (
          <>
            <div
              style={{
                width: 1,
                height: 20,
                background: 'var(--border-subtle)',
                margin: '0 8px',
                flex: 'none',
              }}
            />
            <div className="x-topbar__tenant-inline">
              <span className="x-topbar__tenant-avatar-sm">SM</span>
              <span className="x-topbar__tenant-name-sm">
                Sterling &amp; McGill
              </span>
            </div>
          </>
        )}
      </div>

      <div className="x-topbar__right">
        <div className="x-topbar__search-wrap">
          <span className="x-topbar__search-icon">
            <Icon name="search" size={14} />
          </span>
          <input placeholder="Search…" />
          <span className="x-topbar__search-kbd">{'⌘K'}</span>
        </div>
        <button
          type="button"
          className="x-topbar__iconbtn"
          title="Notifications"
          style={{ position: 'relative' }}
          onClick={onOpenNotifications}
        >
          <Icon name="bell" size={16} />
          {unreadCount > 0 && <span className="x-topbar__bell-dot" />}
        </button>
        <button type="button" className="x-topbar__iconbtn" title="Help">
          <Icon name="info" size={16} />
        </button>
        <button
          type="button"
          className="x-topbar__iconbtn"
          title="AI assistant"
        >
          <Icon name="sparkles" size={16} />
        </button>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={cls('x-topbar__iconbtn', appearanceOpen && 'is-active')}
            title="Appearance"
            onClick={() => setAppearanceOpen((v) => !v)}
          >
            <Icon name="sun" size={16} />
          </button>
          <AppearancePanel
            open={appearanceOpen}
            onClose={() => setAppearanceOpen(false)}
            theme={theme}
            onThemeChange={onThemeChange}
            density={density}
            onDensityChange={onDensityChange}
            navLayout={navLayout}
            onNavLayoutChange={onNavLayoutChange}
            iconSize={iconSize}
            onIconSizeChange={onIconSizeChange}
            collapsedBehavior={collapsedBehavior}
            onCollapsedBehaviorChange={onCollapsedBehaviorChange}
          />
        </div>
        <div
          style={{
            width: 1,
            height: 20,
            background: 'var(--border-subtle)',
            margin: '0 4px',
          }}
        />
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="x-topbar__iconbtn"
            onClick={(e) => {
              e.stopPropagation();
              setProfileOpen((v) => !v);
            }}
            title="Account"
            style={{ borderRadius: '50%', padding: 0, width: 28, height: 28 }}
          >
            <Avatar name="Eleanor Wu" size="sm" />
          </button>
          {profileOpen && (
            <div className="x-user-profile">
              <div className="x-user-profile__header">
                <Avatar name="Eleanor Wu" size="lg" />
                <div className="x-user-profile__info">
                  <div className="x-user-profile__name">Eleanor Wu</div>
                  <div className="x-user-profile__email">
                    eleanor.wu@sterlingmcgill.com
                  </div>
                </div>
              </div>
              <div className="x-user-profile__org">
                <div className="x-user-profile__org-name">
                  Sterling & McGill LLP
                </div>
                <div className="x-user-profile__org-id">Org ID: ORG-SM-001</div>
              </div>
              <div className="x-user-profile__menu">
                <button
                  type="button"
                  className="x-user-profile__item"
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigate && onNavigate('profile');
                  }}
                >
                  <Icon name="user" size={14} />
                  Profile
                </button>
                <button
                  type="button"
                  className="x-user-profile__item"
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigate && onNavigate('user-settings');
                  }}
                >
                  <Icon name="settings" size={14} />
                  Settings
                </button>
              </div>
              <div className="x-user-profile__divider" />
              <div className="x-user-profile__menu">
                <button
                  type="button"
                  className="x-user-profile__item x-user-profile__item--danger"
                  onClick={() => setProfileOpen(false)}
                >
                  <Icon name="external" size={14} />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ---------- Breadcrumbs (in-page) ------------------------------------
const Breadcrumbs = ({ items = [] }) => (
  <nav className="x-crumbs" aria-label="Breadcrumb">
    {items.map((b, i) => {
      const active = i === items.length - 1;
      return (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="x-crumbs__sep">
              <Icon name="chevronRight" size={10} />
            </span>
          )}
          <span
            className={cls(
              'x-crumbs__item',
              active && 'x-crumbs__item--active',
            )}
          >
            {b.onClick && !active ? (
              <button type="button" onClick={b.onClick}>
                {b.label}
              </button>
            ) : (
              b.label
            )}
          </span>
        </React.Fragment>
      );
    })}
  </nav>
);

// ---------- AppShell --------------------------------------------------
const AppShell = ({
  current,
  onNavigate,
  currentModuleId,
  onPickModule,
  children,
  sidebarCollapsed,
  onToggleSidebar,
  onOpenNotifications,
  unreadCount,
  theme,
  onToggleTheme,
  onThemeChange,
  navLayout = 'sidebar',
  onNavLayoutChange,
  density,
  onDensityChange,
  iconSize = 'small',
  onIconSizeChange,
  collapsedBehavior = 'popover',
  onCollapsedBehaviorChange,
}) => {
  const [sidebarWidth, setSidebarWidth] = React.useState(232);
  const [autoExpanded, setAutoExpanded] = React.useState(false);
  const autoExpandTimer = React.useRef(null);
  const onSidebarResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = sidebarWidth;
    const onMove = (ev) =>
      setSidebarWidth(
        Math.max(180, Math.min(360, startW + (ev.clientX - startX))),
      );
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const dataNav = navLayout || 'sidebar';
  // Auto-expand: temporarily show full sidebar on hover when collapsed
  const isAutoExpanded =
    sidebarCollapsed && collapsedBehavior === 'auto-expand' && autoExpanded;
  // Grid stays collapsed during auto-expand — overlay doesn't shift content
  const dataSidebar =
    navLayout === 'sidebar'
      ? sidebarCollapsed
        ? 'collapsed'
        : 'expanded'
      : undefined;

  // Dynamic grid columns for sidebar mode with resize
  const gridStyle =
    navLayout === 'sidebar' && !sidebarCollapsed
      ? { gridTemplateColumns: `${sidebarWidth}px 1fr` }
      : undefined;

  return (
    <div
      className="x-app"
      data-nav={dataNav}
      data-sidebar={dataSidebar}
      data-icon-size={iconSize || 'small'}
      style={gridStyle}
    >
      <Topbar
        currentModuleId={currentModuleId}
        onPickModule={onPickModule}
        onToggleSidebar={onToggleSidebar}
        onOpenNotifications={onOpenNotifications}
        onNavigate={onNavigate}
        unreadCount={unreadCount}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onThemeChange={onThemeChange}
        navLayout={navLayout}
        onNavLayoutChange={onNavLayoutChange}
        density={density}
        onDensityChange={onDensityChange}
        iconSize={iconSize}
        onIconSizeChange={onIconSizeChange}
        collapsedBehavior={collapsedBehavior}
        onCollapsedBehaviorChange={onCollapsedBehaviorChange}
      />
      {navLayout === 'sidebar' && (
        <Sidebar
          current={current}
          onNavigate={(id) => {
            onNavigate(id);
            if (isAutoExpanded) setAutoExpanded(false);
          }}
          module={MODULES.find((m) => m.id === currentModuleId)}
          width={sidebarCollapsed ? undefined : sidebarWidth}
          onResize={sidebarCollapsed ? undefined : onSidebarResize}
          collapsed={sidebarCollapsed}
          collapsedBehavior={collapsedBehavior}
          isAutoExpanded={isAutoExpanded}
          onMouseEnter={() => {
            if (sidebarCollapsed && collapsedBehavior === 'auto-expand') {
              clearTimeout(autoExpandTimer.current);
              autoExpandTimer.current = setTimeout(
                () => setAutoExpanded(true),
                80,
              );
            }
          }}
          onMouseLeave={() => {
            clearTimeout(autoExpandTimer.current);
            if (isAutoExpanded)
              autoExpandTimer.current = setTimeout(
                () => setAutoExpanded(false),
                200,
              );
          }}
        />
      )}
      {navLayout === 'horizontal' && (
        <HorizontalNav current={current} onNavigate={onNavigate} />
      )}
      {navLayout === 'stacked' && (
        <StackedNav
          current={current}
          onNavigate={onNavigate}
          collapsed={sidebarCollapsed}
        />
      )}
      <main className="x-main">
        {children}
        <AppFooter />
      </main>
    </div>
  );
};

Object.assign(window, {
  NavItem,
  Sidebar,
  HorizontalNav,
  StackedNav,
  Topbar,
  AppShell,
  Breadcrumbs,
  AppearancePanel,
  MODULES,
  ModuleGlyph,
  NAV_ITEMS,
  resolveRoute,
});
