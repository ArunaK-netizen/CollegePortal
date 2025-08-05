import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx('label', className)}
        {...props}
      />
    )
  }
)

Label.displayName = 'Label'