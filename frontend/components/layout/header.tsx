'use client'

import { useAuth } from '@/lib/context/auth-context'
import { Button } from '@/components/ui/button'
import { LogOut, User, Settings } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'

export function Header() {
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="bg-primary-100 p-2 rounded-full">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function getPageTitle() {
  if (typeof window === 'undefined') return 'Dashboard'
  
  const path = window.location.pathname
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/users': 'Users',
    '/students': 'Students',
    '/faculty': 'Faculty',
    '/departments': 'Departments',
    '/courses': 'Courses',
    '/subjects': 'Subjects',
    '/classes': 'Classes',
    '/attendance': 'Attendance',
    '/assignments': 'Assignments',
    '/study-materials': 'Study Materials',
    '/announcements': 'Announcements',
  }
  
  return titles[path] || 'Dashboard'
}