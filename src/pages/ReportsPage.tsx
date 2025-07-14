import { useState } from 'react'
import {
  Printer,
  Download,
  Filter,
  Search,
  Calendar,
  Users,
  BookOpen,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/shared'

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('')

  // Mock data
  const classes = [
    { id: '1', name: '1º Ano A' },
    { id: '2', name: '2º Ano B' },
    { id: '3', name: '3º Ano A' },
    { id: '4', name: '1º Ano C' },
  ]

  const periods = [
    { id: '1', name: '1º Bimestre' },
    { id: '2', name: '2º Bimestre' },
    { id: '3', name: '3º Bimestre' },
    { id: '4', name: '4º Bimestre' },
  ]

  const reportTypes = [
    {
      id: 'attendance',
      name: 'Relatório de Presença',
      description: 'Lista de presença dos alunos por turma e período',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'grades',
      name: 'Boletim de Notas',
      description: 'Notas dos alunos organizadas por disciplina',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'combined',
      name: 'Relatório Completo',
      description: 'Presença e notas em um único documento',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  const handleGenerateReport = () => {
    // Implementar lógica de geração de relatório
    console.log('Gerando relatório:', {
      report: selectedReport,
      class: selectedClass,
      period: selectedPeriod,
    })
  }

  const handlePrintReport = () => {
    // Implementar lógica de impressão
    console.log('Imprimindo relatório')
  }

  const handleDownloadReport = () => {
    // Implementar lógica de download
    console.log('Baixando relatório')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Relatórios e Impressões
          </h1>
          <p className="text-gray-600">
            Gere relatórios de presença e notas dos alunos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filtros */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Tipo de Relatório</Label>
                <Select
                  value={selectedReport}
                  onValueChange={setSelectedReport}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de relatório" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Turma</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleGenerateReport}
                  className="w-full"
                  disabled={
                    !selectedReport || !selectedClass || !selectedPeriod
                  }
                >
                  <Search className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tipos de Relatório */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Tipos de Relatório Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reportTypes.map((type) => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedReport === type.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedReport(type.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${type.bgColor}`}>
                            <type.icon className={`h-5 w-5 ${type.color}`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {type.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Ações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handlePrintReport}
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                    disabled={!selectedReport}
                  >
                    <Printer className="h-4 w-4" />
                    <span>Imprimir Relatório</span>
                  </Button>
                  <Button
                    onClick={handleDownloadReport}
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                    disabled={!selectedReport}
                  >
                    <Download className="h-4 w-4" />
                    <span>Baixar PDF</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-600">Alunos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">89%</div>
                    <div className="text-sm text-gray-600">
                      Taxa de Presença
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      7.8
                    </div>
                    <div className="text-sm text-gray-600">Média Geral</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ReportsPage
