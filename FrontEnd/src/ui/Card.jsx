import { cn } from './cn'

export default function Card({ className, children, variant = 'pixel', ...props }) {
  const variants = {
    pixel: 'pixel-surface rounded-none',
    soft: 'pixel-surface-soft rounded-2xl backdrop-blur',
  }
  return (
    <div className={cn(variants[variant] ?? variants.pixel, 'p-5', className)} {...props}>
      {children}
    </div>
  )
}

