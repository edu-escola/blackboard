import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import AdminDashboard from './pages/AdminDashboard'
import ProfessorDashboard from './pages/ProfessorDashboard'
import ProfessorManagement from './pages/ProfessorManagement'
import StudentManagement from './pages/StudentManagement'
import ClassTimetableManagement from './pages/ClassTimetableManagement'
import AttendancePage from './pages/AttendancePage'
import EvaluationsPage from './pages/EvaluationsPage'
import LessonPlannerPage from './pages/LessonPlannerPage'
import ReportsPage from './pages/ReportsPage'
import ServerError from './pages/ServerError'
import NotFound from './pages/NotFound'
import AdministratorManagement from './pages/AdministratorManagement'
import DashboardSelection from './pages/DashboardSelection'
import { ProtectedRoute } from './components/ProtectedRoute'
import GradesManagement from './pages/GradesManagement'
import GradesClosingEdit from './pages/GradesClosingEdit'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route element={<ProtectedRoute role="both" />}>
            <Route
              path="/dashboard-selection"
              element={<DashboardSelection />}
            />
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/administrators"
              element={<AdministratorManagement />}
            />
            <Route path="/admin/professors" element={<ProfessorManagement />} />
            <Route path="/admin/students" element={<StudentManagement />} />
            <Route
              path="/admin/classes"
              element={<ClassTimetableManagement />}
            />
            <Route path="/admin/reports" element={<ReportsPage />} />
          </Route>

          <Route element={<ProtectedRoute role="teacher" />}>
            <Route path="/professor/attendance" element={<AttendancePage />} />
            <Route
              path="/professor/evaluations"
              element={<EvaluationsPage />}
            />
            <Route
              path="/professor/lesson-planner"
              element={<LessonPlannerPage />}
            />
            <Route
              path="/professor/dashboard"
              element={<ProfessorDashboard />}
            />
            <Route
              path="/professor/grades-closing"
              element={<GradesManagement/>}
            />
            <Route path="/professor/grades-closing/new" element={<GradesClosingEdit/>} />
          </Route>

          <Route path="/error" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
