import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import api from '@/lib/api'

interface LogoutButtonProps {
  variant?: 'default' | 'outline'
  className?: string
  children?: React.ReactNode
}

export const LogoutButton = ({
  variant = 'outline',
  className = '',
  children = 'Sair',
}: LogoutButtonProps) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      localStorage.clear()
      navigate('/')
    } catch (error) {
      console.error(error)
      navigate('/')
    }
  }

  return (
    <Button onClick={handleLogout} variant={variant} className={className}>
      <LogOut className="h-4 w-4" />
      {children}
    </Button>
  )
}
