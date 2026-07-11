export default function Card({ children, className = '', padding = 'p-5', hover = false }) {
  return (
    <div
      className={`bg-white border border-line rounded-xl2 shadow-card ${padding}
        ${hover ? 'transition-shadow hover:shadow-popover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-display font-semibold text-ink text-base">{title}</h3>
        {subtitle && <p className="text-sm text-slate mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
