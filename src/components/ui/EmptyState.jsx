import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4">
      <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-primary-500" />
      </div>
      <h4 className="font-display font-semibold text-ink mb-1">{title}</h4>
      {description && <p className="text-sm text-slate max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}
