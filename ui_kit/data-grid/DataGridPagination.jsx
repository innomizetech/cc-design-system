/* global React, Icon, IconButton, GridSelect */

// =========================================================================
// DataGridPagination — footer with page navigation + page size selector.
// =========================================================================

const DataGridPagination = ({
  totalRows = 0,
  page = 1,
  pageSize = 25,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = true,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const start = Math.min((page - 1) * pageSize + 1, totalRows);
  const end = Math.min(page * pageSize, totalRows);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--toolbar-pad-y) var(--toolbar-pad-x)',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--fs-sm)',
        color: 'var(--fg-3)',
      }}
    >
      <span>
        Showing {start}–{end} of {totalRows}
      </span>
      {showPageSize && (
        <GridSelect
          label="Rows"
          value={pageSize}
          options={pageSizeOptions.map((n) => ({ value: n, label: String(n) }))}
          onChange={(v) => onPageSizeChange && onPageSizeChange(Number(v))}
        />
      )}
      <div style={{ flex: 1 }} />
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)' }}
      >
        <IconButton
          icon="chevronLeft"
          disabled={page <= 1}
          onClick={() => onPageChange && onPageChange(page - 1)}
        />
        <span style={{ padding: '0 var(--sp-inline)' }}>
          Page <strong style={{ color: 'var(--fg-1)' }}>{page}</strong> of{' '}
          {totalPages}
        </span>
        <IconButton
          icon="chevronRight"
          disabled={page >= totalPages}
          onClick={() => onPageChange && onPageChange(page + 1)}
        />
      </div>
    </div>
  );
};

Object.assign(window, { DataGridPagination });
