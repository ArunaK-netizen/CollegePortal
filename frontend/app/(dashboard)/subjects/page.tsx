'use client'

import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api/client'

function fetchSubjects() {
  return apiClient.get('/subjects').then(res => res.data)
}

export default function SubjectsPage() {
  const { data: subjects = [], isLoading, error } = useQuery('subjects', fetchSubjects)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Subjects</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-error-600">Failed to load subjects.</p>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Name</th>
            <th className="px-2 py-1 border">Course</th>
            <th className="px-2 py-1 border">Faculty</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s: any) => (
            <tr key={s.id}>
              <td className="border px-2 py-1">{s.id}</td>
              <td className="border px-2 py-1">{s.name}</td>
              <td className="border px-2 py-1">{s.course?.name}</td>
              <td className="border px-2 py-1">{s.faculty?.user?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
