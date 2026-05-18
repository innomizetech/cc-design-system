/* global React */

// ---- Minimal icon component: thin-stroke, Phosphor-style ------------
// Sizes default to 16. All icons share a consistent stroke weight.
const Icon = ({ name, size = 16, className = '', style = {} }) => {
  const paths = {
    // navigation
    dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
    invoice:
      'M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1v5h5M8 13h8M8 17h5M8 9h3',
    vendor: 'M3 21V8l9-5 9 5v13M9 21v-7h6v7M3 21h18',
    matter: 'M4 7h16v13H4zM9 7V4h6v3M8 11h8M8 15h5',
    approval:
      'M9 12l2 2 4-4M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z',
    workflow: 'M4 6h6v4H4zM14 14h6v4h-6zM10 8h6l2 2v4M7 10v6',
    ledger: 'M4 4h16v16H4zM4 9h16M4 14h16M9 4v16',
    report: 'M4 19V5M4 19h16M8 15V9M12 15V7M16 15V11',
    settings:
      'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    // actions
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    filter: 'M3 5h18M6 12h12M10 19h4',
    download: 'M12 3v13M7 12l5 5 5-5M5 21h14',
    upload: 'M12 21V8M7 13l5-5 5 5M5 3h14',
    chevronDown: 'M6 9l6 6 6-6',
    chevronUp: 'M6 15l6-6 6 6',
    chevronRight: 'M9 6l6 6-6 6',
    chevronLeft: 'M15 6l-6 6 6 6',
    caretDown: 'M7 10l5 5 5-5',
    check: 'M5 13l4 4L19 7',
    x: 'M6 6l12 12M18 6L6 18',
    more: 'M5 12h.01M12 12h.01M19 12h.01',
    moreVert: 'M12 5h.01M12 12h.01M12 19h.01',
    // content
    clock: 'M12 8v5l3 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z',
    comment: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    paperclip:
      'M21 12.5l-9 9a5.5 5.5 0 0 1-7.78-7.78l9-9a3.5 3.5 0 0 1 4.95 4.95l-9 9a1.5 1.5 0 0 1-2.12-2.12L14 4.5',
    history: 'M3 3v6h6M3.5 13a9 9 0 1 0 2-7.5L3 9M12 7v5l4 2',
    edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18 2l4 4-11 11H7v-4L18 2z',
    eye: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    eyeOff:
      'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22M14.12 14.12a3 3 0 1 1-4.24-4.24',
    flag: 'M4 21V4M4 4h13l-2 4 2 4H4',
    lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
    bell: 'M18 16V11a6 6 0 0 0-12 0v5l-2 2h16zM10 21a2 2 0 0 0 4 0',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    users:
      'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 21a7 7 0 0 1 14 0M16 21h6a5 5 0 0 0-5-5',
    sparkles:
      'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z',
    // tables / sort
    sortUp: 'M8 14l4-4 4 4',
    sortDown: 'M8 10l4 4 4-4',
    arrowRight: 'M5 12h14M13 5l7 7-7 7',
    dollar: 'M12 3v18M17 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    // misc
    building: 'M4 21V3h16v18M8 8h3M13 8h3M8 12h3M13 12h3M8 16h3M13 16h3',
    folder:
      'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z',
    external:
      'M15 3h6v6M10 14L21 3M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6',
    info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 11v5M12 7h.01',
    checkCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
    alertCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 7v5M12 17h.01',
    xCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM15 9l-6 6M9 9l6 6',
    // layout
    sidebar: 'M3 4h18v16H3zM9 4v16',
    panelClose: 'M3 4h18v16H3zM15 4v16',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    list: 'M4 6h16M4 12h16M4 18h16',
    refresh:
      'M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5',
    expand: 'M4 14v6h6M20 10V4h-6M4 20l7-7M20 4l-7 7',
    minimize: 'M10 4v6H4M14 20v-6h6M4 4l6 6M20 20l-6-6',
    maximize: 'M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M4 20v-6M20 20h-6M20 20v-6',
    link: 'M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
    database:
      'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
    calendar:
      'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zM4 10h16M8 2v4M16 2v4',
    sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M6.3 6.3l-1.4-1.4M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
    star: 'M12 2l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L2 9.5 9 9z',
    briefcase:
      'M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8zM9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1M4 13h16',
    scales: 'M12 3v18M4 21h16M7 7l-4 7h8l-4-7zM17 7l-4 7h8l-4-7z',
  };
  const d = paths[name] || paths.more;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: 'none', ...style }}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
};

// Export to window so other scripts can use it
window.Icon = Icon;
