'use client'

import { useQuery } from 'react-query'
import { apiClient } from '@/lib/api/client'

function fetchStudyMaterials() {
  return apiClient.get('/study-materials').then(res => res.data)
}

export default function StudyMaterialsPage() {
  const { data: materials = [], isLoading, error } = useQuery('study-materials', fetchStudyMaterials)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Study Materials</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-error-600">Failed to load study materials.</p>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">ID</th>
            <th className="px-2 py-1 border">Title</th>
            <th className="px-2 py-1 border">Subject</th>
            <th className="px-2 py-1 border">File</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m: any) => (
            <tr key={m.id}>
              <td className="border px-2 py-1">{m.id}</td>
              <td className="border px-2 py-1">{m.title}</td>
              <td className="border px-2 py-1">{m.subject?.name}</td>
              <td className="border px-2 py-1">
                <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
