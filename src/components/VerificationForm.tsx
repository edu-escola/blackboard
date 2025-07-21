import { useState, useEffect } from 'react'
import { GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import LoadingSplash from './LoadingSplash'
import { api } from '@/lib'

const RESEND_CODE_TIME = 60

interface VerificationFormProps {
  email: string
  onBackToLogin: () => void
}

const VerificationForm = ({ email, onBackToLogin }: VerificationFormProps) => {
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(RESEND_CODE_TIME)
  const [canResend, setCanResend] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendCountdown])

  const handleVerify = async () => {
    try {
      if (code.length !== 6) return

      setIsVerifying(true)
      setError('')

      const response = await api.post(`/auth/verify`, {
        code,
        email,
      })

      await new Promise((resolve) => setTimeout(resolve, 500))

      const {
        data: { user },
      } = response

      const { roles } = user

      setIsRedirecting(true)

      setTimeout(() => {
        if (roles.includes('admin') && roles.includes('teacher')) {
          window.location.href = '/dashboard-selection'
        } else if (roles.includes('admin')) {
          window.location.href = '/admin/dashboard'
        } else if (roles.includes('teacher')) {
          window.location.href = '/professor/dashboard'
        }
      }, 2000)

      setIsVerifying(false)
    } catch (error: any) {
      console.error(error)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsVerifying(false)

      if (error.response?.status === 400) {
        setError(
          'Código de verificação inválido. Por favor, verifique e tente novamente.'
        )
      } else {
        setError('Erro ao verificar código. Tente novamente.')
      }
    }
  }

  const handleResendCode = async () => {
    if (!canResend) return

    try {
      const response = await api.post(`/auth/login`, {
        email,
      })

      if (response.status === 200) {
        setCanResend(false)
        setResendCountdown(RESEND_CODE_TIME)
      }
    } catch (error) {
      console.error(error)
      setCanResend(false)
      setResendCountdown(RESEND_CODE_TIME)
    }
  }

  if (isRedirecting) {
    return <LoadingSplash message="Entrando..." />
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                EduEscola
              </span>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Digite o código de verificação
          </h1>
          <p className="text-sm text-gray-600">
            Enviamos um código de 6 dígitos para{' '}
            <span className="font-medium text-gray-900">{email}</span>. Insira-o
            abaixo para continuar.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => {
                setCode(value)
                if (error) {
                  setError('')
                }
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <div className="text-center">
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            </div>
          )}

          <Button
            onClick={handleVerify}
            disabled={code.length !== 6 || isVerifying}
            className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isVerifying ? 'Verificando...' : 'Verificar e continuar'}
          </Button>

          <div className="text-center space-y-3">
            <button
              onClick={handleResendCode}
              disabled={!canResend}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {canResend
                ? 'Reenviar código'
                : `Reenviar código em ${resendCountdown}s`}
            </button>

            <div>
              <button
                onClick={onBackToLogin}
                className="text-sm text-gray-600 hover:text-gray-700 hover:underline transition-colors duration-200"
              >
                Usar outro e-mail
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © 2025 EduEscola. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}

export default VerificationForm
