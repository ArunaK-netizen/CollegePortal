'use client'

import { useAuth } from '@/lib/context/auth-context'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'
import { FacultyDashboard } from '@/components/dashboard/faculty-dashboard'
import { StudentDashboard } from '@/components/dashboard/student-dashboard'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!user) {
    return null // This will be handled by the auth context redirect
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />
    case 'faculty':
      return <FacultyDashboard />
    case 'student':
      return <StudentDashboard />
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Invalid Role</h1>
            <p className="mt-2 text-gray-600">Your account role is not recognized.</p>
          </div>
        </div>
      )
  }
}