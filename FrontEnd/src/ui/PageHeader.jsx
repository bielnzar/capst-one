import { cn } from './cn'

export default function PageHeader({ badge, title, subtitle, actions, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-6 flex-wrap', className)}>
      <div>
        {badge}
        <h1 className="mt-4 text-xl sm:text-2xl pixel-title text-white">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-slate-300 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}

