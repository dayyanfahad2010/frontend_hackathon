export default function TextArea({
  label,
  error,
  hint,
  required = false,
  rows = 4,
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
      <textarea
        rows={rows}
        className={`w-full rounded-lg border text-sm px-3.5 py-2.5 placeholder:text-slate-light text-ink resize-none
          focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-colors
          ${error ? 'border-danger-400' : 'border-line'} ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
      {!error && hint && <p className="text-xs text-slate-light mt-1">{hint}</p>}
    </div>
  );
}
