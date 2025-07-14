import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '@/lib'
import LoadingSplash from './LoadingSplash'

export const ProtectedRoute = () => {
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    api
      .get('/auth/me')
      .then(() => {
        setTimeout(() => {
          console.log('authorized')
          setAuthorized(true)
        }, 300)
      })
      .catch(() => {
        console.log('unauthorized')
        setAuthorized(false)
      })
  }, [])

  if (authorized === null) return <LoadingSplash message="Carregando..." />
  if (!authorized) return <Navigate to="/" />

  return <Outlet />
}
