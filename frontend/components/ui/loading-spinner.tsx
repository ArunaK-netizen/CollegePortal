import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'large'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
    large: 'h-16 w-16',
  }

  return (
    <div className={clsx('animate-spin rounded-full border-2 border-gray-300 border-t-primary-600', sizes[size], className)} />
  )
}