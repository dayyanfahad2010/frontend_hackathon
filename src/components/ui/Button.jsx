import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-primary-100 disabled:text-primary-400',
  secondary: 'bg-white text-ink border border-line hover:bg-gray-50 active:bg-gray-100 disabled:text-slate-light',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 disabled:bg-danger-50 disabled:text-danger-400',
  ghost: 'bg-transparent text-slate hover:bg-gray-100 disabled:text-slate-light',
  outline: 'bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50 disabled:border-line disabled:text-slate-light',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-5 py-3 gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
}
