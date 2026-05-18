/* global React, Icon, Button, IconButton, Avatar, Badge, Card, Field, Input, Textarea, Segmented, Toggle, Checkbox, Tabs, cls, fmtDate */

// ======================================================================
// User Profile & User Settings pages
// Accessed from the user avatar popup in the topbar.
// ======================================================================

// ---------- User Profile Page ------------------------------------------
const UserProfilePage = () => {
  const [editing, setEditing] = React.useState(false);

  return (
    <div className="x-page" style={{ maxWidth: 820 }}>
      <div className="x-page__head">
        <div className="x-page__title-wrap">
          <h1 className="x-h2">Profile</h1>
          <div className="x-page__sub">
            Manage your personal information and how others see you.
          </div>
        </div>
        <div className="x-page__actions">
          {editing ? (
            <>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button
                variant="accent"
                icon="check"
                onClick={() => setEditing(false)}
              >
                Save changes
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              icon="edit"
              onClick={() => setEditing(true)}
            >
              Edit profile
            </Button>
          )}
        </div>
      </div>

      {/* Avatar + Name */}
      <Card title="Personal information">
        <div
          style={{
            display: 'flex',
            gap: 'var(--sp-section)',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--sp-inline)',
            }}
          >
            <Avatar name="Eleanor Wu" size="lg" />
            {editing && (
              <Button variant="ghost" size="sm">
                Change
              </Button>
            )}
          </div>
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--sp-section)',
            }}
          >
            <Field label="First name" required>
              <Input defaultValue="Eleanor" disabled={!editing} />
            </Field>
            <Field label="Last name" required>
              <Input defaultValue="Wu" disabled={!editing} />
            </Field>
            <Field label="Display name">
              <Input defaultValue="Eleanor Wu" disabled={!editing} />
            </Field>
            <Field label="Title / Role">
              <Input defaultValue="Billing Reviewer" disabled={!editing} />
            </Field>
          </div>
        </div>
      </Card>

      {/* Contact */}
      <Card title="Contact information">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--sp-section)',
          }}
        >
          <Field label="Email" required>
            <Input
              defaultValue="eleanor.wu@sterlingmcgill.com"
              disabled={!editing}
              type="email"
            />
          </Field>
          <Field label="Phone">
            <Input defaultValue="+1 (415) 555-0198" disabled={!editing} />
          </Field>
          <Field label="Location">
            <Input defaultValue="San Francisco, CA" disabled={!editing} />
          </Field>
          <Field label="Timezone">
            <Input
              defaultValue="America/Los_Angeles (PT)"
              disabled={!editing}
            />
          </Field>
        </div>
      </Card>

      {/* Organization */}
      <Card title="Organization">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--sp-section)',
          }}
        >
          <Field label="Department">
            <Input defaultValue="Finance" disabled={!editing} />
          </Field>
          <Field label="Manager">
            <Input defaultValue="David Kim" disabled={!editing} />
          </Field>
          <Field label="Member since">
            <Input defaultValue="Jun 15, 2024" disabled />
          </Field>
          <Field label="Last login">
            <Input defaultValue="May 18, 2026 · 2:32 PM" disabled />
          </Field>
        </div>
      </Card>
    </div>
  );
};

// ---------- User Settings Page -----------------------------------------
const UserSettingsPage = () => {
  const [tab, setTab] = React.useState('account');
  const [twoFa, setTwoFa] = React.useState(true);

  const NOTIF_CATEGORIES = [
    {
      key: 'invoices',
      label: 'Invoice updates',
      desc: 'Submissions, approvals, rejections, and status changes on invoices assigned to you or your team.',
      channels: [
        { id: 'email', label: 'Email', icon: 'invoice' },
        { id: 'inApp', label: 'In-app', icon: 'bell' },
        { id: 'push', label: 'Push', icon: 'sparkles' },
      ],
    },
    {
      key: 'comments',
      label: 'Comments & mentions',
      desc: 'When someone @mentions you, replies to your comment, or starts a thread on an item you follow.',
      channels: [
        { id: 'email', label: 'Email', icon: 'invoice' },
        { id: 'inApp', label: 'In-app', icon: 'bell' },
        { id: 'push', label: 'Push', icon: 'sparkles' },
      ],
    },
    {
      key: 'approvals',
      label: 'Approval requests',
      desc: 'When an invoice, bill, or matter action is assigned to you for review and approval.',
      channels: [
        { id: 'email', label: 'Email', icon: 'invoice' },
        { id: 'inApp', label: 'In-app', icon: 'bell' },
        { id: 'push', label: 'Push', icon: 'sparkles' },
      ],
    },
    {
      key: 'system',
      label: 'System alerts',
      desc: 'SLA breaches, sync failures, security events, and platform maintenance notices. These notifications cannot be disabled.',
      locked: true,
      channels: [
        { id: 'email', label: 'Email', icon: 'invoice' },
        { id: 'inApp', label: 'In-app', icon: 'bell' },
      ],
    },
    {
      key: 'billing',
      label: 'Billing & payments',
      desc: 'Payment scheduled, payment processed, vendor remittance, and trust account activity.',
      channels: [
        { id: 'email', label: 'Email', icon: 'invoice' },
        { id: 'inApp', label: 'In-app', icon: 'bell' },
      ],
    },
    {
      key: 'digest',
      label: 'Weekly digest',
      desc: 'A summary of activity across your workspace delivered every Monday morning.',
      channels: [{ id: 'email', label: 'Email', icon: 'invoice' }],
    },
  ];

  const [notifPrefs, setNotifPrefs] = React.useState({
    invoices: { enabled: true, email: true, inApp: true, push: true },
    comments: { enabled: true, email: true, inApp: true, push: false },
    approvals: { enabled: true, email: true, inApp: true, push: true },
    system: { enabled: true, email: true, inApp: true },
    billing: { enabled: true, email: true, inApp: false },
    digest: { enabled: true, email: true },
  });

  const toggleNotifEnabled = (cat) => {
    const c = NOTIF_CATEGORIES.find((x) => x.key === cat);
    if (c && c.locked) return;
    setNotifPrefs((p) => ({
      ...p,
      [cat]: { ...p[cat], enabled: !p[cat].enabled },
    }));
  };

  const toggleNotifChannel = (cat, channel) => {
    const c = NOTIF_CATEGORIES.find((x) => x.key === cat);
    if (c && c.locked) return;
    setNotifPrefs((p) => ({
      ...p,
      [cat]: { ...p[cat], [channel]: !p[cat][channel] },
    }));
  };

  return (
    <div className="x-page" style={{ maxWidth: 820 }}>
      <div className="x-page__head">
        <div className="x-page__title-wrap">
          <h1 className="x-h2">Settings</h1>
          <div className="x-page__sub">
            Manage your account, preferences, and notification settings.
          </div>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'account', label: 'Account', icon: 'user' },
            { value: 'preferences', label: 'Preferences', icon: 'settings' },
            { value: 'notifications', label: 'Notifications', icon: 'bell' },
          ]}
        />
      </div>

      {/* Account Tab */}
      {tab === 'account' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-section)',
            marginTop: 'var(--sp-section)',
          }}
        >
          <Card title="Email address">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 'var(--sp-section)',
                alignItems: 'end',
              }}
            >
              <Field label="Email">
                <Input defaultValue="eleanor.wu@sterlingmcgill.com" />
              </Field>
              <Button variant="secondary">Update email</Button>
            </div>
          </Card>

          <Card title="Password">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--sp-section)',
              }}
            >
              <Field label="Current password">
                <Input type="password" defaultValue="••••••••••" />
              </Field>
              <div />
              <Field label="New password">
                <Input type="password" placeholder="Enter new password" />
              </Field>
              <Field label="Confirm password">
                <Input type="password" placeholder="Confirm new password" />
              </Field>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 'var(--sp-section)',
              }}
            >
              <Button variant="secondary">Change password</Button>
            </div>
          </Card>

          <Card title="Two-factor authentication">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-section)',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--fg-1)',
                    fontWeight: 500,
                  }}
                >
                  {twoFa ? 'Enabled' : 'Disabled'}
                </div>
                <div
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--fg-3)',
                    marginTop: 'var(--sp-0-5)',
                  }}
                >
                  {twoFa
                    ? 'Your account is protected with two-factor authentication via authenticator app.'
                    : 'Add an extra layer of security to your account.'}
                </div>
              </div>
              <Toggle checked={twoFa} onChange={setTwoFa} />
            </div>
            {twoFa && (
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--sp-inline)',
                  marginTop: 'var(--sp-group)',
                }}
              >
                <Button variant="ghost" size="sm">
                  Regenerate backup codes
                </Button>
                <Button variant="ghost" size="sm">
                  Change method
                </Button>
              </div>
            )}
          </Card>

          <Card title="Danger zone">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-section)',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--fg-1)',
                    fontWeight: 500,
                  }}
                >
                  Deactivate account
                </div>
                <div
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--fg-3)',
                    marginTop: 'var(--sp-0-5)',
                  }}
                >
                  Permanently deactivate your account and remove access. This
                  action cannot be undone.
                </div>
              </div>
              <Button variant="danger" size="sm">
                Deactivate
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Preferences Tab */}
      {tab === 'preferences' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-section)',
            marginTop: 'var(--sp-section)',
          }}
        >
          <Card title="Regional">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--sp-section)',
              }}
            >
              <Field label="Language">
                <Input defaultValue="English (US)" />
              </Field>
              <Field label="Timezone">
                <Input defaultValue="America/Los_Angeles (PT)" />
              </Field>
              <Field label="Date format">
                <Input defaultValue="MMM DD, YYYY" />
              </Field>
              <Field label="Number format">
                <Input defaultValue="1,234.56" />
              </Field>
            </div>
          </Card>

          <Card title="Appearance">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-section)',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 'var(--fs-sm)',
                    fontWeight: 500,
                    color: 'var(--fg-1)',
                    marginBottom: 'var(--sp-inline)',
                  }}
                >
                  Theme
                </div>
                <Segmented
                  value="dark"
                  onChange={() => {}}
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'system', label: 'System' },
                  ]}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 'var(--fs-sm)',
                    fontWeight: 500,
                    color: 'var(--fg-1)',
                    marginBottom: 'var(--sp-inline)',
                  }}
                >
                  Density
                </div>
                <Segmented
                  value="default"
                  onChange={() => {}}
                  options={[
                    { value: 'compact', label: 'Compact' },
                    { value: 'default', label: 'Default' },
                    { value: 'comfortable', label: 'Comfortable' },
                  ]}
                />
              </div>
            </div>
          </Card>

          <Card title="Default views">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--sp-section)',
              }}
            >
              <Field label="Start page">
                <Input defaultValue="Dashboard" />
              </Field>
              <Field label="Invoice list view">
                <Input defaultValue="Table" />
              </Field>
            </div>
          </Card>

          <div
            style={{
              display: 'flex',
              gap: 'var(--sp-inline)',
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="ghost">Reset to defaults</Button>
            <Button variant="accent" icon="check">
              Save preferences
            </Button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === 'notifications' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-section)',
            marginTop: 'var(--sp-section)',
          }}
        >
          <div className="x-page__sub" style={{ margin: 0 }}>
            Choose which notifications you receive and how. System alerts cannot
            be disabled.
          </div>

          {NOTIF_CATEGORIES.map((cat) => {
            const prefs = notifPrefs[cat.key] || {};
            const isEnabled = cat.locked ? true : prefs.enabled;

            return (
              <div
                key={cat.key}
                className="x-card"
                style={{ overflow: 'visible' }}
              >
                {/* Category header: description + master toggle */}
                <div
                  style={{
                    padding:
                      'var(--card-header-pad-y) var(--card-header-pad-x)',
                    borderBottom: isEnabled
                      ? '1px solid var(--border-subtle)'
                      : 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--sp-group)',
                      marginBottom: 'var(--sp-1)',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--sp-inline)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 'var(--fs-md)',
                            fontWeight: 'var(--fw-semibold)',
                            color: 'var(--fg-1)',
                          }}
                        >
                          {cat.label}
                        </span>
                        {cat.locked && (
                          <Badge variant="neutral">Required</Badge>
                        )}
                      </div>
                    </div>
                    <Toggle
                      checked={isEnabled}
                      onChange={() => toggleNotifEnabled(cat.key)}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--fs-sm)',
                      color: 'var(--fg-3)',
                      lineHeight: 'var(--lh-normal)',
                    }}
                  >
                    {cat.desc}
                  </div>
                </div>

                {/* Channel toggles — only shown when enabled */}
                {isEnabled && (
                  <div
                    style={{
                      padding:
                        'var(--sp-inline) var(--card-header-pad-x) var(--card-header-pad-y)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'var(--fs-xs)',
                        fontWeight: 'var(--fw-semibold)',
                        color: 'var(--fg-3)',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--tracking-caps)',
                        marginBottom: 'var(--sp-inline)',
                      }}
                    >
                      Where you receive these notifications
                    </div>
                    {cat.channels.map((ch) => (
                      <div
                        key={ch.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--sp-group)',
                          padding: 'var(--sp-inline) 0',
                          borderBottom: '1px solid var(--border-subtle)',
                        }}
                      >
                        <Icon
                          name={ch.icon}
                          size={16}
                          style={{ color: 'var(--fg-3)', flex: 'none' }}
                        />
                        <span
                          style={{
                            flex: 1,
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--fg-1)',
                          }}
                        >
                          {ch.label}
                        </span>
                        <Toggle
                          checked={!!prefs[ch.id]}
                          onChange={() => toggleNotifChannel(cat.key, ch.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

Object.assign(window, { UserProfilePage, UserSettingsPage });
