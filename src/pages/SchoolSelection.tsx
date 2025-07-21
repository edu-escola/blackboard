import { useState } from 'react'
import { GraduationCap, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LoadingSplash from '@/components/LoadingSplash'
import { api } from '@/lib'

interface School {
  id: string
  name: string
}

const SchoolSelection = () => {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Selecione a Escola
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Você possui acesso a mais de uma escola. Escolha qual deseja acessar:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full max-w-2xl">
          {schools.map((school) => (
            <Card
              key={school.id}
              className={`border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedSchool === school.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedSchool(school.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {school.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <span className="text-gray-600 text-sm">Clique para selecionar</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {error && (
          <div className="text-center mb-4">
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 inline-block">
              {error}
            </p>
          </div>
        )}

        <Button
          onClick={handleContinue}
          disabled={!selectedSchool || isLoading}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed px-8 py-3 text-base font-medium"
        >
          <span>Continuar</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </main>
      <footer className="mt-8 text-center mb-4">
        <p className="text-xs text-gray-500">
          © 2025 EduEscola. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}

export default SchoolSelection 