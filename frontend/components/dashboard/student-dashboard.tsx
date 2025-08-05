'use client'

import { Card } from '@/components/ui/card'
import { BookOpen, Calendar, FileText, TrendingUp } from 'lucide-react'
import { useQuery } from 'react-query'
import { courseApi } from '@/lib/api/courses'
import { attendanceApi } from '@/lib/api/attendance'

export function StudentDashboard() {
  const { data: courses = [] } = useQuery('myCourses', courseApi.getMyCourses)
  const { data: attendance = [] } = useQuery('myAttendance', attendanceApi.getMyAttendance)

  const stats = [
    {
      name: 'Enrolled Subjects',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-primary-500',
    },
    {
      name: 'Attendance',
      value: `${(attendance.filter(a => a.status === 'present').length / attendance.length) * 100}%`,
      icon: TrendingUp,
      color: 'bg-success-500',
    },
    {
      name: 'Assignments Due',
      value: 3,
      icon: FileText,
      color: 'bg-warning-500',
    },
    {
      name: 'Classes Today',
      value: 4,
      icon: Calendar,
      color: 'bg-secondary-500',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
        <p className="text-gray-600">Track your academic progress and assignments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assignments</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Database Project</p>
                <p className="text-xs text-gray-500">Database Management • Due: Dec 15</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-error-100 text-error-800 rounded-full">
                2 days left
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Algorithm Analysis</p>
                <p className="text-xs text-gray-500">Data Structures • Due: Dec 20</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-warning-100 text-warning-800 rounded-full">
                7 days left
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Web Development</p>
                <p className="text-xs text-gray-500">Frontend Development • Due: Dec 25</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-success-100 text-success-800 rounded-full">
                12 days left
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Data Structures</p>
                <p className="text-xs text-gray-500">Room 101 • 9:00 AM - 10:30 AM</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-success-100 text-success-800 rounded-full">
                Completed
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Database Management</p>
                <p className="text-xs text-gray-500">Room 205 • 11:00 AM - 12:30 PM</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                Current
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Web Development</p>
                <p className="text-xs text-gray-500">Lab 1 • 2:00 PM - 4:00 PM</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-warning-100 text-warning-800 rounded-full">
                Later
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}