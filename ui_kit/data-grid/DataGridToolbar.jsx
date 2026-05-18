/* global React, Icon, Button, IconButton, Checkbox, Segmented, cls, useClickOutside */

// =========================================================================
// DataGrid toolbar components:
// 1. GridActions       — quick action buttons + "more" dropdown + refresh/settings
// 2. GridSettingsPanel — Columns tab + Settings tab (popover)
// 3. GridFullscreen    — fullscreen wrapper
// 4. Toggle            — reusable toggle switch primitive
// =========================================================================

// --- Toggle switch -------------------------------------------------------
const Toggle = ({ checked, onChange, id }) => (
  <label className="x-toggle">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange && onChange(e.target.checked)}
      id={id}
    />
    <span className="x-toggle__track" />
    <span className="x-toggle__thumb" />
  </label>
);

// --- Grid Actions --------------------------------------------------------
const GridActions = ({
  quickActions = [],
  moreActions = [],
  onRefresh,
  onSettingsClick,
  settingsActive,
  onFullscreen,
  refreshing,
  children,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  return (
    <>
      {children}
      {quickActions.map((a) => (
        <Button
          key={a.id}
          variant="secondary"
          size="sm"
          icon={a.icon}
          onClick={a.onClick}
        >
          {a.label}
        </Button>
      ))}

      {moreActions.length > 0 && (
        <div ref={menuRef} style={{ position: 'relative' }}>
          <IconButton
            icon="more"
            onClick={() => setMenuOpen((v) => !v)}
            title="More actions"
          />
          {menuOpen && (
            <div className="x-grid-actions-menu">
              {moreActions.map((a, i) =>
                a.divider ? (
                  <div key={`d${i}`} className="x-grid-actions-menu__divider" />
                ) : (
                  <button
                    type="button"
                    key={a.id}
                    className="x-grid-actions-menu__item"
                    onClick={() => {
                      a.onClick && a.onClick();
                      setMenuOpen(false);
                    }}
                  >
                    {a.icon && (
                      <Icon
                        name={a.icon}
                        size={14}
                        style={{ color: 'var(--fg-3)', flex: 'none' }}
                      />
                    )}
                    {a.label}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      )}

      {onRefresh && (
        <IconButton
          icon="refresh"
          onClick={onRefresh}
          title="Refresh"
          className={refreshing ? 'x-spin' : undefined}
        />
      )}
      {onSettingsClick && (
        <IconButton
          icon="settings"
          onClick={onSettingsClick}
          title="Grid settings"
          className={settingsActive ? 'is-active' : undefined}
          aria-expanded={settingsActive}
        />
      )}
      {onFullscreen && (
        <IconButton icon="expand" onClick={onFullscreen} title="Fullscreen" />
      )}
    </>
  );
};

// --- Grid Settings Panel -------------------------------------------------
const GridSettingsPanel = ({
  open,
  onClose,
  columns = [],
  onColumnsChange,
  density,
  onDensityChange,
  fitWindow,
  onFitWindowChange,
  fixedHeader,
  onFixedHeaderChange,
}) => {
  const ref = React.useRef(null);
  const [tab, setTab] = React.useState('columns');
  const [colSearch, setColSearch] = React.useState('');
  const [showOnlyVisible, setShowOnlyVisible] = React.useState(false);

  if (!open) return null;

  const filteredCols = columns.filter((c) => {
    if (
      colSearch &&
      !c.label.toLowerCase().includes(colSearch.toLowerCase()) &&
      !c.key.toLowerCase().includes(colSearch.toLowerCase())
    )
      return false;
    if (showOnlyVisible && c.visible !== undefined && c.visible === false)
      return false;
    return true;
  });

  const toggleColVisibility = (key) => {
    if (!onColumnsChange) return;
    onColumnsChange(
      columns.map((c) =>
        c.key === key
          ? { ...c, visible: c.visible === false ? true : false }
          : c,
      ),
    );
  };

  const visibleCount = columns.filter((c) => c.visible !== false).length;

  return (
    <>
      <div className="x-grid-settings-scrim" onClick={onClose} />
      <div className="x-grid-settings" ref={ref}>
        <div className="x-grid-settings__header">
          <span className="x-grid-settings__title">Grid settings</span>
          <IconButton icon="x" onClick={onClose} />
        </div>

        <div className="x-grid-settings__tabs">
          <button
            type="button"
            className="x-grid-settings__tab"
            aria-selected={tab === 'columns'}
            onClick={() => setTab('columns')}
          >
            Columns
          </button>
          <button
            type="button"
            className="x-grid-settings__tab"
            aria-selected={tab === 'settings'}
            onClick={() => setTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="x-grid-settings__body">
          {tab === 'columns' && (
            <>
              <div className="x-grid-settings__desc">
                Configure column visibility and order.
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 'var(--sp-inline)',
                  alignItems: 'center',
                  marginBottom: 'var(--sp-group)',
                }}
              >
                <div style={{ position: 'relative', flex: 1 }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--fg-3)',
                      pointerEvents: 'none',
                    }}
                  >
                    <Icon name="search" size={14} />
                  </span>
                  <input
                    className="x-input"
                    style={{ paddingLeft: 32 }}
                    placeholder="Search columns…"
                    value={colSearch}
                    onChange={(e) => setColSearch(e.target.value)}
                  />
                </div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-1)',
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--fg-2)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >
                  <Checkbox
                    checked={showOnlyVisible}
                    onChange={() => setShowOnlyVisible(!showOnlyVisible)}
                  />
                  Show only visible
                </label>
              </div>

              <div className="x-grid-settings__col-list">
                {filteredCols.map((c) => {
                  const isVisible = c.visible !== false;
                  return (
                    <div key={c.key} className="x-grid-settings__col-item">
                      <span className="x-grid-settings__col-drag">
                        <Icon name="grid" size={12} />
                      </span>
                      <div className="x-grid-settings__col-meta">
                        <div className="x-grid-settings__col-name">
                          {c.label}
                        </div>
                        <div className="x-grid-settings__col-key">{c.key}</div>
                      </div>
                      <div className="x-grid-settings__col-actions">
                        <Checkbox
                          checked={isVisible}
                          onChange={() => toggleColVisibility(c.key)}
                        />
                        <span
                          className={cls(
                            'x-grid-settings__vis-icon',
                            !isVisible && 'is-hidden',
                          )}
                        >
                          <Icon name={isVisible ? 'eye' : 'eyeOff'} size={14} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 'var(--sp-group)',
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--fg-3)',
                }}
              >
                {visibleCount} of {columns.length} columns visible
              </div>
            </>
          )}

          {tab === 'settings' && (
            <>
              <div className="x-grid-settings__desc">
                Configure grid behavior and appearance settings.
              </div>

              {onFitWindowChange && (
                <div className="x-grid-settings__row">
                  <div className="x-grid-settings__row-header">
                    <span className="x-grid-settings__row-label">
                      Fit window height
                    </span>
                    <Toggle
                      checked={!!fitWindow}
                      onChange={onFitWindowChange}
                    />
                  </div>
                  <span className="x-grid-settings__row-desc">
                    Automatically adjust grid height to fit the window. Disable
                    to show all items with scrollbar.
                  </span>
                </div>
              )}

              {onDensityChange && (
                <div className="x-grid-settings__row">
                  <span className="x-grid-settings__row-label">Row mode</span>
                  <span className="x-grid-settings__row-desc">
                    Adjust row density and spacing for better readability.
                  </span>
                  <div style={{ marginTop: 'var(--sp-inline)' }}>
                    <Segmented
                      value={density || 'default'}
                      onChange={onDensityChange}
                      options={[
                        { value: 'compact', label: 'Compact' },
                        { value: 'default', label: 'Default' },
                        { value: 'comfortable', label: 'Comfortable' },
                      ]}
                    />
                  </div>
                </div>
              )}

              {onFixedHeaderChange && (
                <div className="x-grid-settings__row">
                  <div className="x-grid-settings__row-header">
                    <span className="x-grid-settings__row-label">
                      Fixed header
                    </span>
                    <Toggle
                      checked={fixedHeader !== false}
                      onChange={onFixedHeaderChange}
                    />
                  </div>
                  <span className="x-grid-settings__row-desc">
                    Keep the table header visible when scrolling through data.
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

// --- Grid Fullscreen Wrapper ---------------------------------------------
const GridFullscreen = ({ open, onClose, title, description, children }) => {
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
    <div className="x-grid-fullscreen">
      <div className="x-grid-fullscreen__header">
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && <div className="x-grid-fullscreen__title">{title}</div>}
          {description && (
            <div className="x-grid-fullscreen__desc">{description}</div>
          )}
        </div>
        <IconButton icon="x" onClick={onClose} />
      </div>
      <div className="x-grid-fullscreen__body">{children}</div>
    </div>
  );
};

// --- GridSelect — custom styled dropdown for toolbar ----------------------
const GridSelect = ({ label, value, options = [], onChange, placeholder }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  const selected = options.find((o) => o.value === value && o.value !== '');
  const displayLabel = selected?.label || placeholder || value || '—';
  const isPlaceholder = !selected;

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && ref.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const menuDirection = () => {
    if (!ref.current) return {};
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < 200 && rect.top > spaceBelow) {
      return { bottom: '100%', marginBottom: 4 };
    }
    return { top: '100%', marginTop: 4 };
  };

  return (
    <div className="x-grid-select" ref={ref} style={{ position: 'relative' }}>
      <button
        className="x-grid-select__trigger"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        type="button"
      >
        {label && <span className="x-grid-select__label">{label}</span>}
        <span
          className={cls(
            'x-grid-select__value',
            isPlaceholder && 'is-placeholder',
          )}
        >
          {displayLabel}
        </span>
        <Icon
          name="caretDown"
          size={10}
          style={{ color: 'var(--fg-4)', flex: 'none' }}
        />
      </button>
      {open && (
        <div className="x-grid-select__menu" style={menuDirection()}>
          {options
            .filter((o) => o.value !== '')
            .map((o) => (
              <button
                key={o.value}
                type="button"
                className={cls(
                  'x-grid-select__option',
                  value === o.value && 'is-active',
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange && onChange(o.value);
                  setOpen(false);
                }}
              >
                {o.icon && (
                  <Icon
                    name={o.icon}
                    size={14}
                    style={{ color: 'var(--fg-3)', flex: 'none' }}
                  />
                )}
                <span style={{ flex: 1 }}>{o.label}</span>
                {value === o.value && (
                  <Icon
                    name="check"
                    size={12}
                    style={{ color: 'var(--fg-accent)', flex: 'none' }}
                  />
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

Object.assign(window, {
  GridActions,
  GridSettingsPanel,
  GridFullscreen,
  Toggle,
  GridSelect,
});
