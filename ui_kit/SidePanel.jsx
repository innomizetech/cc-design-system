/* global React, Icon, IconButton, cls */

// ======================================================================
// SidePanel — resizable right panel for per-entity context (comments,
// audit, collaborators). Sits inline next to main content.
//
// Props:
//   open, onClose, onResize     — controlled by parent
//   width                       — current width in px
//   tabs: [{ value, label, icon, count }]
//   tab, onTabChange            — active tab
//   storageKey                  — localStorage key for width persistence
//   children                    — body content (rendered inside scroll area)
// ======================================================================

const SidePanel = ({
  open = true,
  onClose,
  tabs = [],
  tab,
  onTabChange,
  width = 420,
  minWidth = 300,
  maxWidth = 640,
  onWidthChange,
  storageKey,
  children,
  headerExtra,
}) => {
  const [dragging, setDragging] = React.useState(false);
  const widthRef = React.useRef(width);
  widthRef.current = width;

  React.useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = parseInt(localStorage.getItem(storageKey), 10);
      if (
        !isNaN(saved) &&
        saved >= minWidth &&
        saved <= maxWidth &&
        onWidthChange
      ) {
        onWidthChange(saved);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    const startX = e.clientX;
    const startW = widthRef.current;
    const onMove = (ev) => {
      const delta = startX - ev.clientX; // dragging LEFT makes panel wider
      const next = Math.max(minWidth, Math.min(maxWidth, startW + delta));
      onWidthChange && onWidthChange(next);
    };
    const onUp = () => {
      setDragging(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, String(widthRef.current));
        } catch {}
      }
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  if (!open) return null;

  return (
    <aside className="x-sidepanel" style={{ width }}>
      <div
        className={cls('x-sidepanel__resizer', dragging && 'is-dragging')}
        onMouseDown={onMouseDown}
        role="separator"
        aria-orientation="vertical"
        title="Drag to resize"
      />
      <div className="x-sidepanel__header">
        <div className="x-sidepanel__tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.value}
              className="x-sidepanel__tab"
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => onTabChange && onTabChange(t.value)}
            >
              {t.icon && <Icon name={t.icon} size={13} />}
              {t.label}
              {t.count != null && (
                <span className="x-sidepanel__tab-count">{t.count}</span>
              )}
            </button>
          ))}
        </div>
        {headerExtra}
        {onClose && (
          <IconButton icon="x" onClick={onClose} title="Close panel" />
        )}
      </div>
      <div className="x-sidepanel__body">{children}</div>
    </aside>
  );
};

Object.assign(window, { SidePanel });
