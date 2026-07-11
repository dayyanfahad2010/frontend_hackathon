// Status/priority pill. Shaped like a ticket-stub (notched left edge) —
// the small signature detail tying badges back to the "issue ticket" concept.

const ASSET_STATUS_STYLES = {
  Operational: 'bg-success-50 text-success-600',
  'Issue Reported': 'bg-amber-50 text-amber-600',
  'Under Inspection': 'bg-info-50 text-info-600',
  'Under Maintenance': 'bg-info-50 text-info-600',
  'Out of Service': 'bg-danger-50 text-danger-600',
  Retired: 'bg-gray-100 text-slate',
};

const ISSUE_STATUS_STYLES = {
  Reported: 'bg-amber-50 text-amber-600',
  Assigned: 'bg-info-50 text-info-600',
  'Inspection Started': 'bg-info-50 text-info-600',
  'Maintenance In Progress': 'bg-primary-50 text-primary-600',
  'Waiting for Parts': 'bg-amber-50 text-amber-600',
  Resolved: 'bg-success-50 text-success-600',
  Closed: 'bg-gray-100 text-slate',
  Reopened: 'bg-danger-50 text-danger-600',
};

const PRIORITY_STYLES = {
  Low: 'bg-gray-100 text-slate',
  Medium: 'bg-amber-50 text-amber-600',
  High: 'bg-danger-50 text-danger-600',
  Critical: 'bg-danger-500 text-white',
};

export default function Badge({ children, type = 'default', className = '' }) {
  const style =
    ASSET_STATUS_STYLES[children] ||
    ISSUE_STATUS_STYLES[children] ||
    PRIORITY_STYLES[children] ||
    'bg-primary-50 text-primary-600';

  const isCritical = children === 'Critical';

  return (
    <span
      className={`relative inline-flex items-center gap-1 pl-2.5 pr-2 py-0.5 text-xs font-medium rounded-r-md rounded-l-sm
        ${style} ${isCritical ? 'ring-1 ring-danger-500 animate-pulse' : ''} ${className}`}
    >
      <span className={`w-1 h-1 rounded-full ${isCritical ? 'bg-white' : 'bg-current opacity-60'}`} />
      {children}
    </span>
  );
}
