import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${
          variant === 'primary' ? 'bg-primary-600 text-white hover:bg-primary-700' : ''
        } ${
          variant === 'secondary' ? 'bg-gray-200 text-gray-900 hover:bg-gray-300' : ''
        } ${
          variant === 'outline' ? 'border border-gray-300 bg-transparent hover:bg-gray-50' : ''
        } ${
          size === 'sm' ? 'h-8 px-3 text-sm' : ''
        } ${
          size === 'md' ? 'h-10 px-4 py-2' : ''
        } ${
          size === 'lg' ? 'h-11 px-8' : ''
        } ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export default Button
