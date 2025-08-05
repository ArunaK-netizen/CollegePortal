'use client'

import { Card } from '@/components/ui/card'
import { BookOpen, Users, FileText, Calendar } from 'lucide-react'

export function FacultyDashboard() {
  const stats = [
    {
      name: 'My Subjects',
      value: 3,
      icon: BookOpen,
      color: 'bg-primary-500',
    },
    {
      name: 'Students',
      value: 45,
      icon: Users,
      color: 'bg-secondary-500',
    },
    {
      name: 'Assignments',
      value: 8,
      icon: FileText,
      color: 'bg-accent-500',
    },
    {
      name: 'Classes Today',
      value: 2,
      icon: Calendar,
      color: 'bg-success-500',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h2>
        <p className="text-gray-600">Manage your courses, students, and assignments</p>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Data Structures</p>
                <p className="text-xs text-gray-500">Room 101 • 9:00 AM - 10:30 AM</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-success-100 text-success-800 rounded-full">
                Upcoming
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Algorithms</p>
                <p className="text-xs text-gray-500">Room 203 • 2:00 PM - 3:30 PM</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-warning-100 text-warning-800 rounded-full">
                Later
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-2 rounded-full">
                <FileText className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New assignment submitted
                </p>
                <p className="text-xs text-gray-500">John Doe • 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-secondary-100 p-2 rounded-full">
                <Users className="h-4 w-4 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Attendance marked for CS101
                </p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}