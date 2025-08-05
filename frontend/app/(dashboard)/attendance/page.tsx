'use client'

import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api/client'

function fetchAttendance() {
  return apiClient.get('/attendance').then(res => res.data)
}

export default function AttendancePage() {
  const { data: attendance = [], isLoading, error } = useQuery('attendance', fetchAttendance)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Attendance</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-error-600">Failed to load attendance records.</p>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Student</th>
            <th className="px-2 py-1 border">Class</th>
            <th className="px-2 py-1 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a: any) => (
            <tr key={a.id}>
              <td className="border px-2 py-1">{a.id}</td>
              <td className="border px-2 py-1">{a.student?.user?.name}</td>
              <td className="border px-2 py-1">{a.class?.subject?.name}</td>
              <td className="border px-2 py-1">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
