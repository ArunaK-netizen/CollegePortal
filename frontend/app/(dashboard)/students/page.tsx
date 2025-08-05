'use client'

import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api/client'

function fetchStudents() {
  return apiClient.get('/students').then(res => res.data)
}

export default function StudentsPage() {
  const { data: students = [], isLoading, error } = useQuery('students', fetchStudents)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-error-600">Failed to load students.</p>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Roll Number</th>
            <th className="px-2 py-1 border">Name</th>
            <th className="px-2 py-1 border">Department</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s: any) => (
            <tr key={s.id}>
              <td className="border px-2 py-1">{s.id}</td>
              <td className="border px-2 py-1">{s.roll_number}</td>
              <td className="border px-2 py-1">{s.user?.name}</td>
              <td className="border px-2 py-1">{s.department?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
