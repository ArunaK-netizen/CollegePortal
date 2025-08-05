'use client'

import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api/client'

function fetchFaculty() {
  return apiClient.get('/faculty').then(res => res.data)
}

export default function FacultyPage() {
  const { data: faculty = [], isLoading, error } = useQuery('faculty', fetchFaculty)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Faculty</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-error-600">Failed to load faculty.</p>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Name</th>
            <th className="px-2 py-1 border">Department</th>
          </tr>
        </thead>
        <tbody>
          {faculty.map((f: any) => (
            <tr key={f.id}>
              <td className="border px-2 py-1">{f.id}</td>
              <td className="border px-2 py-1">{f.user?.name}</td>
              <td className="border px-2 py-1">{f.department?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
