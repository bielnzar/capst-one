import { cn } from './cn'

export default function Section({ title, subtitle, className, children }) {
  return (
    <section className={cn('mt-6', className)}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <p className="text-xs pixel-title text-slate-200">{title}</p>}
          {subtitle && <p className="mt-1 text-sm text-slate-300">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  )
}

