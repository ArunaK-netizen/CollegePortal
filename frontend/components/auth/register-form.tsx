'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { departmentApi } from '@/lib/api/departments'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 'student' | 'faculty'
  rollNumber?: string
  departmentId?: number
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [autoDepartmentId, setAutoDepartmentId] = useState<number | undefined>(undefined)
  const router = useRouter()

  const { data: departments = [] } = useQuery(
    'departments',
    departmentApi.getAll
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const selectedRole = watch('role')
  const rollNumber = watch('rollNumber')
  const password = watch('password')

  useEffect(() => {
    if (selectedRole === 'student' && rollNumber && rollNumber.length >= 5) {
      const code = rollNumber.substring(2, 5).toUpperCase()
      const codeMap: Record<string, string> = {
        BCE: "BTECH COMPUTER SCIENCE",
        BEE: "BTECH ELECTRICAL ENGINEERING",
        BME: "BTECH MECHANICAL ENGINEERING",
        BAI: "BTECH AI AND ML",
        BEC: "BTECH ELECTRONICS & COMMUNICATION",
        BCI: "BTECH CIVIL ENGINEERING",
        BIT: "BTECH INFORMATION TECHNOLOGY",
        // Add all your department mappings here
      }
      const dept = departments.find((d: any) => d.name.toUpperCase() === codeMap[code])
      setAutoDepartmentId(dept?.id)
    } else {
      setAutoDepartmentId(undefined)
    }
  }, [rollNumber, departments, selectedRole])

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const registerData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        ...(data.role === 'student' && { roll_number: data.rollNumber }),
        ...(data.role === 'faculty' && data.departmentId && { department_id: Number(data.departmentId) }),
        ...(data.role === 'student' && autoDepartmentId && { department_id: autoDepartmentId }),
      }
      await authApi.register(registerData)
      toast.success('Registration successful! Please log in.')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          className={errors.name ? 'border-error-300' : ''}
        />
        {errors.name && <p className="error-text">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          className={errors.email ? 'border-error-300' : ''}
        />
        {errors.email && <p className="error-text">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          {...register('role', { required: 'Role is required' })}
          className={`input-field ${errors.role ? 'border-error-300' : ''}`}
        >
          <option value="">Select role</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        {errors.role && <p className="error-text">{errors.role.message}</p>}
      </div>

      {selectedRole === 'student' && (
        <div>
          <Label htmlFor="rollNumber">Roll Number</Label>
          <Input
            id="rollNumber"
            type="text"
            {...register('rollNumber', {
              required: 'Roll number is required',
            })}
            className={errors.rollNumber ? 'border-error-300' : ''}
          />
          {errors.rollNumber && <p className="error-text">{errors.rollNumber.message}</p>}
        </div>
      )}

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            className={errors.password ? 'border-error-300 pr-10' : 'pr-10'}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
          </button>
        </div>
        {errors.password && <p className="error-text">{errors.password.message}</p>}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            className={errors.confirmPassword ? 'border-error-300 pr-10' : 'pr-10'}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}
