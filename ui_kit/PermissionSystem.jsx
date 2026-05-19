/* global React, Icon, Button, IconButton, Badge, Checkbox, Field, Input, Textarea, Segmented, cls, fmtDate */

// ======================================================================
// Permission System — CASL-style RBAC management
// Single page: "Roles & permissions" under Settings > Security
// Tabs: Roles | Permission Sets
// Detail/Create via inline right sheet (not modal or drawer)
// ======================================================================

// ---------- Capability Catalog (from capability-catalog.json) ----------

const MODULE_ICONS = {
  heartwood: 'lock',
  sycamore: 'vendor',
  willow: 'invoice',
  juniper: 'ledger',
  banyan: 'workflow',
  audit: 'history',
};

// Sourced from capability-catalog.json — includes permissionSets per module and sets[] per capability
const CAPABILITY_CATALOG = [
  { module: 'heartwood', label: 'Heartwood', description: 'Identity & access management',
    permissionSets: [
      { slug: 'pset:heartwood:iam_viewer', name: 'IAM viewer', description: 'View users, roles, groups, permission sets, and organization settings' },
      { slug: 'pset:heartwood:iam_admin', name: 'IAM admin', description: 'Full identity and access management lifecycle' },
      { slug: 'pset:heartwood:audit_viewer', name: 'Audit viewer', description: 'View and export admin audit log records' },
    ],
    subjects: [
      { subject: 'User', key: 'user', capabilities: [
        { key: 'user.read', action: 'read', riskLevel: 'low', description: 'View user profiles and list', sets: ['pset:heartwood:iam_viewer','pset:heartwood:iam_admin'] },
        { key: 'user.create', action: 'create', riskLevel: 'medium', description: 'Create user accounts', sets: ['pset:heartwood:iam_admin'] },
        { key: 'user.update', action: 'update', riskLevel: 'medium', description: 'Edit user profiles and assignments', sets: ['pset:heartwood:iam_admin'] },
        { key: 'user.delete', action: 'delete', riskLevel: 'high', description: 'Remove user accounts', sets: ['pset:heartwood:iam_admin'] },
        { key: 'user.invite', action: 'invite', riskLevel: 'medium', description: 'Send user invitations', sets: ['pset:heartwood:iam_admin'] },
        { key: 'user.suspend', action: 'suspend', riskLevel: 'high', description: 'Suspend active user accounts', sets: ['pset:heartwood:iam_admin'] },
        { key: 'user.unsuspend', action: 'unsuspend', riskLevel: 'medium', description: 'Reactivate suspended user accounts', sets: ['pset:heartwood:iam_admin'] },
        { key: 'user.read_revisions', action: 'read_revisions', riskLevel: 'low', description: 'View user change history', sets: ['pset:heartwood:iam_viewer','pset:heartwood:iam_admin'] },
      ]},
      { subject: 'Role', key: 'role', capabilities: [
        { key: 'role.read', action: 'read', riskLevel: 'low', description: 'View roles and their permission sets', sets: ['pset:heartwood:iam_viewer','pset:heartwood:iam_admin'] },
        { key: 'role.create', action: 'create', riskLevel: 'high', description: 'Create custom roles', sets: ['pset:heartwood:iam_admin'] },
        { key: 'role.update', action: 'update', riskLevel: 'high', description: 'Edit role permission set assignments', sets: ['pset:heartwood:iam_admin'] },
        { key: 'role.delete', action: 'delete', riskLevel: 'critical', description: 'Remove custom roles', sets: ['pset:heartwood:iam_admin'] },
        { key: 'role.read_revisions', action: 'read_revisions', riskLevel: 'low', description: 'View role change history', sets: ['pset:heartwood:iam_viewer','pset:heartwood:iam_admin'] },
      ]},
      { subject: 'Group', key: 'group', capabilities: [
        { key: 'group.read', action: 'read', riskLevel: 'low', description: 'View groups and membership', sets: ['pset:heartwood:iam_viewer','pset:heartwood:iam_admin'] },
        { key: 'group.create', action: 'create', riskLevel: 'medium', description: 'Create user groups', sets: ['pset:heartwood:iam_admin'] },
        { key: 'group.update', action: 'update', riskLevel: 'medium', description: 'Edit group membership and role assignments', sets: ['pset:heartwood:iam_admin'] },
        { key: 'group.delete', action: 'delete', riskLevel: 'high', description: 'Remove user groups', sets: ['pset:heartwood:iam_admin'] },
        { key: 'group.read_revisions', action: 'read_revisions', riskLevel: 'low', description: 'View group change history', sets: ['pset:heartwood:iam_viewer','pset:heartwood:iam_admin'] },
      ]},
      { subject: 'PermissionSet', key: 'permission_set', capabilities: [
        { key: 'permission_set.read', action: 'read', riskLevel: 'low', description: 'View permission sets and their capabilities', sets: ['pset:heartwood:iam_viewer','pset:heartwood:iam_admin'] },
        { key: 'permission_set.create', action: 'create', riskLevel: 'high', description: 'Create custom permission sets', sets: ['pset:heartwood:iam_admin'] },
        { key: 'permission_set.update', action: 'update', riskLevel: 'high', description: 'Edit permission set capabilities', sets: ['pset:heartwood:iam_admin'] },
        { key: 'permission_set.delete', action: 'delete', riskLevel: 'critical', description: 'Remove custom permission sets', sets: ['pset:heartwood:iam_admin'] },
        { key: 'permission_set.read_revisions', action: 'read_revisions', riskLevel: 'low', description: 'View permission set change history', sets: ['pset:heartwood:iam_viewer','pset:heartwood:iam_admin'] },
      ]},
      { subject: 'Organization', key: 'organization', capabilities: [
        { key: 'organization.read', action: 'read', riskLevel: 'low', description: 'View organization settings', sets: ['pset:heartwood:iam_viewer','pset:heartwood:iam_admin'] },
        { key: 'organization.update', action: 'update', riskLevel: 'medium', description: 'Edit organization settings', sets: ['pset:heartwood:iam_admin'] },
      ]},
      { subject: 'OrganizationDomain', key: 'organization_domain', capabilities: [
        { key: 'organization_domain.delete', action: 'delete', riskLevel: 'high', description: 'Remove verified email domains', sets: ['pset:heartwood:iam_admin'] },
      ]},
      { subject: 'Dashboard', key: 'dashboard', capabilities: [
        { key: 'dashboard.read', action: 'read', riskLevel: 'low', description: 'View dashboard and widgets', sets: ['pset:heartwood:iam_viewer','pset:heartwood:iam_admin'] },
      ]},
      { subject: 'AuditLog', key: 'audit_log', capabilities: [
        { key: 'audit_log.read', action: 'read', riskLevel: 'low', description: 'View admin audit log entries', sets: ['pset:heartwood:audit_viewer'] },
        { key: 'audit_log.export', action: 'export', riskLevel: 'medium', description: 'Export audit log records', sets: ['pset:heartwood:audit_viewer'] },
      ]},
    ],
  },
  { module: 'sycamore', label: 'Sycamore', description: 'Accounts payable & vendor invoice management',
    permissionSets: [
      { slug: 'pset:sycamore:ap_viewer', name: 'AP viewer', description: 'View vendor invoices, vendors, rush payments, and master data' },
      { slug: 'pset:sycamore:ap_operator', name: 'AP operator', description: 'Process vendor invoices, manage vendors, and submit rush payments' },
      { slug: 'pset:sycamore:ap_admin', name: 'AP admin', description: 'Full accounts payable management including approvals, exports, and settings' },
    ],
    subjects: [
      { subject: 'Vendor', key: 'vendor', capabilities: [
        { key: 'vendor.read', action: 'read', riskLevel: 'low', description: 'View vendor profiles', sets: ['pset:sycamore:ap_viewer','pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
        { key: 'vendor.create', action: 'create', riskLevel: 'medium', description: 'Create vendor records', sets: ['pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
        { key: 'vendor.update', action: 'update', riskLevel: 'medium', description: 'Edit vendor profiles', sets: ['pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
      ]},
      { subject: 'VendorInvoice', key: 'vendor_invoice', capabilities: [
        { key: 'vendor_invoice.read', action: 'read', riskLevel: 'low', description: 'View assigned or delegated vendor invoices', sets: ['pset:sycamore:ap_viewer','pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
        { key: 'vendor_invoice.read_all', action: 'read_all', riskLevel: 'low', description: 'View all tenant vendor invoices regardless of assignment', sets: ['pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
        { key: 'vendor_invoice.create', action: 'create', riskLevel: 'medium', description: 'Create vendor invoices', sets: ['pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
        { key: 'vendor_invoice.update', action: 'update', riskLevel: 'medium', description: 'Edit vendor invoice details', sets: ['pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
        { key: 'vendor_invoice.approve', action: 'approve', riskLevel: 'high', description: 'Approve vendor invoices for payment', sets: ['pset:sycamore:ap_admin'] },
        { key: 'vendor_invoice.delete', action: 'delete', riskLevel: 'high', description: 'Remove vendor invoices', sets: ['pset:sycamore:ap_admin'] },
        { key: 'vendor_invoice.export', action: 'export', riskLevel: 'medium', description: 'Export vendor invoice data', sets: ['pset:sycamore:ap_admin'] },
        { key: 'vendor_invoice.read_revisions', action: 'read_revisions', riskLevel: 'low', description: 'View vendor invoice change history', sets: ['pset:sycamore:ap_viewer','pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
        { key: 'vendor_invoice.read_comments', action: 'read_comments', riskLevel: 'low', description: 'View comments on vendor invoices', sets: ['pset:sycamore:ap_viewer','pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
        { key: 'vendor_invoice.write_comments', action: 'write_comments', riskLevel: 'low', description: 'Add and edit own comments on vendor invoices', sets: ['pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
        { key: 'vendor_invoice.moderate_comments', action: 'moderate_comments', riskLevel: 'medium', description: 'Delete any comment on vendor invoices', sets: ['pset:sycamore:ap_admin'] },
      ]},
      { subject: 'RushPayment', key: 'rush_payment', capabilities: [
        { key: 'rush_payment.read', action: 'read', riskLevel: 'low', description: 'View own submitted rush payment requests', sets: ['pset:sycamore:ap_viewer','pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
        { key: 'rush_payment.read_all', action: 'read_all', riskLevel: 'low', description: 'View all tenant rush payment requests', sets: ['pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
        { key: 'rush_payment.create', action: 'create', riskLevel: 'medium', description: 'Submit rush payment requests', sets: ['pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
      ]},
      { subject: 'MasterData', key: 'master_data', capabilities: [
        { key: 'master_data.read', action: 'read', riskLevel: 'low', description: 'View AP master data configuration', sets: ['pset:sycamore:ap_viewer','pset:sycamore:ap_operator','pset:sycamore:ap_admin'] },
        { key: 'master_data.update', action: 'update', riskLevel: 'medium', description: 'Edit AP master data configuration', sets: ['pset:sycamore:ap_admin'] },
      ]},
      { subject: 'SycamoreSettings', key: 'sycamore_settings', capabilities: [
        { key: 'sycamore_settings.read', action: 'read', riskLevel: 'low', description: 'View Sycamore module settings', sets: ['pset:sycamore:ap_admin'] },
        { key: 'sycamore_settings.update', action: 'update', riskLevel: 'medium', description: 'Edit Sycamore module settings', sets: ['pset:sycamore:ap_admin'] },
      ]},
    ],
  },
  { module: 'willow', label: 'Willow', description: 'Legal billing & invoice review',
    permissionSets: [
      { slug: 'pset:willow:billing_viewer', name: 'Billing viewer', description: 'View invoices, fees, expenses, and reports' },
      { slug: 'pset:willow:billing_operator', name: 'Billing operator', description: 'Create and edit invoices and line items' },
      { slug: 'pset:willow:billing_admin', name: 'Billing admin', description: 'Full billing management including delete, export, and settings' },
    ],
    subjects: [
      { subject: 'Invoice', key: 'invoice', capabilities: [
        { key: 'invoice.read', action: 'read', riskLevel: 'low', description: 'View invoices visible via assignment, delegation, or collaboration', sets: ['pset:willow:billing_viewer','pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice.read_all', action: 'read_all', riskLevel: 'low', description: 'View all tenant invoices regardless of visibility rules', sets: ['pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice.create', action: 'create', riskLevel: 'medium', description: 'Create invoices', sets: ['pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice.update', action: 'update', riskLevel: 'medium', description: 'Edit invoice details', sets: ['pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice.delete', action: 'delete', riskLevel: 'high', description: 'Remove invoices', sets: ['pset:willow:billing_admin'] },
        { key: 'invoice.export', action: 'export', riskLevel: 'medium', description: 'Export invoice data', sets: ['pset:willow:billing_admin'] },
        { key: 'invoice.read_revisions', action: 'read_revisions', riskLevel: 'low', description: 'View invoice change history', sets: ['pset:willow:billing_viewer','pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice.read_comments', action: 'read_comments', riskLevel: 'low', description: 'View comments on invoices', sets: ['pset:willow:billing_viewer','pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice.write_comments', action: 'write_comments', riskLevel: 'low', description: 'Add and edit own comments on invoices', sets: ['pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice.moderate_comments', action: 'moderate_comments', riskLevel: 'medium', description: 'Delete any comment on invoices', sets: ['pset:willow:billing_admin'] },
      ]},
      { subject: 'InvoiceFee', key: 'invoice_fee', capabilities: [
        { key: 'invoice_fee.read', action: 'read', riskLevel: 'low', description: 'View fee line items on invoices', sets: ['pset:willow:billing_viewer','pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice_fee.create', action: 'create', riskLevel: 'medium', description: 'Add fee line items to invoices', sets: ['pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice_fee.update', action: 'update', riskLevel: 'medium', description: 'Edit fee line items on invoices', sets: ['pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice_fee.delete', action: 'delete', riskLevel: 'medium', description: 'Exclude fee line items from invoices', sets: ['pset:willow:billing_admin'] },
        { key: 'invoice_fee.read_revisions', action: 'read_revisions', riskLevel: 'low', description: 'View fee line item change history', sets: ['pset:willow:billing_viewer','pset:willow:billing_operator','pset:willow:billing_admin'] },
      ]},
      { subject: 'InvoiceExpense', key: 'invoice_expense', capabilities: [
        { key: 'invoice_expense.read', action: 'read', riskLevel: 'low', description: 'View expense line items on invoices', sets: ['pset:willow:billing_viewer','pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice_expense.create', action: 'create', riskLevel: 'medium', description: 'Add expense line items to invoices', sets: ['pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice_expense.update', action: 'update', riskLevel: 'medium', description: 'Edit expense line items on invoices', sets: ['pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'invoice_expense.delete', action: 'delete', riskLevel: 'medium', description: 'Exclude expense line items from invoices', sets: ['pset:willow:billing_admin'] },
        { key: 'invoice_expense.read_revisions', action: 'read_revisions', riskLevel: 'low', description: 'View expense line item change history', sets: ['pset:willow:billing_viewer','pset:willow:billing_operator','pset:willow:billing_admin'] },
      ]},
      { subject: 'Report', key: 'report', capabilities: [
        { key: 'report.read', action: 'read', riskLevel: 'low', description: 'View billing reports', sets: ['pset:willow:billing_viewer','pset:willow:billing_operator','pset:willow:billing_admin'] },
        { key: 'report.export', action: 'export', riskLevel: 'medium', description: 'Export billing reports', sets: ['pset:willow:billing_admin'] },
      ]},
      { subject: 'WillowSettings', key: 'willow_settings', capabilities: [
        { key: 'willow_settings.read', action: 'read', riskLevel: 'low', description: 'View Willow module settings', sets: ['pset:willow:billing_admin'] },
        { key: 'willow_settings.update', action: 'update', riskLevel: 'medium', description: 'Edit Willow module settings', sets: ['pset:willow:billing_admin'] },
      ]},
    ],
  },
  { module: 'juniper', label: 'Juniper', description: 'Trust accounting & disbursements',
    permissionSets: [
      { slug: 'pset:juniper:transaction_viewer', name: 'Transaction viewer', description: 'View trust account transactions' },
      { slug: 'pset:juniper:transaction_operator', name: 'Transaction operator', description: 'Create and manage trust account transactions' },
      { slug: 'pset:juniper:trust_viewer', name: 'Trust request viewer', description: 'View trust requests and their history' },
      { slug: 'pset:juniper:trust_operator', name: 'Trust request operator', description: 'Submit and track trust requests' },
      { slug: 'pset:juniper:trust_admin', name: 'Trust request admin', description: 'Approve, reject, and manage trust requests' },
      { slug: 'pset:juniper:admin', name: 'Juniper admin', description: 'Manage Juniper settings and TPA site configuration' },
    ],
    subjects: [
      { subject: 'Transaction', key: 'transaction', capabilities: [
        { key: 'transaction.read', action: 'read', riskLevel: 'low', description: 'View trust account transactions', sets: ['pset:juniper:transaction_viewer','pset:juniper:transaction_operator'] },
        { key: 'transaction.create', action: 'create', riskLevel: 'medium', description: 'Create trust account transactions', sets: ['pset:juniper:transaction_operator'] },
        { key: 'transaction.update', action: 'update', riskLevel: 'medium', description: 'Edit trust account transactions', sets: ['pset:juniper:transaction_operator'] },
        { key: 'transaction.delete', action: 'delete', riskLevel: 'high', description: 'Remove trust account transactions', sets: ['pset:juniper:transaction_operator'] },
      ]},
      { subject: 'TrustRequest', key: 'trust_request', capabilities: [
        { key: 'trust_request.read', action: 'read', riskLevel: 'low', description: 'View own submitted trust requests', sets: ['pset:juniper:trust_viewer','pset:juniper:trust_operator','pset:juniper:trust_admin'] },
        { key: 'trust_request.read_all', action: 'read_all', riskLevel: 'low', description: 'View all tenant trust requests', sets: ['pset:juniper:trust_operator','pset:juniper:trust_admin'] },
        { key: 'trust_request.create', action: 'create', riskLevel: 'medium', description: 'Submit trust requests', sets: ['pset:juniper:trust_operator','pset:juniper:trust_admin'] },
        { key: 'trust_request.approve', action: 'approve', riskLevel: 'high', description: 'Approve or reject trust requests', sets: ['pset:juniper:trust_admin'] },
        { key: 'trust_request.delete', action: 'delete', riskLevel: 'high', description: 'Remove trust requests', sets: ['pset:juniper:trust_admin'] },
        { key: 'trust_request.read_revisions', action: 'read_revisions', riskLevel: 'low', description: 'View trust request change history', sets: ['pset:juniper:trust_viewer','pset:juniper:trust_operator','pset:juniper:trust_admin'] },
        { key: 'trust_request.read_comments', action: 'read_comments', riskLevel: 'low', description: 'View comments on trust requests', sets: ['pset:juniper:trust_viewer','pset:juniper:trust_operator','pset:juniper:trust_admin'] },
        { key: 'trust_request.write_comments', action: 'write_comments', riskLevel: 'low', description: 'Add and edit own comments on trust requests', sets: ['pset:juniper:trust_operator','pset:juniper:trust_admin'] },
        { key: 'trust_request.moderate_comments', action: 'moderate_comments', riskLevel: 'medium', description: 'Delete any comment on trust requests', sets: ['pset:juniper:trust_admin'] },
      ]},
      { subject: 'JuniperSettings', key: 'juniper_settings', capabilities: [
        { key: 'juniper_settings.read', action: 'read', riskLevel: 'low', description: 'View Juniper module settings', sets: ['pset:juniper:admin'] },
        { key: 'juniper_settings.update', action: 'update', riskLevel: 'medium', description: 'Edit Juniper module settings', sets: ['pset:juniper:admin'] },
      ]},
    ],
  },
  { module: 'banyan', label: 'Banyan', description: 'Data integration & master data management',
    permissionSets: [
      { slug: 'pset:banyan:data_viewer', name: 'Data viewer', description: 'View matter details, clients, and integration connections' },
      { slug: 'pset:banyan:data_admin', name: 'Data admin', description: 'Manage integrations, matter configuration, and module settings' },
    ],
    subjects: [
      { subject: 'Connection', key: 'connection', capabilities: [
        { key: 'connection.read', action: 'read', riskLevel: 'low', description: 'View platform integration connections', sets: ['pset:banyan:data_viewer','pset:banyan:data_admin'] },
        { key: 'connection.create', action: 'create', riskLevel: 'high', description: 'Initiate and complete platform OAuth connections', sets: ['pset:banyan:data_admin'] },
        { key: 'connection.update', action: 'update', riskLevel: 'medium', description: 'Update connection configuration and webhook secrets', sets: ['pset:banyan:data_admin'] },
        { key: 'connection.delete', action: 'delete', riskLevel: 'critical', description: 'Disconnect platform integrations and revoke credentials', sets: ['pset:banyan:data_admin'] },
      ]},
      { subject: 'MatterDetails', key: 'matter_details', capabilities: [
        { key: 'matter_details.read', action: 'read', riskLevel: 'low', description: 'View XTND-managed matter configuration', sets: ['pset:banyan:data_viewer','pset:banyan:data_admin'] },
        { key: 'matter_details.update', action: 'update', riskLevel: 'medium', description: 'Edit matter team assignments, billing config, and payers', sets: ['pset:banyan:data_admin'] },
        { key: 'matter_details.read_revisions', action: 'read_revisions', riskLevel: 'low', description: 'View matter configuration change history', sets: ['pset:banyan:data_viewer','pset:banyan:data_admin'] },
      ]},
      { subject: 'Client', key: 'client', capabilities: [
        { key: 'client.read', action: 'read', riskLevel: 'low', description: 'View client details beyond lookup', sets: ['pset:banyan:data_viewer','pset:banyan:data_admin'] },
      ]},
      { subject: 'BanyanSettings', key: 'banyan_settings', capabilities: [
        { key: 'banyan_settings.read', action: 'read', riskLevel: 'low', description: 'View Banyan module settings', sets: ['pset:banyan:data_admin'] },
        { key: 'banyan_settings.update', action: 'update', riskLevel: 'medium', description: 'Edit Banyan module settings', sets: ['pset:banyan:data_admin'] },
      ]},
    ],
  },
];

// ---------- Conditions --------------------------------------------------

const RBAC_CONDITIONS = [
  { id: 'is-creator', label: 'Is Creator', description: 'Only if the current user created the record' },
  { id: 'same-role', label: 'Same Role as Creator', description: 'Only if the user shares a role with the record creator' },
  { id: 'same-dept', label: 'Same Department', description: 'Only if the record belongs to the user\'s department' },
];

// ---------- Derived Permission Sets (from catalog permissionSets + capability.sets) ---

const PERMISSION_SETS_DATA = (() => {
  const map = {};
  CAPABILITY_CATALOG.forEach((mod) => {
    (mod.permissionSets || []).forEach((ps) => {
      map[ps.slug] = { ...ps, type: 'System', module: mod.label, moduleId: mod.module, capabilities: [], updatedAt: '2026-05-19' };
    });
    mod.subjects.forEach((subj) => {
      subj.capabilities.forEach((cap) => {
        (cap.sets || []).forEach((slug) => {
          if (map[slug]) map[slug].capabilities.push(cap.key);
        });
      });
    });
  });
  return Object.values(map).map((ps, i) => ({ ...ps, id: i + 1, modules: [ps.module] }));
})();

// ---------- System Roles (from 05-system-role-mapping.md) -----------------

const _psetIds = (slugs) => PERMISSION_SETS_DATA.filter((ps) => slugs.includes(ps.slug)).map((ps) => ps.id);

const ROLES_DATA = [
  { id: 1, key: 'tenant:administrator', name: 'Administrator', type: 'System', description: 'Full platform access across all modules.', members: 2,
    permissionSets: _psetIds(['pset:heartwood:iam_admin','pset:heartwood:audit_viewer','pset:sycamore:ap_admin','pset:willow:billing_admin','pset:juniper:transaction_operator','pset:juniper:trust_admin','pset:juniper:admin','pset:banyan:data_admin']),
    customCapabilities: [], updatedAt: '2026-05-19' },
  { id: 2, key: 'tenant:accounting_admin', name: 'Accounting admin', type: 'System', description: 'AP and billing management with trust operations.', members: 3,
    permissionSets: _psetIds(['pset:heartwood:iam_viewer','pset:sycamore:ap_admin','pset:willow:billing_admin','pset:juniper:transaction_operator','pset:juniper:trust_admin','pset:banyan:data_admin']),
    customCapabilities: [], updatedAt: '2026-05-19' },
  { id: 3, key: 'tenant:billing_admin', name: 'Billing admin', type: 'System', description: 'Legal billing management with read-only AP access.', members: 2,
    permissionSets: _psetIds(['pset:heartwood:iam_viewer','pset:sycamore:ap_viewer','pset:willow:billing_admin','pset:banyan:data_viewer']),
    customCapabilities: [], updatedAt: '2026-05-19' },
  { id: 4, key: 'tenant:supervisor', name: 'Supervisor', type: 'System', description: 'Oversight with read access across all modules.', members: 4,
    permissionSets: _psetIds(['pset:heartwood:iam_viewer','pset:sycamore:ap_viewer','pset:willow:billing_viewer','pset:juniper:transaction_viewer','pset:juniper:trust_viewer','pset:banyan:data_viewer']),
    customCapabilities: [], updatedAt: '2026-05-19' },
  { id: 5, key: 'tenant:bookkeeper', name: 'Bookkeeper', type: 'System', description: 'Day-to-day AP and trust operations with billing processing.', members: 3,
    permissionSets: _psetIds(['pset:sycamore:ap_operator','pset:willow:billing_operator','pset:juniper:transaction_viewer','pset:juniper:trust_operator','pset:banyan:data_viewer']),
    customCapabilities: ['dashboard.read'], updatedAt: '2026-05-19' },
  { id: 6, key: 'tenant:billing_clerk', name: 'Billing clerk', type: 'System', description: 'Day-to-day billing operations with AP visibility.', members: 5,
    permissionSets: _psetIds(['pset:sycamore:ap_viewer','pset:willow:billing_operator','pset:banyan:data_viewer']),
    customCapabilities: ['dashboard.read'], updatedAt: '2026-05-19' },
  { id: 7, key: 'tenant:accounting_clerk', name: 'Accounting clerk', type: 'System', description: 'AP processing and trust operations with billing visibility.', members: 3,
    permissionSets: _psetIds(['pset:sycamore:ap_operator','pset:willow:billing_viewer','pset:juniper:transaction_viewer','pset:juniper:trust_operator','pset:banyan:data_viewer']),
    customCapabilities: ['dashboard.read'], updatedAt: '2026-05-19' },
  { id: 8, key: 'tenant:hr_admin', name: 'HR admin', type: 'System', description: 'Full user management — create, edit, suspend, and remove accounts.', members: 1,
    permissionSets: _psetIds(['pset:heartwood:iam_admin']),
    customCapabilities: [], updatedAt: '2026-05-19' },
  { id: 9, key: 'tenant:hr_clerk', name: 'HR clerk', type: 'System', description: 'View user information and organization settings.', members: 2,
    permissionSets: _psetIds(['pset:heartwood:iam_viewer']),
    customCapabilities: [], updatedAt: '2026-05-19' },
  { id: 10, key: 'tenant:partner', name: 'Partner', type: 'System', description: 'Attorney — billing and matter visibility with AP read access.', members: 8,
    permissionSets: _psetIds(['pset:sycamore:ap_viewer','pset:willow:billing_viewer','pset:banyan:data_viewer']),
    customCapabilities: ['dashboard.read'], updatedAt: '2026-05-19' },
  { id: 11, key: 'tenant:of_counsel', name: 'Of counsel', type: 'System', description: 'Attorney — billing and matter visibility with AP read access.', members: 4,
    permissionSets: _psetIds(['pset:sycamore:ap_viewer','pset:willow:billing_viewer','pset:banyan:data_viewer']),
    customCapabilities: ['dashboard.read'], updatedAt: '2026-05-19' },
  { id: 12, key: 'tenant:associate', name: 'Associate', type: 'System', description: 'Attorney — billing and matter visibility with AP read access.', members: 12,
    permissionSets: _psetIds(['pset:sycamore:ap_viewer','pset:willow:billing_viewer','pset:banyan:data_viewer']),
    customCapabilities: ['dashboard.read'], updatedAt: '2026-05-19' },
  { id: 13, key: 'tenant:paralegal', name: 'Paralegal', type: 'System', description: 'Limited billing and matter visibility.', members: 6,
    permissionSets: _psetIds(['pset:willow:billing_viewer','pset:banyan:data_viewer']),
    customCapabilities: ['dashboard.read'], updatedAt: '2026-05-19' },
  { id: 14, key: 'tenant:assistant', name: 'Assistant', type: 'System', description: 'Minimal access — dashboard only.', members: 3,
    permissionSets: [],
    customCapabilities: ['dashboard.read'], updatedAt: '2026-05-19' },
];

// ---------- Helpers ----------------------------------------------------

const toSlug = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const RISK_VARIANT = { low: 'neutral', medium: 'warn', high: 'danger', critical: 'danger' };
const ACTION_VARIANT = {
  read: 'info', read_all: 'info', create: 'accent', update: 'warn', delete: 'danger',
  approve: 'success', export: 'neutral', invite: 'accent', suspend: 'danger', unsuspend: 'success',
  read_revisions: 'neutral', read_comments: 'neutral', write_comments: 'info', moderate_comments: 'warn',
};

const getAllCapKeys = (moduleId) => {
  const mod = CAPABILITY_CATALOG.find((m) => m.module === moduleId);
  return mod ? mod.subjects.flatMap((s) => s.capabilities.map((c) => c.key)) : [];
};

const countSelected = (keys, selected) =>
  keys.filter((k) => selected.has(k)).length;

const lookupCapability = (capKey) => {
  for (const mod of CAPABILITY_CATALOG) {
    for (const subj of mod.subjects) {
      const cap = subj.capabilities.find((c) => c.key === capKey);
      if (cap) return { ...cap, module: mod.label, moduleId: mod.module, subject: subj.subject, subjectKey: subj.key };
    }
  }
  return null;
};

const getRoleTotalCaps = (role) => {
  const s = new Set();
  (role.permissionSets || []).forEach((id) => {
    const ps = PERMISSION_SETS_DATA.find((p) => p.id === id);
    if (ps) ps.capabilities.forEach((c) => s.add(c));
  });
  (role.customCapabilities || []).forEach((c) => s.add(c));
  return s;
};

// ---------- Shared: SearchInput ----------------------------------------

const SearchInput = ({ value, onChange, placeholder }) => (
  <div style={{ position: 'relative' }}>
    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-3)', pointerEvents: 'none' }}>
      <Icon name="search" size={14} />
    </span>
    <input className="x-input" style={{ paddingLeft: 32, height: 30, width: '100%' }} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

// ---------- CapabilityGrid (grouped list, two-line per item) -----------

const CapabilityGrid = ({ capKeys }) => {
  const [q, setQ] = React.useState('');
  const [expanded, setExpanded] = React.useState(() => new Set(CAPABILITY_CATALOG.map((m) => m.module)));

  const toggleMod = (id) => {
    const n = new Set(expanded);
    n.has(id) ? n.delete(id) : n.add(id);
    setExpanded(n);
  };

  const lq = q.toLowerCase().trim();

  const grouped = React.useMemo(() => {
    const result = [];
    for (const mod of CAPABILITY_CATALOG) {
      const subjects = [];
      for (const subj of mod.subjects) {
        const caps = subj.capabilities.filter((c) => {
          if (!capKeys.has(c.key)) return false;
          if (lq && !(c.key.includes(lq) || c.description.toLowerCase().includes(lq) || c.action.includes(lq) || mod.label.toLowerCase().includes(lq))) return false;
          return true;
        });
        if (caps.length) subjects.push({ ...subj, capabilities: caps });
      }
      if (subjects.length) {
        const count = subjects.reduce((s, sub) => s + sub.capabilities.length, 0);
        result.push({ ...mod, subjects, capCount: count });
      }
    }
    return result;
  }, [capKeys, lq]);

  React.useEffect(() => { if (lq) setExpanded(new Set(grouped.map((m) => m.module))); }, [lq]);

  const total = grouped.reduce((s, g) => s + g.capCount, 0);

  return (
    <div className="x-cap-grid">
      <div className="x-cap-grid__toolbar">
        <SearchInput value={q} onChange={setQ} placeholder="Filter capabilities..." />
        <span className="x-cap-grid__count">{total} capabilities</span>
      </div>
      {grouped.length === 0 && (
        <div className="x-cap-grid__empty">{lq ? 'No capabilities match your filter.' : 'No capabilities assigned.'}</div>
      )}
      {grouped.map((mod) => {
        const isOpen = expanded.has(mod.module);
        return (
          <div key={mod.module} className={cls('x-cap-group', isOpen && 'is-open')}>
            <button type="button" className="x-cap-group__header" onClick={() => toggleMod(mod.module)} aria-expanded={isOpen}>
              <span className="x-cap-group__chevron"><Icon name="chevronRight" size={11} /></span>
              <Icon name={MODULE_ICONS[mod.module] || 'settings'} size={13} />
              <span className="x-cap-group__label">{mod.label}</span>
              <span className="x-cap-group__count">{mod.capCount}</span>
            </button>
            {isOpen && (
              <div className="x-cap-group__body">
                {mod.subjects.map((subj) => (
                  <React.Fragment key={subj.key}>
                    {mod.subjects.length > 1 && <div className="x-cap-subject">{subj.subject}</div>}
                    {subj.capabilities.map((cap) => (
                      <div key={cap.key} className="x-cap-item">
                        <div className="x-cap-item__top">
                          <code className="x-cap-item__key">{cap.key}</code>
                          <Badge variant={RISK_VARIANT[cap.riskLevel]}>{cap.riskLevel}</Badge>
                        </div>
                        <div className="x-cap-item__desc">{cap.description}</div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ---------- ConditionsPopover ------------------------------------------

const ConditionsPopover = ({ capKey, currentConditions = [], onUpdate, onClose }) => {
  const popRef = React.useRef(null);
  React.useEffect(() => {
    const onClick = (e) => { if (popRef.current && !popRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [onClose]);

  const toggle = (condId) => {
    const next = currentConditions.includes(condId) ? currentConditions.filter((c) => c !== condId) : [...currentConditions, condId];
    onUpdate(capKey, next);
  };

  return (
    <div ref={popRef} className="x-perm-conditions" onClick={(e) => e.stopPropagation()}>
      <div className="x-perm-conditions__title">Conditions for <code style={{ fontSize: 'var(--fs-xs)' }}>{capKey}</code></div>
      <div className="x-perm-conditions__hint">Restrict when this capability applies</div>
      {RBAC_CONDITIONS.map((cond) => (
        <label key={cond.id} className="x-perm-conditions__item" style={{ cursor: 'pointer' }}>
          <Checkbox checked={currentConditions.includes(cond.id)} onChange={() => toggle(cond.id)} />
          <div className="x-perm-conditions__item-text">
            <span className="x-perm-conditions__item-label">{cond.label}</span>
            <span className="x-perm-conditions__item-desc">{cond.description}</span>
          </div>
        </label>
      ))}
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', fontStyle: 'italic', marginTop: 4 }}>More condition types coming soon (attribute-based rules, etc.)</div>
    </div>
  );
};

// ---------- CapabilityTree (selection, for create sheets) --------------

const CapabilityTree = ({ selectedCaps, onToggleCap, conditions = {}, onSetConditions, searchQ = '', disabledCaps }) => {
  const [expanded, setExpanded] = React.useState(new Set());
  const [condPopover, setCondPopover] = React.useState(null);
  const q = searchQ.toLowerCase().trim();

  const filteredModules = React.useMemo(() => {
    if (!q) return CAPABILITY_CATALOG;
    return CAPABILITY_CATALOG.map((mod) => ({
      ...mod,
      subjects: mod.subjects.map((subj) => ({
        ...subj,
        capabilities: subj.capabilities.filter((c) =>
          c.key.includes(q) || c.description.toLowerCase().includes(q) || c.action.includes(q) || mod.label.toLowerCase().includes(q) || subj.subject.toLowerCase().includes(q)
        ),
      })).filter((s) => s.capabilities.length > 0),
    })).filter((m) => m.subjects.length > 0);
  }, [q]);

  React.useEffect(() => { if (q) setExpanded(new Set(filteredModules.map((m) => m.module))); }, [q]);

  const toggleModule = (moduleId) => {
    const keys = getAllCapKeys(moduleId);
    const selectable = disabledCaps ? keys.filter((k) => !disabledCaps.has(k)) : keys;
    const allSelected = selectable.every((k) => selectedCaps.has(k));
    selectable.forEach((k) => {
      if (allSelected && selectedCaps.has(k)) onToggleCap(k);
      if (!allSelected && !selectedCaps.has(k)) onToggleCap(k);
    });
  };

  return (
    <div>
      {filteredModules.map((mod) => {
        const allKeys = getAllCapKeys(mod.module);
        const selectedCount = countSelected(allKeys, selectedCaps) + (disabledCaps ? countSelected(allKeys, disabledCaps) : 0);
        const total = allKeys.length;
        const isOpen = expanded.has(mod.module);
        const allChecked = selectedCount === total;

        return (
          <div key={mod.module} className={cls('x-cap-group', isOpen && 'is-open')}>
            <div className="x-cap-group__header" style={{ cursor: 'pointer' }} onClick={() => { const n = new Set(expanded); n.has(mod.module) ? n.delete(mod.module) : n.add(mod.module); setExpanded(n); }} aria-expanded={isOpen}>
              <span className="x-cap-group__chevron"><Icon name="chevronRight" size={11} /></span>
              <Icon name={MODULE_ICONS[mod.module] || 'settings'} size={13} />
              <span className="x-cap-group__label">{mod.label}</span>
              {selectedCount > 0 && <Badge variant="neutral">{selectedCount}/{total}</Badge>}
              <button type="button" className="x-perm-module__toggle" onClick={(e) => { e.stopPropagation(); toggleModule(mod.module); }}>{allChecked ? 'Deselect all' : 'Select all'}</button>
            </div>
            {isOpen && (
              <div className="x-cap-group__body">
                {mod.subjects.map((subj) => (
                  <React.Fragment key={subj.key}>
                    {mod.subjects.length > 1 && <div className="x-cap-subject">{subj.subject}</div>}
                    {subj.capabilities.map((cap) => {
                      const isDis = disabledCaps && disabledCaps.has(cap.key);
                      const isChk = selectedCaps.has(cap.key) || isDis;
                      const capConds = conditions[cap.key] || [];
                      return (
                        <label key={cap.key} className={cls('x-cap-item x-cap-item--selectable', isDis && 'is-disabled')} style={{ position: 'relative' }}>
                          <div className="x-cap-item__top">
                            <Checkbox checked={isChk} disabled={isDis} onChange={() => !isDis && onToggleCap(cap.key)} />
                            <code className="x-cap-item__key">{cap.key}</code>
                            {(cap.riskLevel === 'high' || cap.riskLevel === 'critical') && <Badge variant={RISK_VARIANT[cap.riskLevel]}>{cap.riskLevel}</Badge>}
                            <span className={cls('x-perm-action__gear', capConds.length > 0 && 'has-conditions')}>
                              <IconButton icon="settings" size="sm" title="Set conditions" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCondPopover(condPopover === cap.key ? null : cap.key); }} />
                            </span>
                          </div>
                          <div className="x-cap-item__desc" style={{ paddingLeft: 26 }}>{cap.description}</div>
                          {condPopover === cap.key && onSetConditions && <ConditionsPopover capKey={cap.key} currentConditions={capConds} onUpdate={onSetConditions} onClose={() => setCondPopover(null)} />}
                        </label>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {filteredModules.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-3)', fontSize: 'var(--fs-sm)' }}>No capabilities match your search.</div>}
    </div>
  );
};

// ---------- InlineSheet (right-side, full-height, inline) --------------

const InlineSheet = ({ title, subtitle, onClose, footer, children }) => {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div className="x-perm-sheet-scrim" onClick={onClose} />
      <div className="x-perm-sheet" role="dialog" aria-label={title}>
        <div className="x-perm-sheet__header">
          <div>
            <div className="x-perm-sheet__title">{title}</div>
            {subtitle && <div className="x-perm-sheet__desc">{subtitle}</div>}
          </div>
          <IconButton icon="x" onClick={onClose} title="Close" />
        </div>
        <div className="x-perm-sheet__body">{children}</div>
        {footer && <div className="x-perm-sheet__footer">{footer}</div>}
      </div>
    </>
  );
};

// ---------- CreateSetSheet ---------------------------------------------

const CreateSetSheet = ({ onClose, editData }) => {
  const isEdit = !!editData;
  const [name, setName] = React.useState(editData ? editData.name : '');
  const [slug, setSlug] = React.useState(editData ? editData.slug : '');
  const [slugEdited, setSlugEdited] = React.useState(!!editData);
  const [description, setDescription] = React.useState(editData ? editData.description : '');
  const [selectedCaps, setSelectedCaps] = React.useState(editData ? new Set(editData.capabilities) : new Set());
  const [conditions, setConditions] = React.useState({});
  const [searchQ, setSearchQ] = React.useState('');

  React.useEffect(() => { if (!slugEdited) setSlug(toSlug(name)); }, [name, slugEdited]);

  const onToggleCap = (key) => { const n = new Set(selectedCaps); n.has(key) ? n.delete(key) : n.add(key); setSelectedCaps(n); };

  return (
    <InlineSheet
      title={isEdit ? `Edit: ${editData.name}` : 'Create Permission Set'}
      subtitle={isEdit ? 'Update capabilities in this permission set. Changes affect all roles that include it.' : 'Group capabilities into a reusable set that can be assigned to one or more roles.'}
      onClose={onClose}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="accent" disabled={!name.trim()}>{isEdit ? 'Save Changes' : 'Create Permission Set'}</Button></>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Name" required hint="Choose a descriptive name your team will recognize.">
          <Input placeholder="e.g. Invoice Reviewer, AP Manager" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Description" hint="Help other admins understand what this set is for.">
          <Textarea placeholder="e.g. Grants read and comment access to invoices for the review team." rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
      </div>
      <div>
        <div className="x-perm-section-head">
          <span className="x-perm-section-label">Select Capabilities</span>
          {selectedCaps.size > 0 && <Badge variant="accent">{selectedCaps.size} selected</Badge>}
        </div>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginBottom: 12, lineHeight: 1.5 }}>
          Select which actions users with this set can perform. Capabilities are grouped by module.
        </div>
        <SearchInput value={searchQ} onChange={setSearchQ} placeholder="Filter by name, action, or module..." />
        <div style={{ marginTop: 12 }}>
          <CapabilityTree selectedCaps={selectedCaps} onToggleCap={onToggleCap} conditions={conditions} onSetConditions={(k, c) => setConditions((p) => ({ ...p, [k]: c }))} searchQ={searchQ} />
        </div>
      </div>
    </InlineSheet>
  );
};

// ---------- CreateRoleSheet --------------------------------------------

const CreateRoleSheet = ({ onClose }) => {
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [slugEdited, setSlugEdited] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('sets');
  const [selectedSets, setSelectedSets] = React.useState(new Set());
  const [customCaps, setCustomCaps] = React.useState(new Set());
  const [conditions, setConditions] = React.useState({});
  const [setSearchQ, setSetSearchQ] = React.useState('');
  const [capSearchQ, setCapSearchQ] = React.useState('');

  React.useEffect(() => { if (!slugEdited) setSlug(toSlug(name)); }, [name, slugEdited]);

  const disabledCaps = React.useMemo(() => {
    const d = new Set();
    PERMISSION_SETS_DATA.forEach((ps) => { if (selectedSets.has(ps.id)) ps.capabilities.forEach((c) => d.add(c)); });
    return d;
  }, [selectedSets]);

  const totalCaps = new Set([...disabledCaps, ...customCaps]).size;

  const filteredSets = React.useMemo(() => {
    const q = setSearchQ.toLowerCase().trim();
    if (!q) return PERMISSION_SETS_DATA;
    return PERMISSION_SETS_DATA.filter((ps) => ps.name.toLowerCase().includes(q) || ps.description.toLowerCase().includes(q) || ps.modules.join(' ').toLowerCase().includes(q));
  }, [setSearchQ]);

  return (
    <InlineSheet
      title="Create Role"
      subtitle="Define a role by combining permission sets and individual capabilities."
      onClose={onClose}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="accent" disabled={!name.trim()}>Create Role</Button></>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Name" required hint="Users will see this name when assigned to this role.">
          <Input placeholder="e.g. Billing Reviewer" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Description" hint="A short summary helps other admins understand who should get this role.">
          <Textarea placeholder="e.g. For finance team members who review and approve invoices." rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Segmented value={activeTab} onChange={setActiveTab} options={[{ value: 'sets', label: 'Permission Sets' }, { value: 'custom', label: 'Custom Capabilities' }]} />
          {totalCaps > 0 && <Badge variant="accent">{totalCaps} capabilities</Badge>}
        </div>

        {activeTab === 'sets' && (
          <div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginBottom: 10, lineHeight: 1.5 }}>
              Permission sets are pre-built bundles of capabilities. Select one or more to quickly grant access.
            </div>
            <SearchInput value={setSearchQ} onChange={setSetSearchQ} placeholder="Filter permission sets..." />
            <div style={{ marginTop: 10 }}>
              {filteredSets.map((ps) => (
                <label key={ps.id} className="x-perm-set-row">
                  <Checkbox checked={selectedSets.has(ps.id)} onChange={() => { const n = new Set(selectedSets); n.has(ps.id) ? n.delete(ps.id) : n.add(ps.id); setSelectedSets(n); }} />
                  <div className="x-perm-set-row__info">
                    <div className="x-perm-set-row__name">{ps.name} {ps.module && <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>· {ps.module}</span>}</div>
                    <div className="x-perm-set-row__desc">{ps.description}</div>
                  </div>
                  <div className="x-perm-set-row__meta">
                    <Badge variant={ps.type === 'System' ? 'info' : 'accent'}>{ps.type.toLowerCase()}</Badge>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>{ps.capabilities.length}</span>
                  </div>
                </label>
              ))}
              {filteredSets.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: 'var(--fg-3)', fontSize: 'var(--fs-sm)' }}>No permission sets match your filter.</div>}
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginBottom: 10, lineHeight: 1.5 }}>
              Need more granular control? Add individual capabilities here. Capabilities already granted by selected permission sets are shown as locked.
            </div>
            <SearchInput value={capSearchQ} onChange={setCapSearchQ} placeholder="Filter by name, action, or module..." />
            <div style={{ marginTop: 12 }}>
              <CapabilityTree selectedCaps={customCaps} onToggleCap={(k) => { const n = new Set(customCaps); n.has(k) ? n.delete(k) : n.add(k); setCustomCaps(n); }} conditions={conditions} onSetConditions={(k, c) => setConditions((p) => ({ ...p, [k]: c }))} searchQ={capSearchQ} disabledCaps={disabledCaps} />
            </div>
          </div>
        )}
      </div>
    </InlineSheet>
  );
};

// ---------- PermSetDetailSheet -----------------------------------------

const PermSetDetailSheet = ({ data, onClose }) => {
  const capSet = React.useMemo(() => new Set(data.capabilities), [data]);
  const [editing, setEditing] = React.useState(false);
  const isSystem = data.type === 'System';

  if (editing && !isSystem) {
    return <CreateSetSheet onClose={() => setEditing(false)} editData={data} />;
  }

  return (
    <InlineSheet title={data.name} subtitle={data.description} onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Badge variant={isSystem ? 'info' : 'accent'}>{data.type}</Badge>
        <code style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', background: 'var(--n-50)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>{data.slug}</code>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{data.capabilities.length} capabilities</span>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{data.modules.join(', ')}</span>
      </div>
      {isSystem && (
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', lineHeight: 1.5, padding: '8px 12px', background: 'var(--n-50)', borderRadius: 'var(--radius-sm)' }}>
          This is a system permission set managed by XTND. It cannot be edited or deleted. To customize, create a new permission set instead.
        </div>
      )}
      {!isSystem && (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="sm" icon="edit" onClick={() => setEditing(true)}>Edit</Button>
          <Button variant="danger" size="sm" icon="x">Delete</Button>
        </div>
      )}
      <CapabilityGrid capKeys={capSet} />
    </InlineSheet>
  );
};

// ---------- RoleDetailSheet --------------------------------------------

const RoleDetailSheet = ({ data, onClose }) => {
  const [tab, setTab] = React.useState('overview');

  const roleSets = React.useMemo(() =>
    (data.permissionSets || []).map((id) => PERMISSION_SETS_DATA.find((ps) => ps.id === id)).filter(Boolean), [data]);
  const allCapKeys = React.useMemo(() => getRoleTotalCaps(data), [data]);

  return (
    <InlineSheet title={data.name} subtitle={data.description} onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Badge variant={data.type === 'System' ? 'info' : 'accent'}>{data.type}</Badge>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{data.members} members</span>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{allCapKeys.size} capabilities</span>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{roleSets.length} permission sets</span>
        {data.type === 'System' && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>Managed by XTND</span>}
      </div>

      <div>
        <Segmented value={tab} onChange={setTab} options={[
          { value: 'overview', label: 'Permission Sets' },
          { value: 'caps', label: 'All Capabilities' },
        ]} />

        {tab === 'overview' && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {roleSets.length === 0 && (data.customCapabilities || []).length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--fg-3)', fontSize: 'var(--fs-sm)' }}>No permission sets or custom capabilities assigned to this role.</div>
            )}
            {roleSets.map((ps) => (
              <div key={ps.id} style={{ padding: '10px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 500, fontSize: 'var(--fs-sm)', color: 'var(--fg-1)' }}>{ps.name}</span>
                  <Badge variant={ps.type === 'System' ? 'info' : 'accent'}>{ps.type.toLowerCase()}</Badge>
                  <span style={{ marginLeft: 'auto', fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{ps.capabilities.length} capabilities</span>
                </div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginTop: 4 }}>{ps.description}</div>
              </div>
            ))}
            {(data.customCapabilities || []).length > 0 && (
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--fg-3)', marginBottom: 6 }}>
                  Custom capabilities
                </div>
                {data.customCapabilities.map((capKey) => {
                  const cap = lookupCapability(capKey);
                  return cap ? (
                    <div key={capKey} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '4px 0', fontSize: 'var(--fs-sm)' }}>
                      <code style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-accent)', flexShrink: 0 }}>{capKey}</code>
                      <span style={{ color: 'var(--fg-3)', flex: 1 }}>{cap.description}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'caps' && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginBottom: 10, lineHeight: 1.5 }}>
              Effective capabilities from all permission sets and custom capabilities combined.
            </div>
            <CapabilityGrid capKeys={allCapKeys} />
          </div>
        )}
      </div>
    </InlineSheet>
  );
};

// ---------- RolesPermissionsPage (combined page) -----------------------

const RolesPermissionsPage = ({ onOpenRole } = {}) => {
  const [tab, setTab] = React.useState('roles');
  const [q, setQ] = React.useState('');
  const [sheet, setSheet] = React.useState(null);

  const openSheet = (type, data) => setSheet({ type, data });
  const closeSheet = () => setSheet(null);

  React.useEffect(() => { setQ(''); closeSheet(); }, [tab]);

  const rolesFiltered = React.useMemo(() => {
    if (!q) return ROLES_DATA;
    const lq = q.toLowerCase();
    return ROLES_DATA.filter((r) => r.name.toLowerCase().includes(lq) || r.description.toLowerCase().includes(lq) || r.type.toLowerCase().includes(lq));
  }, [q]);

  const setsFiltered = React.useMemo(() => {
    if (!q) return PERMISSION_SETS_DATA;
    const lq = q.toLowerCase();
    return PERMISSION_SETS_DATA.filter((r) => r.name.toLowerCase().includes(lq) || r.description.toLowerCase().includes(lq) || r.modules.join(' ').toLowerCase().includes(lq));
  }, [q]);

  const rows = tab === 'roles' ? rolesFiltered : setsFiltered;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Page header */}
      <div style={{ padding: 'var(--sp-page-y) var(--sp-page-x)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-section)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="x-page__head">
          <div className="x-page__title-wrap">
            <div className="x-page__sub">
              Control what your team can see and do. XTND includes {ROLES_DATA.filter((r) => r.type === 'System').length} system roles and {PERMISSION_SETS_DATA.filter((ps) => ps.type === 'System').length} system permission sets. Create custom roles to tailor access for your organization.
            </div>
          </div>
          <div className="x-page__actions">
            <Button variant="accent" icon="plus" onClick={() => openSheet(tab === 'roles' ? 'create-role' : 'create-set')}>
              {tab === 'roles' ? 'New role' : 'New permission set'}
            </Button>
          </div>
        </div>
        <div className="x-tabs" style={{ padding: 0 }}>
          <button role="tab" aria-selected={tab === 'roles'} className="x-tab" onClick={() => setTab('roles')}>
            Roles<span className="x-tab__count">{ROLES_DATA.length}</span>
          </button>
          <button role="tab" aria-selected={tab === 'sets'} className="x-tab" onClick={() => setTab('sets')}>
            Permission Sets<span className="x-tab__count">{PERMISSION_SETS_DATA.length}</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: 'var(--sp-section) var(--sp-page-x)', flex: 1 }}>
        <div className="x-grid-wrap">
              <div className="x-grid-toolbar">
                <div style={{ position: 'relative', width: 260 }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-3)', pointerEvents: 'none' }}><Icon name="search" size={14} /></span>
                  <input className="x-input" style={{ paddingLeft: 32, height: 30 }} placeholder={tab === 'roles' ? 'Search roles...' : 'Search permission sets...'} value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
                <div className="x-grid-toolbar__spacer" />
                <span className="x-grid-toolbar__count">{rows.length} {tab === 'roles' ? 'roles' : 'permission sets'}</span>
              </div>

              <table className="x-grid">
                <thead>
                  {tab === 'roles' ? (
                    <tr>
                      <th>Role</th>
                      <th style={{ width: 90 }}>Type</th>
                      <th style={{ width: 80, textAlign: 'right' }}>Members</th>
                      <th style={{ width: 110, textAlign: 'right' }}>Capabilities</th>
                      <th style={{ width: 130 }}>Updated</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Permission Set</th>
                      <th style={{ width: 90 }}>Type</th>
                      <th style={{ width: 130 }}>Modules</th>
                      <th style={{ width: 110, textAlign: 'right' }}>Capabilities</th>
                      <th style={{ width: 130 }}>Updated</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.id}
                      style={{ cursor: 'pointer' }}
                      className={sheet?.data?.id === r.id ? 'is-selected' : undefined}
                      onClick={() => tab === 'roles' && onOpenRole ? onOpenRole(r) : openSheet('set-detail', r)}
                    >
                      <td>
                        <div>
                          <a className="x-link" style={{ fontWeight: 500, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); tab === 'roles' && onOpenRole ? onOpenRole(r) : openSheet('set-detail', r); }}>{r.name}</a>
                          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginTop: 2, maxWidth: 340, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description}</div>
                        </div>
                      </td>
                      <td><Badge variant={r.type === 'System' ? 'info' : 'accent'}>{r.type}</Badge></td>
                      {tab === 'roles' ? (
                        <>
                          <td style={{ textAlign: 'right' }}><span className="x-num">{r.members}</span></td>
                          <td style={{ textAlign: 'right' }}><span className="x-num">{getRoleTotalCaps(r).size}</span></td>
                        </>
                      ) : (
                        <>
                          <td><span style={{ color: 'var(--fg-3)' }}>{r.modules.join(', ')}</span></td>
                          <td style={{ textAlign: 'right' }}><span className="x-num">{r.capabilities.length}</span></td>
                        </>
                      )}
                      <td><span style={{ color: 'var(--fg-3)' }}>{fmtDate(r.updatedAt)}</span></td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--fg-3)' }}>
                      {q ? `No ${tab === 'roles' ? 'roles' : 'permission sets'} match your search.` : `No custom ${tab === 'roles' ? 'roles' : 'permission sets'} yet.`}
                    </td></tr>
                  )}
                </tbody>
              </table>
        </div>
      </div>

      {/* Sheets — fixed overlay with scrim */}
      {sheet?.type === 'set-detail' && <PermSetDetailSheet data={sheet.data} onClose={closeSheet} />}
      {sheet?.type === 'create-role' && <CreateRoleSheet onClose={closeSheet} />}
      {sheet?.type === 'create-set' && <CreateSetSheet onClose={closeSheet} />}
    </div>
  );
};

// ---------- Exports ----------------------------------------------------

Object.assign(window, {
  CAPABILITY_CATALOG,
  RBAC_CONDITIONS,
  PERMISSION_SETS_DATA,
  PERM_ROLES_DATA: ROLES_DATA,
  getRoleTotalCaps,
  RolesPermissionsPage,
  CapabilityTree,
  CapabilityGrid,
  ConditionsPopover,
  InlineSheet,
  toSlug,
  lookupCapability,
});
