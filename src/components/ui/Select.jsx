import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  required = false,
  className = '',
  containerClassName = '',
  ...rest
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-ink mb-1.5">
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full appearance-none rounded-lg border text-sm px-3.5 py-2.5 pr-9 text-ink bg-white
            focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-colors
            ${error ? 'border-danger-400' : 'border-line'} ${className}`}
          {...rest}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-light absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
    </div>
  );
}
