'use client'

import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api/client'

function fetchUsers() {
  return apiClient.get('/users').then(res => res.data)
}

export default function UsersPage() {
  const { data: users = [], isLoading, error } = useQuery('users', fetchUsers)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-error-600">Failed to load users.</p>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Name</th>
            <th className="px-2 py-1 border">Email</th>
            <th className="px-2 py-1 border">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.id}</td>
              <td className="border px-2 py-1">{u.name}</td>
              <td className="border px-2 py-1">{u.email}</td>
              <td className="border px-2 py-1">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
