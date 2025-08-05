'use client'

import { Card } from '@/components/ui/card'
import { Users, GraduationCap, BookOpen, Calendar } from 'lucide-react'
import { useQuery } from 'react-query'
import { userApi } from '@/lib/api/users'
import { departmentApi } from '@/lib/api/departments'
import { courseApi } from '@/lib/api/courses'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function AdminDashboard() {
  const { data: users = [], isLoading: usersLoading } = useQuery('users', userApi.getAll)
  const { data: departments = [], isLoading: deptsLoading } = useQuery('departments', departmentApi.getAll)
  const { data: courses = [], isLoading: coursesLoading } = useQuery('courses', courseApi.getAll)

  const isLoading = usersLoading || deptsLoading || coursesLoading

  const stats = [
    {
      name: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'bg-primary-500',
    },
    {
      name: 'Students',
      value: users.filter((u: any) => u.role === 'student').length,
      icon: GraduationCap,
      color: 'bg-secondary-500',
    },
    {
      name: 'Faculty',
      value: users.filter((u: any) => u.role === 'faculty').length,
      icon: Users,
      color: 'bg-accent-500',
    },
    {
      name: 'Departments',
      value: departments.length,
      icon: BookOpen,
      color: 'bg-success-500',
    },
    {
      name: 'Courses',
      value: courses.length,
      icon: Calendar,
      color: 'bg-warning-500',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600">Overview of the college management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
          <div className="space-y-4">
            {users.slice(0, 5).map((user: any) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                  user.role === 'admin' ? 'bg-error-100 text-error-800' :
                  user.role === 'faculty' ? 'bg-primary-100 text-primary-800' :
                  'bg-secondary-100 text-secondary-800'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Departments</h3>
          <div className="space-y-4">
            {departments.slice(0, 5).map((dept: any) => (
              <div key={dept.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(dept.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}