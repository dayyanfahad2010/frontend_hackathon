export default function Input({
  label,
  error,
  hint,
  icon: Icon,
  className = '',
  containerClassName = '',
  required = false,
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
        {Icon && <Icon className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />}
        <input
          className={`w-full rounded-lg border text-sm px-3.5 py-2.5 placeholder:text-slate-light text-ink
            focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-colors
            ${Icon ? 'pl-9' : ''}
            ${error ? 'border-danger-400' : 'border-line'} ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
      {!error && hint && <p className="text-xs text-slate-light mt-1">{hint}</p>}
    </div>
  );
}
