'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/context/auth-context'
import { clsx } from 'clsx'
import {
  GraduationCap,
  Home,
  Users,
  BookOpen,
  Calendar,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Building,
  ClipboardList,
  Upload,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'faculty', 'student'] },
  { name: 'Users', href: '/users', icon: Users, roles: ['admin'] },
  { name: 'Students', href: '/students', icon: User, roles: ['admin', 'faculty'] },
  { name: 'Faculty', href: '/faculty', icon: Users, roles: ['admin'] },
  { name: 'Departments', href: '/departments', icon: Building, roles: ['admin'] },
  { name: 'Courses', href: '/courses', icon: BookOpen, roles: ['admin'] },
  { name: 'Subjects', href: '/subjects', icon: BookOpen, roles: ['admin', 'faculty'] },
  { name: 'Classes', href: '/classes', icon: Calendar, roles: ['admin', 'faculty'] },
  { name: 'Attendance', href: '/attendance', icon: ClipboardList, roles: ['admin', 'faculty', 'student'] },
  { name: 'Assignments', href: '/assignments', icon: FileText, roles: ['admin', 'faculty', 'student'] },
  { name: 'Study Materials', href: '/study-materials', icon: Upload, roles: ['admin', 'faculty', 'student'] },
  { name: 'Announcements', href: '/announcements', icon: Bell, roles: ['admin', 'faculty', 'student'] },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  )

  return (
    <div className={clsx(
      'bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">College Portal</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon
                className={clsx(
                  'flex-shrink-0 h-5 w-5',
                  isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500',
                  !collapsed && 'mr-3'
                )}
              />
              {!collapsed && item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && user && (
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-full">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}