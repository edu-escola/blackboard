import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LoadingSplash from '@/components/LoadingSplash'
import { api } from '@/lib'

interface School {
  id: string
  name: string
}

function saveToken(newToken: string) {
  localStorage.setItem('token', newToken)
}

function getRolesFromToken(token: string): string[] {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.roles || []
  } catch {
    return []
  }
}

const SchoolSelection = () => {
  const navigate = useNavigate()
  const [selectedSchool, setSelectedSchool] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const schools: School[] = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('schools') || '[]')
    } catch {
      return []
    }
  })()

  const handleContinue = async () => {
    if (!selectedSchool) return
    setIsLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/school/verify', { schoolId: selectedSchool })
      // Não salvar o token no localStorage, apenas redirecionar
      const { user } = response.data
      const { roles } = user
      setTimeout(() => {
        if (roles.includes('admin') && roles.includes('teacher')) {
          window.location.href = '/dashboard-selection'
        } else if (roles.includes('admin')) {
          window.location.href = '/admin/dashboard'
        } else if (roles.includes('teacher')) {
          window.location.href = '/professor/dashboard'
        } else {
          window.location.href = '/'
        }
      }, 1000)
    } catch (err: any) {
      setError('Erro ao selecionar escola. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingSplash message="Entrando..." />

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white">
        <CardHeader className="text-center pb-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Selecione a Escola
          </h1>
          <p className="text-sm text-gray-600">
            Você possui acesso a mais de uma escola. Selecione a escola desejada para continuar.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="school-select" className="block text-sm font-medium text-gray-700 mb-2">
              Escolas disponíveis
            </label>
            <select
              id="school-select"
              value={selectedSchool}
              onChange={e => setSelectedSchool(e.target.value)}
              className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="">Selecione uma escola</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>
          {error && (
            <div className="text-center">
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            </div>
          )}
          <Button
            onClick={handleContinue}
            disabled={!selectedSchool || isLoading}
            className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
          >
            Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default SchoolSelection 