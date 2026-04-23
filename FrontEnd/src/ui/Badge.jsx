import { cn } from './cn'

export default function Badge({ className, color = 'gray', children, ...props }) {
  const colors = {
    gray: 'border-slate-500/50 text-slate-200 bg-slate-900/60',
    green: 'border-green-400/40 text-green-200 bg-green-950/40',
    blue: 'border-blue-400/40 text-blue-200 bg-blue-950/40',
    pink: 'border-pink-400/40 text-pink-200 bg-pink-950/40',
    yellow: 'border-yellow-400/40 text-yellow-200 bg-yellow-950/40',
    red: 'border-red-400/40 text-red-200 bg-red-950/40',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 text-[11px] leading-none border-2 rounded-none pixel-title',
        colors[color] ?? colors.gray,
        className
      )}
      {...props}
    >
      <span className="w-2 h-2 bg-current opacity-80" />
      <span className="font-normal">{children}</span>
    </span>
  )
}