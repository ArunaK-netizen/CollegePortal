import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'input-field',
          error && 'border-error-300 focus:border-error-500 focus:ring-error-500',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'