'use client'

import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api/client'

function fetchCourses() {
  return apiClient.get('/courses').then(res => res.data)
}

export default function CoursesPage() {
  const { data: courses = [], isLoading, error } = useQuery('courses', fetchCourses)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Courses</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-error-600">Failed to load courses.</p>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Name</th>
            <th className="px-2 py-1 border">Department</th>
            <th className="px-2 py-1 border">Semester</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c: any) => (
            <tr key={c.id}>
              <td className="border px-2 py-1">{c.id}</td>
              <td className="border px-2 py-1">{c.name}</td>
              <td className="border px-2 py-1">{c.department?.name}</td>
              <td className="border px-2 py-1">{c.semester}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
