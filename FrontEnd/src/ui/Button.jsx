import { cn } from './cn'

export default function Button({
  className,
  children,
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const variants = {
    primary:
      'bg-emerald-500 text-black border-2 border-emerald-200 hover:bg-emerald-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[6px_6px_0_rgba(0,0,0,0.45)]',
    outline:
      'bg-transparent text-slate-100 border-2 border-slate-500/70 hover:bg-white/5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[6px_6px_0_rgba(0,0,0,0.35)]',
    ghost: 'bg-transparent text-slate-200 hover:bg-white/5 border-2 border-transparent',
    danger:
      'bg-red-500 text-black border-2 border-red-200 hover:bg-red-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[6px_6px_0_rgba(0,0,0,0.45)]',
  }

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
  }

  return (
    <button
      className={cn(
        'rounded-none pixel-title tracking-wide transition-all disabled:opacity-50 disabled:pointer-events-none',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

