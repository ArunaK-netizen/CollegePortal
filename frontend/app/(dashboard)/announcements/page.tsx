'use client'

import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api/client'

function fetchAnnouncements() {
  return apiClient.get('/announcements').then(res => res.data)
}

export default function AnnouncementsPage() {
  const { data: announcements = [], isLoading, error } = useQuery('announcements', fetchAnnouncements)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Announcements</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-error-600">Failed to load announcements.</p>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Title</th>
            <th className="px-2 py-1 border">Content</th>
            <th className="px-2 py-1 border">User</th>
            <th className="px-2 py-1 border">Course</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((a: any) => (
            <tr key={a.id}>
              <td className="border px-2 py-1">{a.id}</td>
              <td className="border px-2 py-1">{a.title}</td>
              <td className="border px-2 py-1">{a.content}</td>
              <td className="border px-2 py-1">{a.user?.name}</td>
              <td className="border px-2 py-1">{a.course?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
