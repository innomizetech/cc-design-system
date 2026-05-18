/* global React, Icon, Button, IconButton, Avatar, Badge, cls, fmtDateTime */

// ======================================================================
// Notifications Drawer — simplified design
// ======================================================================

const SAMPLE_NOTIFS = [
  {
    id: 'n1',
    category: 'alert',
    unread: true,
    time: '2026-05-18T16:10:00',
    actor: 'System',
    title: 'SLA breach approaching on INV-00421',
    text: 'Invoice has been in review for 8 days. Due for approval by tomorrow.',
  },
  {
    id: 'n2',
    category: 'comment',
    unread: true,
    time: '2026-05-18T15:40:00',
    actor: 'Marcus Orr',
    title: 'Marcus Orr mentioned you in INV-00418',
    text: '"...@you should we still gate the export flow behind the feature flag, or ship it open thi..."',
  },
  {
    id: 'n3',
    category: 'approval',
    unread: true,
    time: '2026-05-18T14:02:00',
    actor: 'Priya Shah',
    title: 'Priya Shah assigned you XTND-1284',
    text: 'Wire notificationApi reducer + middleware into web-app store and verify...',
  },
  {
    id: 'n4',
    category: 'system',
    unread: false,
    time: '2026-05-18T09:00:00',
    actor: 'System',
    title: '2-factor backup codes expiring in 5 days',
    text: 'Regenerate your backup codes before they expire to maintain account access.',
  },
  {
    id: 'n5',
    category: 'invoice',
    unread: false,
    time: '2026-05-17T17:28:00',
    actor: 'K. Alvarez',
    title: 'K. Alvarez submitted INV-00418',
    text: '$142,880.00 · 47 line items · Morgan Pine Chandler LLP',
  },
  {
    id: 'n6',
    category: 'approval',
    unread: false,
    time: '2026-05-17T11:15:00',
    actor: 'Priya Shah',
    title: 'INV-00411 approved and released to AP',
    text: 'Final approval by Priya Shah. Payment scheduled for May 25.',
  },
  {
    id: 'n7',
    category: 'comment',
    unread: false,
    time: '2026-05-16T16:02:00',
    actor: 'J. Bhatt',
    title: 'J. Bhatt replied in INV-00402 thread',
    text: '"The rate card mismatch on line 12 was resolved with the vendor..."',
  },
  {
    id: 'n8',
    category: 'system',
    unread: false,
    time: '2026-05-16T09:00:00',
    actor: 'System',
    title: 'Weekly digest: 12 invoices reviewed',
    text: '$1.2M approved · 3 escalations · 2 vendor responses pending.',
  },
];

const CATEGORY_LABELS = {
  invoice: 'Invoice',
  comment: 'Mention',
  approval: 'Assigned',
  system: 'System',
  alert: 'Action required',
};

const CATEGORY_COLORS = {
  invoice: 'info',
  comment: 'accent',
  approval: 'warn',
  system: 'neutral',
  alert: 'danger',
};

const relTime = (iso) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const NotificationRow = ({ n, onOpen }) => (
  <div
    className={cls('x-notif__item', n.unread && 'is-unread')}
    onClick={() => onOpen && onOpen(n)}
    role="button"
    tabIndex={0}
  >
    <Avatar name={n.actor} />
    <div className="x-notif__body">
      <div className="x-notif__text">
        <strong>{n.title}</strong>
      </div>
      {n.text && <div className="x-notif__desc">{n.text}</div>}
      <div className="x-notif__meta">
        <Badge variant={CATEGORY_COLORS[n.category] || 'neutral'}>
          {CATEGORY_LABELS[n.category] || n.category}
        </Badge>
        <span>·</span>
        <span title={fmtDateTime(n.time)}>{relTime(n.time)}</span>
      </div>
    </div>
    {n.unread && <span className="x-notif__dot" />}
  </div>
);

const NotificationsDrawer = ({
  open,
  onClose,
  notifications = SAMPLE_NOTIFS,
  onOpen,
}) => {
  const [tab, setTab] = React.useState('all');
  const [category, setCategory] = React.useState('all');
  const [catOpen, setCatOpen] = React.useState(false);
  const catRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!catOpen) return;
    const onClick = (e) => {
      if (catRef.current && catRef.current.contains(e.target)) return;
      setCatOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [catOpen]);

  if (!open) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered = notifications.filter((n) => {
    if (tab === 'unread' && !n.unread) return false;
    if (category !== 'all' && n.category !== category) return false;
    return true;
  });

  const categories = ['all', ...Object.keys(CATEGORY_LABELS)];

  return (
    <>
      <div className="x-scrim" onClick={onClose} />
      <aside className="x-notif" role="dialog" aria-label="Notifications">
        {/* Header */}
        <div className="x-notif__header">
          <h2 className="x-notif__title">Notifications</h2>
          <div style={{ flex: 1 }} />
          <IconButton icon="settings" title="Notification preferences" />
          <IconButton icon="x" title="Close" onClick={onClose} />
        </div>

        {/* Actions */}
        <div className="x-notif__actions">
          <Button variant="ghost" size="sm" onClick={() => {}}>
            Mark all read
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {}}>
            Delete all
          </Button>
        </div>

        {/* Filter bar */}
        <div className="x-notif__filterbar">
          <div style={{ display: 'flex', gap: 0 }}>
            <button
              type="button"
              className={cls(
                'x-notif__filter-tab',
                tab === 'all' && 'is-active',
              )}
              onClick={() => setTab('all')}
            >
              All
            </button>
            <button
              type="button"
              className={cls(
                'x-notif__filter-tab',
                tab === 'unread' && 'is-active',
              )}
              onClick={() => setTab('unread')}
            >
              Unread
              {unreadCount > 0 && <span className="x-notif__unread-dot" />}
            </button>
          </div>
          <div style={{ flex: 1 }} />
          <div ref={catRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="x-notif__cat-select"
              onClick={(e) => {
                e.stopPropagation();
                setCatOpen((v) => !v);
              }}
            >
              {category === 'all'
                ? 'All categories'
                : CATEGORY_LABELS[category]}
              <Icon name="caretDown" size={10} />
            </button>
            {catOpen && (
              <div className="x-notif__cat-menu">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cls(
                      'x-notif__cat-option',
                      category === c && 'is-active',
                    )}
                    onClick={() => {
                      setCategory(c);
                      setCatOpen(false);
                    }}
                  >
                    {c === 'all' ? 'All categories' : CATEGORY_LABELS[c]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* List */}
        <div className="x-notif__list">
          {filtered.length === 0 && (
            <div className="x-notif__empty">
              <div className="x-notif__empty-icon">
                <Icon name="bell" size={18} />
              </div>
              No notifications
            </div>
          )}
          {filtered.map((n) => (
            <NotificationRow
              key={n.id}
              n={n}
              onOpen={(item) => {
                onOpen && onOpen(item);
              }}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

Object.assign(window, { NotificationsDrawer, SAMPLE_NOTIFS });
