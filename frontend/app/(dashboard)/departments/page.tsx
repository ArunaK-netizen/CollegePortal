'use client'

import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api/client'

function fetchDepartments() {
  return apiClient.get('/departments').then(res => res.data)
}

export default function DepartmentsPage() {
  const { data: departments = [], isLoading, error } = useQuery('departments', fetchDepartments)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Departments</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-error-600">Failed to load departments.</p>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Name</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d: any) => (
            <tr key={d.id}>
              <td className="border px-2 py-1">{d.id}</td>
              <td className="border px-2 py-1">{d.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
