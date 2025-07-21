import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '@/lib'
import LoadingSplash from './LoadingSplash'

type Role = 'admin' | 'teacher' | 'both'

interface ProtectedRouteProps {
  role: Role
}

export const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  const [status, setStatus] = useState<
    | 'pending'
    | 'authorized'
    | 'unauthorized-admin'
    | 'unauthorized-teacher'
    | 'unauthorized'
  >('pending')

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => {
        const { roles, name, id } = res.data

        if (name) {
          localStorage.setItem('name', name)
        }

        localStorage.setItem('userId', id)

        if (role === 'admin' && roles.includes('admin')) {
          setStatus('authorized')
        } else if (role === 'teacher' && roles.includes('teacher')) {
          setStatus('authorized')
        } else if (
          role === 'both' &&
          roles.includes('admin') &&
          roles.includes('teacher')
        ) {
          setStatus('authorized')
        } else if (roles.includes('teacher')) {
          setStatus('unauthorized-teacher')
        } else if (roles.includes('admin')) {
          setStatus('unauthorized-admin')
        } else {
          setStatus('unauthorized')
        }
      })
      .catch(() => setStatus('unauthorized'))
  }, [role])

  if (status === 'pending') return <LoadingSplash message="Carregando..." />

  if (status === 'unauthorized-teacher')
    return <Navigate to="/professor/dashboard" />
  if (status === 'unauthorized-admin') return <Navigate to="/admin/dashboard" />
  if (status === 'unauthorized') return <Navigate to="/" />

  return <Outlet />
}
