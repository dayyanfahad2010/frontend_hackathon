import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mb-5">
        <SearchX className="w-6 h-6 text-primary-500" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-2">Page not found</h1>
      <p className="text-sm text-slate max-w-sm mb-6">
        This asset code or page doesn't exist, or the link may be broken. Check the QR code and try again.
      </p>
      <Link to="/"><Button>Back to home</Button></Link>
    </div>
  );
}
