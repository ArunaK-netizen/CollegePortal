'use client'

import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api/client'

function fetchAssignments() {
  return apiClient.get('/assignments').then(res => res.data)
}

export default function AssignmentsPage() {
  const { data: assignments = [], isLoading, error } = useQuery('assignments', fetchAssignments)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Assignments</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-error-600">Failed to load assignments.</p>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Title</th>
            <th className="px-2 py-1 border">Subject</th>
            <th className="px-2 py-1 border">Deadline</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a: any) => (
            <tr key={a.id}>
              <td className="border px-2 py-1">{a.id}</td>
              <td className="border px-2 py-1">{a.title}</td>
              <td className="border px-2 py-1">{a.subject?.name}</td>
              <td className="border px-2 py-1">{a.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
