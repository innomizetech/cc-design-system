/* global React, DataGrid, GridSearchInput, ChipFilterBar, AdvancedFilterModal,
   BulkActionBar, DataGridPagination, Button, IconButton, Badge, Avatar,
   Icon, Segmented, CollapsibleCard, Checkbox, cls, fmtMoney, fmtDate */

// =========================================================================
// DataGrid Demo — showcase of all features
// =========================================================================

// --- Sample data generators ----------------------------------------------
const DG_DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'Legal',
  'HR',
  'Operations',
];
const DG_STATUSES = ['Active', 'On leave', 'Probation', 'Terminated'];
const DG_LOCATIONS = [
  'San Francisco',
  'New York',
  'London',
  'Singapore',
  'Austin',
  'Berlin',
];
const DG_LEVELS = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'];
const DG_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern'];
const DG_MANAGERS = [
  'David Kim',
  'Lisa Park',
  'Robert Torres',
  'Angela Morris',
  'Nina Patel',
];
const DG_TEAMS = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'];
const DG_NAMES = [
  'Sarah Chen',
  'David Kim',
  'Marcus Orr',
  'Lisa Park',
  'James Wright',
  'Nina Patel',
  'Robert Torres',
  'Emily Sato',
  'Thomas Reed',
  'Angela Morris',
  'Chris Dunn',
  'Priya Sharma',
  'Alex Johnson',
  'Maria Garcia',
  'Kevin Lee',
  'Rachel Adams',
  'Daniel Brown',
  'Sophie Miller',
  'Ryan Davis',
  'Laura Wilson',
];

const makeDemoRows = (count) => {
  const rows = [];
  for (let i = 1; i <= count; i++) {
    const name = DG_NAMES[i % DG_NAMES.length];
    const salary = 60000 + ((i * 1731) % 90000);
    const bonus = (i * 431) % 15000;
    const tax = Math.round(salary * 0.22);
    rows.push({
      id: i,
      empId: `EMP-${String(1000 + i).padStart(5, '0')}`,
      name,
      email: name.toLowerCase().replace(' ', '.') + '@acme.com',
      phone: `+1 (${400 + (i % 10)}) 555-${String(1000 + ((i * 37) % 9000)).padStart(4, '0')}`,
      department: DG_DEPARTMENTS[i % DG_DEPARTMENTS.length],
      team: DG_TEAMS[i % DG_TEAMS.length],
      role: ['Engineer', 'Designer', 'Manager', 'Analyst', 'Director'][i % 5],
      level: DG_LEVELS[i % DG_LEVELS.length],
      type: DG_TYPES[i % DG_TYPES.length],
      status: DG_STATUSES[i % DG_STATUSES.length],
      location: DG_LOCATIONS[i % DG_LOCATIONS.length],
      manager: DG_MANAGERS[i % DG_MANAGERS.length],
      salary,
      bonus,
      tax,
      totalComp: salary + bonus,
      startDate: `202${3 + (i % 4)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      lastReview: `2026-${String((i % 12) + 1).padStart(2, '0')}-15`,
      rating: (3 + (i % 3) * 0.5).toFixed(1),
      utilization: 60 + ((i * 7) % 40),
    });
  }
  return rows;
};

const DEMO_ROWS = makeDemoRows(50);

// --- 1. Basic grid -------------------------------------------------------
const DemoBasic = () => (
  <DataGrid
    columns={[
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email', className: 'x-cell--mono' },
      { key: 'department', label: 'Department' },
      { key: 'location', label: 'Location' },
    ]}
    rows={DEMO_ROWS.slice(0, 8)}
  />
);

// --- 2. Sortable + Selectable + Floating bulk bar ------------------------
const DemoSortSelect = () => {
  const [selected, setSelected] = React.useState(new Set());
  const [sort, setSort] = React.useState({ key: 'name', dir: 'asc' });
  const rows = DEMO_ROWS.slice(0, 15);
  const allIds = rows.map((r) => r.id);
  const allSelected = selected.size === rows.length && selected.size > 0;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <DataGrid
      columns={[
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          render: (v, r) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-inline)',
              }}
            >
              <Avatar name={r.name} />
              <div>
                <div style={{ fontWeight: 500 }}>{r.name}</div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                  {r.email}
                </div>
              </div>
            </div>
          ),
        },
        { key: 'department', label: 'Department', sortable: true },
        {
          key: 'role',
          label: 'Role',
          sortable: true,
          render: (v) => <Badge variant="neutral">{v}</Badge>,
        },
        { key: 'location', label: 'Location', sortable: true },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
          width: 120,
          render: (v) => (
            <Badge
              dot
              variant={
                v === 'Active'
                  ? 'success'
                  : v === 'On leave'
                    ? 'info'
                    : v === 'Probation'
                      ? 'warn'
                      : 'neutral'
              }
            >
              {v}
            </Badge>
          ),
        },
        {
          key: 'salary',
          label: 'Salary',
          sortable: true,
          align: 'right',
          width: 120,
          className: 'x-cell--num',
          render: (v) => '$' + v.toLocaleString(),
        },
      ]}
      rows={rows}
      selectable
      selected={selected}
      onSelectionChange={setSelected}
      sort={sort}
      onSortChange={setSort}
      maxHeight={420}
      bulkBar={
        <BulkActionBar
          mode="floating"
          selected={selected}
          totalRows={rows.length}
          allSelected={allSelected}
          someSelected={someSelected}
          onSelectAll={() =>
            setSelected(allSelected ? new Set() : new Set(allIds))
          }
          onClearSelection={() => setSelected(new Set())}
          actions={[
            { id: 'edit', label: 'Edit', icon: 'edit' },
            { id: 'export', label: 'Export', icon: 'download' },
            { id: 'delete', label: 'Delete', icon: 'x', variant: 'danger' },
          ]}
        />
      }
    />
  );
};

// --- 3. Chip filters -----------------------------------------------------
const DEMO_FILTER_FIELDS = [
  {
    id: 'status',
    label: 'Status',
    icon: 'check',
    type: 'multiselect',
    options: DG_STATUSES.map((s) => ({ value: s, label: s })),
  },
  {
    id: 'department',
    label: 'Department',
    icon: 'building',
    type: 'multiselect',
    options: DG_DEPARTMENTS.map((d) => ({ value: d, label: d })),
  },
  {
    id: 'team',
    label: 'Team',
    icon: 'users',
    type: 'multiselect',
    options: DG_TEAMS.map((t) => ({ value: t, label: t })),
  },
  {
    id: 'location',
    label: 'Location',
    icon: 'building',
    type: 'multiselect',
    options: DG_LOCATIONS.map((l) => ({ value: l, label: l })),
  },
  {
    id: 'level',
    label: 'Level',
    icon: 'list',
    type: 'multiselect',
    options: DG_LEVELS.map((l) => ({ value: l, label: l })),
  },
  {
    id: 'type',
    label: 'Employment type',
    icon: 'folder',
    type: 'multiselect',
    options: DG_TYPES.map((t) => ({ value: t, label: t })),
  },
  { id: 'name', label: 'Name', icon: 'user', type: 'text' },
  {
    id: 'manager',
    label: 'Manager',
    icon: 'user',
    type: 'multiselect',
    options: DG_MANAGERS.map((m) => ({ value: m, label: m })),
  },
  { id: 'salary', label: 'Salary', icon: 'dollar', type: 'range' },
  { id: 'utilization', label: 'Utilization %', icon: 'report', type: 'range' },
  { id: 'startDate', label: 'Start date', icon: 'calendar', type: 'daterange' },
  {
    id: 'lastReview',
    label: 'Last review',
    icon: 'calendar',
    type: 'daterange',
  },
];

const DemoChipFilters = () => {
  const gf = useGridFilters({
    rows: DEMO_ROWS,
    filterFields: DEMO_FILTER_FIELDS,
    initialFilters: [
      {
        id: 'status',
        label: 'Status',
        data: { values: ['Active'] },
        value: 'Active',
      },
    ],
  });

  return (
    <DataGrid
      columns={[
        { key: 'name', label: 'Name', sortable: true },
        { key: 'department', label: 'Department', sortable: true },
        {
          key: 'status',
          label: 'Status',
          width: 120,
          render: (v) => (
            <Badge dot variant={v === 'Active' ? 'success' : 'neutral'}>
              {v}
            </Badge>
          ),
        },
        { key: 'location', label: 'Location' },
        {
          key: 'salary',
          label: 'Salary',
          align: 'right',
          className: 'x-cell--num',
          render: (v) => '$' + v.toLocaleString(),
        },
      ]}
      rows={gf.filteredRows}
      defaultSort={{ key: 'name', dir: 'asc' }}
      maxHeight={400}
      toolbar={
        <>
          <GridSearchInput
            {...gf.searchProps}
            placeholder="Search employees…"
          />
          <ChipFilterBar {...gf.chipProps} />
          <div className="x-grid-toolbar__spacer" />
          <span className="x-grid-toolbar__count">
            {gf.filteredCount} employees
          </span>
        </>
      }
    />
  );
};

// --- 4. Advanced filters -------------------------------------------------
const DemoAdvancedFilters = () => {
  const gf = useGridFilters({
    rows: DEMO_ROWS.slice(0, 20),
    filterFields: DEMO_FILTER_FIELDS,
  });

  return (
    <DataGrid
      columns={[
        { key: 'name', label: 'Name', sortable: true },
        { key: 'department', label: 'Department', sortable: true },
        { key: 'role', label: 'Role' },
        {
          key: 'status',
          label: 'Status',
          width: 120,
          render: (v) => (
            <Badge dot variant={v === 'Active' ? 'success' : 'neutral'}>
              {v}
            </Badge>
          ),
        },
        {
          key: 'salary',
          label: 'Salary',
          align: 'right',
          className: 'x-cell--num',
          render: (v) => '$' + v.toLocaleString(),
        },
      ]}
      rows={gf.filteredRows}
      defaultSort={{ key: 'name', dir: 'asc' }}
      maxHeight={360}
      toolbar={
        <>
          <GridSearchInput {...gf.searchProps} placeholder="Search…" />
          <div style={{ position: 'relative' }}>
            <Button
              variant="secondary"
              size="sm"
              icon="filter"
              onClick={gf.openAdvanced}
            >
              {gf.conditions.length > 0
                ? `Filters (${gf.conditions.length})`
                : 'Advanced filter'}
            </Button>
            <AdvancedFilterModal {...gf.advancedProps} />
          </div>
          {gf.hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={gf.clearAll}>
              Clear filters
            </Button>
          )}
          <div className="x-grid-toolbar__spacer" />
          <span className="x-grid-toolbar__count">
            {gf.filteredCount} results
          </span>
        </>
      }
    />
  );
};

// --- 5. Header groups ----------------------------------------------------
const DemoHeaderGroups = () => (
  <DataGrid
    columns={[
      { key: 'name', label: 'Employee', sortable: true },
      { key: 'department', label: 'Department', sortable: true },
      { key: 'role', label: 'Role' },
      {
        key: 'salary',
        label: 'Base',
        align: 'right',
        className: 'x-cell--num',
        group: 'financial',
        render: (v) => '$' + v.toLocaleString(),
      },
      {
        key: 'bonus',
        label: 'Bonus',
        align: 'right',
        className: 'x-cell--num',
        group: 'financial',
        render: (v) => '$' + v.toLocaleString(),
      },
      {
        key: 'tax',
        label: 'Tax',
        align: 'right',
        className: 'x-cell--num',
        group: 'financial',
        render: (v) => '$' + v.toLocaleString(),
      },
      { key: 'rating', label: 'Rating', align: 'center', width: 80 },
    ]}
    rows={DEMO_ROWS.slice(0, 12)}
    headerGroups={[{ id: 'financial', label: 'Compensation' }]}
    defaultSort={{ key: 'salary', dir: 'desc' }}
    maxHeight={400}
  />
);

// --- 6. Row grouping -----------------------------------------------------
const DemoRowGrouping = () => {
  const [selected, setSelected] = React.useState(new Set());

  return (
    <DataGrid
      columns={[
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          render: (v, r) => (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-inline)',
              }}
            >
              <Avatar name={r.name} size="sm" />
              {r.name}
            </span>
          ),
        },
        { key: 'role', label: 'Role' },
        { key: 'location', label: 'Location' },
        {
          key: 'status',
          label: 'Status',
          width: 120,
          render: (v) => (
            <Badge dot variant={v === 'Active' ? 'success' : 'neutral'}>
              {v}
            </Badge>
          ),
        },
        {
          key: 'salary',
          label: 'Salary',
          align: 'right',
          className: 'x-cell--num',
          render: (v) => '$' + v.toLocaleString(),
        },
      ]}
      rows={DEMO_ROWS.slice(0, 30)}
      selectable
      selected={selected}
      onSelectionChange={setSelected}
      groupBy="department"
      groupLabel={(dept, rows) =>
        `${dept} — ${rows.length} member${rows.length !== 1 ? 's' : ''}`
      }
      defaultSort={{ key: 'name', dir: 'asc' }}
      maxHeight={450}
    />
  );
};

// --- 7. Virtual scroll ---------------------------------------------------
const LARGE_ROWS = makeDemoRows(10000);

const DemoVirtualScroll = () => (
  <DataGrid
    columns={[
      { key: 'id', label: '#', width: 70, className: 'x-cell--num' },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'department', label: 'Department' },
      { key: 'role', label: 'Role' },
      { key: 'location', label: 'Location' },
      {
        key: 'salary',
        label: 'Salary',
        align: 'right',
        className: 'x-cell--num',
        render: (v) => '$' + v.toLocaleString(),
      },
    ]}
    rows={LARGE_ROWS}
    virtualScroll
    rowHeight={36}
    maxHeight={400}
    defaultSort={{ key: 'id', dir: 'asc' }}
    toolbar={
      <>
        <span
          className="x-grid-toolbar__count"
          style={{ fontWeight: 500, color: 'var(--fg-1)' }}
        >
          10,000 rows — virtual scroll
        </span>
        <div className="x-grid-toolbar__spacer" />
        <span className="x-grid-toolbar__count">
          Rendering only visible rows
        </span>
      </>
    }
  />
);

// --- 8. Combined (all features) ------------------------------------------
const COMBINED_COLUMNS = [
  // Identity group
  {
    key: 'empId',
    label: 'ID',
    width: 110,
    className: 'x-cell--mono',
    sortable: true,
    group: 'identity',
    visible: false,
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    group: 'identity',
    render: (v, r) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-inline)',
        }}
      >
        <Avatar name={r.name} size="sm" />
        <a className="x-link" style={{ fontWeight: 500, cursor: 'pointer' }}>
          {r.name}
        </a>
      </div>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    className: 'x-cell--mono',
    group: 'identity',
    visible: false,
  },
  {
    key: 'phone',
    label: 'Phone',
    width: 150,
    group: 'identity',
    visible: false,
  },

  // Organization group
  { key: 'department', label: 'Department', sortable: true, group: 'org' },
  { key: 'team', label: 'Team', sortable: true, group: 'org', visible: false },
  {
    key: 'role',
    label: 'Role',
    group: 'org',
    render: (v) => <Badge variant="neutral">{v}</Badge>,
  },
  {
    key: 'level',
    label: 'Level',
    sortable: true,
    group: 'org',
    visible: false,
  },
  { key: 'manager', label: 'Manager', group: 'org', visible: false },

  // Employment group
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: 120,
    group: 'employment',
    render: (v) => (
      <Badge
        dot
        variant={
          v === 'Active'
            ? 'success'
            : v === 'On leave'
              ? 'info'
              : v === 'Probation'
                ? 'warn'
                : 'neutral'
        }
      >
        {v}
      </Badge>
    ),
  },
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    group: 'employment',
    visible: false,
  },
  { key: 'location', label: 'Location', sortable: true, group: 'employment' },
  {
    key: 'startDate',
    label: 'Start date',
    sortable: true,
    width: 120,
    group: 'employment',
    render: (v) => fmtDate(v),
  },

  // Compensation group
  {
    key: 'salary',
    label: 'Base',
    sortable: true,
    align: 'right',
    className: 'x-cell--num',
    group: 'compensation',
    render: (v) => '$' + v.toLocaleString(),
  },
  {
    key: 'bonus',
    label: 'Bonus',
    sortable: true,
    align: 'right',
    className: 'x-cell--num',
    group: 'compensation',
    render: (v) => '$' + v.toLocaleString(),
  },
  {
    key: 'tax',
    label: 'Tax',
    align: 'right',
    className: 'x-cell--num',
    group: 'compensation',
    visible: false,
    render: (v) => '$' + v.toLocaleString(),
  },
  {
    key: 'totalComp',
    label: 'Total',
    sortable: true,
    align: 'right',
    className: 'x-cell--num',
    group: 'compensation',
    visible: false,
    render: (v) => '$' + v.toLocaleString(),
  },

  // Performance group
  {
    key: 'rating',
    label: 'Rating',
    align: 'center',
    width: 80,
    group: 'performance',
  },
  {
    key: 'utilization',
    label: 'Util %',
    align: 'right',
    width: 80,
    className: 'x-cell--num',
    group: 'performance',
    render: (v) => v + '%',
  },
  {
    key: 'lastReview',
    label: 'Last review',
    sortable: true,
    width: 120,
    group: 'performance',
    visible: false,
    render: (v) => fmtDate(v),
  },
];

const COMBINED_HEADER_GROUPS = [
  { id: 'identity', label: 'Identity' },
  { id: 'org', label: 'Organization' },
  { id: 'employment', label: 'Employment' },
  { id: 'compensation', label: 'Compensation' },
  { id: 'performance', label: 'Performance' },
];

const DG_GROUP_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'department', label: 'Department' },
  { value: 'team', label: 'Team' },
  { value: 'role', label: 'Role' },
  { value: 'level', label: 'Level' },
  { value: 'status', label: 'Status' },
  { value: 'location', label: 'Location' },
  { value: 'type', label: 'Employment type' },
  { value: 'manager', label: 'Manager' },
];

const DemoCombined = () => {
  const gf = useGridFilters({
    rows: DEMO_ROWS,
    filterFields: DEMO_FILTER_FIELDS,
    initialFilters: [
      {
        id: 'status',
        label: 'Status',
        data: { values: ['Active'] },
        value: 'Active',
      },
    ],
    syncUrl: true,
    urlKey: 'dg',
  });

  const [selected, setSelected] = React.useState(new Set());
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sort, setSort] = React.useState({ key: 'name', dir: 'asc' });
  const [columns, setColumns] = React.useState(COMBINED_COLUMNS);
  const [refreshing, setRefreshing] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [density, setDensity] = React.useState('default');
  const [fitWindow, setFitWindow] = React.useState(false);
  const [fixedHeader, setFixedHeader] = React.useState(true);
  const [groupBy, setGroupBy] = React.useState('none');

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const isGrouped = groupBy && groupBy !== 'none';
  const displayRows = isGrouped
    ? gf.filteredRows
    : gf.filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const allIds = displayRows.map((r) => r.id);
  const allSelected = selected.size === displayRows.length && selected.size > 0;
  const someSelected = selected.size > 0 && !allSelected;

  const renderGrid = (fsMode) => (
    <DataGrid
      columns={columns}
      rows={displayRows}
      selectable
      selected={selected}
      onSelectionChange={setSelected}
      sort={sort}
      onSortChange={(s) => {
        setSort(s);
        setPage(1);
      }}
      headerGroups={COMBINED_HEADER_GROUPS}
      groupBy={isGrouped ? groupBy : undefined}
      groupLabel={(key, rows) => `${key} (${rows.length})`}
      settingsEnabled
      onColumnsChange={setColumns}
      density={density}
      onDensityChange={setDensity}
      fitWindow={fitWindow}
      onFitWindowChange={setFitWindow}
      fixedHeader={fixedHeader}
      onFixedHeaderChange={setFixedHeader}
      maxHeight={fsMode ? undefined : fitWindow ? 'calc(100vh - 280px)' : 480}
      toolbar={
        <>
          {/* Filter zone (left) */}
          <GridSearchInput
            {...gf.searchProps}
            placeholder="Search employees…"
          />
          <ChipFilterBar {...gf.chipProps} maxVisible={3} />
          <Button
            variant="ghost"
            size="sm"
            icon="filter"
            onClick={gf.openAdvanced}
          >
            {gf.conditions.length > 0
              ? `Advanced (${gf.conditions.length})`
              : 'Advanced'}
          </Button>
          <AdvancedFilterModal {...gf.advancedProps} />
          {gf.hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                gf.clearAll();
                setPage(1);
              }}
            >
              Clear all
            </Button>
          )}

          {/* Spacer */}
          <div className="x-grid-toolbar__spacer" />

          {/* Action zone (right) */}
          <GridSelect
            label="Group by"
            value={groupBy}
            options={DG_GROUP_OPTIONS}
            onChange={(v) => {
              setGroupBy(v);
              setPage(1);
            }}
          />
          <span className="x-grid-toolbar__count">
            {gf.filteredCount} employees
          </span>
          <GridActions
            quickActions={[
              {
                id: 'add',
                label: 'Add employee',
                icon: 'plus',
                onClick: () => {},
              },
            ]}
            moreActions={[
              {
                id: 'import',
                label: 'Import CSV',
                icon: 'upload',
                onClick: () => {},
              },
              {
                id: 'export',
                label: 'Export',
                icon: 'download',
                onClick: () => {},
              },
              { divider: true },
              {
                id: 'archive',
                label: 'Archive selected',
                icon: 'folder',
                onClick: () => {},
              },
            ]}
            onRefresh={refresh}
            refreshing={refreshing}
            onFullscreen={() => setFullscreen(true)}
          />
        </>
      }
      footer={
        !isGrouped ? (
          <DataGridPagination
            totalRows={gf.filteredCount}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        ) : undefined
      }
      bulkBar={
        <BulkActionBar
          mode="floating"
          selected={selected}
          totalRows={displayRows.length}
          allSelected={allSelected}
          someSelected={someSelected}
          onSelectAll={() =>
            setSelected(allSelected ? new Set() : new Set(allIds))
          }
          onClearSelection={() => setSelected(new Set())}
          actions={[
            { id: 'edit', label: 'Edit', icon: 'edit' },
            { id: 'assign', label: 'Assign', icon: 'users' },
            { id: 'export', label: 'Export', icon: 'download' },
            { id: 'delete', label: 'Delete', icon: 'x', variant: 'danger' },
          ]}
        />
      }
    />
  );

  return (
    <>
      {renderGrid(false)}
      <GridFullscreen
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        title="Employee Directory"
        description="Manage team members, roles, and department assignments."
      >
        {renderGrid(true)}
      </GridFullscreen>
    </>
  );
};

// --- Demo page -----------------------------------------------------------
const DataGridDemo = () => (
  <div className="x-page" style={{ maxWidth: 1200 }}>
    <div className="x-page__head">
      <div className="x-page__title-wrap">
        <h1 className="x-h2">DataGrid Component</h1>
        <div className="x-page__sub">
          Shared data grid primitive with sort, selection, filters, grouping,
          virtual scroll, and bulk actions.
        </div>
      </div>
    </div>

    <CollapsibleCard title="Basic" subtitle="Simple read-only table">
      <DemoBasic />
    </CollapsibleCard>

    <CollapsibleCard
      title="Sortable + Selectable"
      subtitle="Click headers to sort, check rows for bulk actions"
    >
      <DemoSortSelect />
    </CollapsibleCard>

    <CollapsibleCard
      title="Chip Filters"
      subtitle="Active filter chips with inline edit popovers"
    >
      <DemoChipFilters />
    </CollapsibleCard>

    <CollapsibleCard
      title="Advanced Filters"
      subtitle="Field + operator + value condition builder (Jira-style)"
    >
      <DemoAdvancedFilters />
    </CollapsibleCard>

    <CollapsibleCard
      title="Header Groups"
      subtitle="Multi-level column headers with colspan"
    >
      <DemoHeaderGroups />
    </CollapsibleCard>

    <CollapsibleCard
      title="Row Grouping"
      subtitle="Group by department with collapsible sections"
    >
      <DemoRowGrouping />
    </CollapsibleCard>

    <CollapsibleCard
      title="Virtual Scroll"
      subtitle="10,000 rows rendered on demand"
    >
      <DemoVirtualScroll />
    </CollapsibleCard>

    <CollapsibleCard
      title="Combined"
      subtitle="All features: actions, settings panel, filters, pagination, bulk bar, fullscreen"
    >
      <DemoCombined />
    </CollapsibleCard>
  </div>
);

// --- Test page — single Combined grid, full width, URL sync active ------
const DataGridTestPage = () => {
  const [urlDisplay, setUrlDisplay] = React.useState(
    window.location.search || '(no params)',
  );
  React.useEffect(() => {
    const id = setInterval(
      () => setUrlDisplay(window.location.search || '(no params)'),
      500,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="x-page" style={{ maxWidth: 'none' }}>
      <div className="x-page__head">
        <div className="x-page__title-wrap">
          <h1 className="x-h2">DataGrid Invoices</h1>
          <div className="x-page__sub">
            Full-width grid with URL sync enabled. Filter state persists in the
            address bar.
          </div>
        </div>
      </div>

      <div
        style={{
          padding: 'var(--sp-inline) var(--sp-group)',
          background: 'var(--bg-sunken)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-sm)',
          color: 'var(--fg-2)',
          wordBreak: 'break-all',
        }}
      >
        <span style={{ color: 'var(--fg-3)', marginRight: 'var(--sp-inline)' }}>
          URL:
        </span>
        {urlDisplay}
      </div>

      <DemoCombined />
    </div>
  );
};

Object.assign(window, { DataGridDemo, DataGridTestPage });
