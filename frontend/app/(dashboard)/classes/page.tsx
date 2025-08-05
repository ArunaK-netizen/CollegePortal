'use client'

import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api/client'

function fetchClasses() {
  return apiClient.get('/classes').then(res => res.data)
}

export default function ClassesPage() {
  const { data: classes = [], isLoading, error } = useQuery('classes', fetchClasses)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Classes</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-error-600">Failed to load classes.</p>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Subject</th>
            <th className="px-2 py-1 border">Date</th>
            <th className="px-2 py-1 border">Start Time</th>
            <th className="px-2 py-1 border">End Time</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c: any) => (
            <tr key={c.id}>
              <td className="border px-2 py-1">{c.id}</td>
              <td className="border px-2 py-1">{c.subject?.name}</td>
              <td className="border px-2 py-1">{c.date}</td>
              <td className="border px-2 py-1">{c.start_time}</td>
              <td className="border px-2 py-1">{c.end_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
