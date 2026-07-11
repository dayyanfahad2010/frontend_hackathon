import { Loader2 } from 'lucide-react';

export default function Loader({ label = 'Loading...', size = 'md', fullScreen = false }) {
  const dim = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

  const content = (
    <div className="flex flex-col items-center justify-center gap-2 text-slate">
      <Loader2 className={`${dim} animate-spin text-primary-500`} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="py-10 flex items-center justify-center">{content}</div>;
}
