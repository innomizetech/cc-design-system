/* global React, Icon, Button, IconButton, Checkbox, Badge, Chip, cls, formatFilterDisplay */
const _W = new Proxy({}, { get: (_, k) => window[k] });

// =========================================================================
// DataGrid filter components — composable pieces for the toolbar slot.
// 1. SearchInput      — search field with icon
// 2. ChipFilterBar    — active filter chips + add filter popover
// 3. AdvancedFilterModal — field + operator + value condition builder
// =========================================================================

// --- Shared: click-outside hook ------------------------------------------
const useClickOutside = (ref, handler, active = true) => {
  React.useEffect(() => {
    if (!active) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    const onKey = (e) => { if (e.key === 'Escape') handler(); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [active, handler]);
};

// =========================================================================
// 1. SearchInput
// =========================================================================
const GridSearchInput = ({
  value = '',
  onChange,
  placeholder = 'Search…',
  width = 220,
}) => (
  <div style={{ position: 'relative', width }}>
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
      style={{ paddingLeft: 32, height: 'var(--btn-h-sm)' }}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  </div>
);

// =========================================================================
// 2. ChipFilterBar
// =========================================================================

const DG_MultiSelectEditor = ({ field, data, onApply, onClose }) => {
  const [vals, setVals] = React.useState(new Set(data?.values || []));
  const toggle = (v) => {
    const n = new Set(vals);
    n.has(v) ? n.delete(v) : n.add(v);
    setVals(n);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-inline)' }}>
      <div style={{ maxHeight: 200, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {(field.options || []).map((o) => (
          <label
            key={o.value}
            className="x-popover__row"
            style={{ cursor: 'pointer', padding: 'var(--sp-1) var(--popover-row-pad-x)' }}
          >
            <Checkbox checked={vals.has(o.value)} onChange={() => toggle(o.value)} />
            <span style={{ flex: 1, fontSize: 'var(--fs-sm)' }}>{o.label}</span>
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-inline)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--sp-inline)' }}>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button
          variant="accent"
          size="sm"
          onClick={() => onApply({ values: Array.from(vals) })}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

const DG_TextEditor = ({ data, onApply, onClose }) => {
  const [text, setText] = React.useState(data?.text || '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-inline)' }}>
      <input
        className="x-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type to filter…"
        autoFocus
        onKeyDown={(e) => { if (e.key === 'Enter') onApply({ text }); if (e.key === 'Escape') onClose(); }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-inline)' }}>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button variant="accent" size="sm" onClick={() => onApply({ text })}>Apply</Button>
      </div>
    </div>
  );
};

const DG_RangeEditor = ({ data, onApply, onClose, labels = ['Min', 'Max'] }) => {
  const [min, setMin] = React.useState(data?.min ?? '');
  const [max, setMax] = React.useState(data?.max ?? '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-inline)' }}>
      <div style={{ display: 'flex', gap: 'var(--sp-inline)' }}>
        <input className="x-input" type="number" placeholder={labels[0]} value={min} onChange={(e) => setMin(e.target.value)} style={{ flex: 1 }} />
        <input className="x-input" type="number" placeholder={labels[1]} value={max} onChange={(e) => setMax(e.target.value)} style={{ flex: 1 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-inline)' }}>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button variant="accent" size="sm" onClick={() => onApply({ min: min || undefined, max: max || undefined })}>Apply</Button>
      </div>
    </div>
  );
};

const DG_DateRangeEditor = ({ data, onApply, onClose }) => {
  const [from, setFrom] = React.useState(data?.from || '');
  const [to, setTo] = React.useState(data?.to || '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-inline)' }}>
      <div style={{ display: 'flex', gap: 'var(--sp-inline)', alignItems: 'center' }}>
        <input className="x-input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={{ flex: 1 }} />
        <span style={{ color: 'var(--fg-3)', fontSize: 'var(--fs-sm)' }}>to</span>
        <input className="x-input" type="date" value={to} onChange={(e) => setTo(e.target.value)} style={{ flex: 1 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-inline)' }}>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button variant="accent" size="sm" onClick={() => onApply({ from: from || undefined, to: to || undefined })}>Apply</Button>
      </div>
    </div>
  );
};

const DG_EDITORS = {
  multiselect: DG_MultiSelectEditor,
  text: DG_TextEditor,
  range: DG_RangeEditor,
  daterange: DG_DateRangeEditor,
};

const formatChipValue = (field, data) => {
  if (field.formatValue) return field.formatValue(data);
  return formatFilterDisplay(data);
};

const ChipFilterBar = ({
  filterFields = [],
  activeFilters = [],
  onFiltersChange,
  filterEditors,
  maxVisible = 3,
}) => {
  const [addOpen, setAddOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const addRef = React.useRef(null);
  const editRef = React.useRef(null);

  useClickOutside(addRef, () => setAddOpen(false), addOpen);
  useClickOutside(editRef, () => setEditingId(null), !!editingId);

  const addFilter = (field) => {
    setAddOpen(false);
    setEditingId(field.id);
    if (!activeFilters.find((f) => f.id === field.id)) {
      onFiltersChange && onFiltersChange([
        ...activeFilters,
        { id: field.id, label: field.label, data: {}, value: '' },
      ]);
    }
  };

  const updateFilter = (id, data) => {
    const field = filterFields.find((f) => f.id === id);
    const value = field ? formatChipValue(field, data) : '';
    onFiltersChange && onFiltersChange(
      activeFilters.map((f) => (f.id === id ? { ...f, data, value } : f))
    );
    setEditingId(null);
  };

  const removeFilter = (id) => {
    onFiltersChange && onFiltersChange(activeFilters.filter((f) => f.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const availableFields = filterFields.filter(
    (f) => !activeFilters.find((a) => a.id === f.id)
  );

  const overflowCount = activeFilters.length - maxVisible;
  const showOverflow = overflowCount > 0 && !expanded;
  const visibleFilters = showOverflow ? activeFilters.slice(0, maxVisible) : activeFilters;

  const renderChip = (af) => {
    const field = filterFields.find((f) => f.id === af.id);
    const isEditing = editingId === af.id;
    const hasValue = af.value && af.value !== '…';
    return (
      <div key={af.id} style={{ position: 'relative', zIndex: isEditing ? 40 : undefined }} ref={isEditing ? editRef : undefined}>
        <Chip
          label={af.label}
          value={af.value || '…'}
          active={hasValue || isEditing}
          onClick={() => setEditingId(isEditing ? null : af.id)}
          onRemove={() => removeFilter(af.id)}
        />
        {isEditing && field && (
          <div className="x-popover" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: 300, zIndex: 50 }}>
            <div className="x-popover__header">{field.label}</div>
            {(() => {
              const CustomEditor = filterEditors && filterEditors[field.id];
              const BuiltinEditor = DG_EDITORS[field.type];
              const Editor = CustomEditor || BuiltinEditor;
              return Editor ? (
                <Editor
                  field={field}
                  data={af.data}
                  onApply={(data) => updateFilter(af.id, data)}
                  onClose={() => setEditingId(null)}
                />
              ) : (
                <DG_TextEditor data={af.data} onApply={(data) => updateFilter(af.id, data)} onClose={() => setEditingId(null)} />
              );
            })()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="x-filter-bar">
      {visibleFilters.map(renderChip)}

      {/* +N more / Show less toggle */}
      {overflowCount > 0 && (
        <button
          type="button"
          className="x-filter-bar__more"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : `+${overflowCount} more`}
        </button>
      )}

      {/* Add filter button */}
      {availableFields.length > 0 && (
        <div style={{ position: 'relative', zIndex: addOpen ? 40 : undefined }} ref={addRef}>
          <button
            type="button"
            className="x-filter-bar__add"
            onClick={() => setAddOpen(!addOpen)}
          >
            <Icon name="filter" size={12} />
            Add filter
          </button>
          {addOpen && (
            <div className="x-popover" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: 220, zIndex: 50, maxHeight: 360, overflowY: 'auto' }}>
              <div className="x-popover__header">Filter by</div>
              {availableFields.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  className="x-popover__row"
                  onClick={() => addFilter(f)}
                  style={{ width: '100%', cursor: 'pointer', border: 'none', background: 'none', textAlign: 'left' }}
                >
                  <Icon name={f.icon || 'filter'} size={14} style={{ color: 'var(--fg-3)' }} />
                  <span style={{ fontSize: 'var(--fs-sm)' }}>{f.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 3. AdvancedFilterModal
// =========================================================================

const DEFAULT_OPERATORS = [
  { value: 'is', label: 'Is' },
  { value: 'is_not', label: 'Is not' },
  { value: 'contains', label: 'Contains' },
  { value: 'gt', label: 'Greater than' },
  { value: 'lt', label: 'Less than' },
  { value: 'between', label: 'Between' },
  { value: 'is_empty', label: 'Is empty' },
];

let _afmIdCounter = 0;

const AdvancedFilterModal = ({
  open,
  onClose,
  onApply,
  fields = [],
  initialConditions = [],
  operators,
  anchorRef,
}) => {
  const ref = React.useRef(null);

  const [conditions, setConditions] = React.useState(() =>
    initialConditions.length > 0
      ? initialConditions
      : [{ id: String(++_afmIdCounter), field: '', operator: 'is', value: '' }]
  );

  React.useEffect(() => {
    if (open && initialConditions.length > 0) setConditions(initialConditions);
  }, [open]);

  const addCondition = () => {
    setConditions([...conditions, { id: String(++_afmIdCounter), field: '', operator: 'is', value: '' }]);
  };

  const updateCondition = (id, patch) => {
    setConditions(conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const removeCondition = (id) => {
    const next = conditions.filter((c) => c.id !== id);
    if (next.length === 0) next.push({ id: String(++_afmIdCounter), field: '', operator: 'is', value: '' });
    setConditions(next);
  };

  const getOps = (fieldId) => {
    if (operators && operators[fieldId]) return operators[fieldId];
    const f = fields.find((x) => x.id === fieldId);
    if (!f) return DEFAULT_OPERATORS;
    if (f.type === 'multiselect') return [{ value: 'is', label: 'Is' }, { value: 'is_not', label: 'Is not' }];
    if (f.type === 'range') return [{ value: 'gt', label: '>' }, { value: 'lt', label: '<' }, { value: 'between', label: 'Between' }, { value: 'is', label: '=' }];
    if (f.type === 'daterange') return [{ value: 'is', label: 'Is' }, { value: 'gt', label: 'After' }, { value: 'lt', label: 'Before' }, { value: 'between', label: 'Between' }];
    return DEFAULT_OPERATORS;
  };

  if (!open) return null;

  return (
    <>
    <div className="x-filter-modal__scrim" onClick={onClose} />
    <div className="x-filter-modal" ref={ref} onClick={(e) => e.stopPropagation()}>
      <div className="x-filter-modal__title">
        Custom filtering
        <IconButton icon="x" onClick={onClose} />
      </div>
      <div className="x-filter-modal__rows">
        {conditions.map((c) => {
          const selectedField = fields.find((f) => f.id === c.field);
          const ops = getOps(c.field);
          return (
            <div key={c.id} className="x-filter-modal__row">
              <div className="x-filter-modal__field-select">
                <_W.GridSelect
                  value={c.field}
                  placeholder="Select field"
                  options={fields.map((f) => ({ value: f.id, label: f.label, icon: f.icon }))}
                  onChange={(v) => updateCondition(c.id, { field: v, value: '' })}
                />
              </div>
              <div className="x-filter-modal__op-select">
                <_W.GridSelect
                  value={c.operator}
                  options={ops}
                  onChange={(v) => updateCondition(c.id, { operator: v })}
                />
              </div>
              {selectedField?.type === 'multiselect' ? (
                <div style={{ flex: 1 }}>
                  <_W.GridSelect
                    value={c.value}
                    placeholder="Select…"
                    options={selectedField.options || []}
                    onChange={(v) => updateCondition(c.id, { value: v })}
                  />
                </div>
              ) : (
                <input
                  className="x-input"
                  value={c.value}
                  onChange={(e) => updateCondition(c.id, { value: e.target.value })}
                  placeholder="Enter value…"
                  style={{ flex: 1 }}
                />
              )}
              <button type="button" className="x-filter-modal__remove" onClick={() => removeCondition(c.id)}>
                <Icon name="x" size={14} />
              </button>
            </div>
          );
        })}
      </div>
      <div className="x-filter-modal__add">
        <Button variant="ghost" size="sm" icon="plus" onClick={addCondition}>
          Add condition
        </Button>
      </div>
      <div className="x-filter-modal__footer">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button
          variant="accent"
          onClick={() => {
            onApply && onApply(conditions.filter((c) => c.field));
            onClose();
          }}
        >
          Apply filter
        </Button>
      </div>
    </div>
    </>
  );
};

Object.assign(window, { GridSearchInput, ChipFilterBar, AdvancedFilterModal, useClickOutside });
