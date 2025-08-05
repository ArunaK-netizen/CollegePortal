'use client'

import { useQuery, useMutation, useQueryClient } from 'react-query'
import { studentCourseApi } from '@/lib/api/student_courses'
import { courseApi } from '@/lib/api/courses'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export default function CourseRegistrationPage() {
  const queryClient = useQueryClient()
  const { data: status, isLoading: statusLoading } = useQuery('registrationStatus', studentCourseApi.getRegistrationStatus)
  const { data: availableCourses = [], isLoading: coursesLoading } = useQuery('availableCourses', studentCourseApi.getAvailableCourses, {
    enabled: status?.is_open,
  })

  const mutation = useMutation(studentCourseApi.register, {
    onSuccess: () => {
      toast.success('Course registered successfully!')
      queryClient.invalidateQueries('availableCourses')
      queryClient.invalidateQueries('myCourses')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Registration failed')
    },
  })

  if (statusLoading) return <div>Loading registration status...</div>
  if (!status?.is_open) return <div className="text-warning-600 font-semibold">Course registration is currently closed.</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Course Registration</h2>
      <p className="mb-6 text-gray-600">Select courses to register for the current semester.</p>
      {coursesLoading ? (
        <div>Loading available courses...</div>
      ) : availableCourses.length === 0 ? (
        <div className="text-success-600">You have registered for all available courses.</div>
      ) : (
        <table className="min-w-full border mb-8">
          <thead>
            <tr>
              <th className="px-2 py-1 border">Course Name</th>
              <th className="px-2 py-1 border">Department</th>
              <th className="px-2 py-1 border">Semester</th>
              <th className="px-2 py-1 border"></th>
            </tr>
          </thead>
          <tbody>
            {availableCourses.map((course: any) => (
              <tr key={course.id}>
                <td className="border px-2 py-1">{course.name}</td>
                <td className="border px-2 py-1">{course.department?.name}</td>
                <td className="border px-2 py-1">{course.semester}</td>
                <td className="border px-2 py-1">
                  <Button
                    size="sm"
                    disabled={mutation.isLoading}
                    onClick={() => mutation.mutate({ course_id: course.id, faculty_id: course.faculty_id })}
                  >
                    Register
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
