/* global React, Icon, Checkbox, cls */

// =========================================================================
// BulkActionBar — floating or inline toolbar bulk actions.
// =========================================================================

const BulkActionBar = ({
  mode = 'floating',
  selected,
  totalRows,
  onSelectAll,
  onClearSelection,
  allSelected,
  someSelected,
  actions = [],
}) => {
  if (!selected || selected.size === 0) return null;

  if (mode === 'toolbar') {
    return actions.map((a) => (
      <button
        type="button"
        key={a.id}
        className="x-btn x-btn--secondary x-btn--sm"
        onClick={() => a.onClick && a.onClick(selected)}
      >
        {a.icon && <Icon name={a.icon} size={14} />}
        {a.label}
      </button>
    ));
  }

  return (
    <div className="x-bulk-bar">
      <Checkbox
        checked={allSelected}
        indeterminate={someSelected}
        onChange={onSelectAll}
      />
      <span className="x-bulk-bar__count">{selected.size} selected</span>
      <div className="x-bulk-bar__sep" />
      {actions.map((a) => (
        <button
          type="button"
          key={a.id}
          className={cls(
            'x-bulk-bar__btn',
            a.variant === 'danger' && 'x-bulk-bar__btn--danger',
          )}
          onClick={() => a.onClick && a.onClick(selected)}
        >
          <Icon name={a.icon} size={14} />
          {a.label}
        </button>
      ))}
      <div className="x-bulk-bar__sep" />
      <button
        type="button"
        className="x-bulk-bar__close"
        onClick={onClearSelection}
        title="Deselect all"
      >
        <Icon name="x" size={14} />
      </button>
    </div>
  );
};

Object.assign(window, { BulkActionBar });
