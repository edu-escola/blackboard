import { GraduationCap } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LogoutButton } from './LogoutButton'

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="p-2 bg-blue-600 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">EduEscola</span>

          {/* <Select defaultValue="lincoln">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lincoln">Lincoln Elementary</SelectItem>
              <SelectItem value="washington">Washington High School</SelectItem>
              <SelectItem value="roosevelt">Roosevelt Middle School</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        <div className="flex items-center space-x-4">
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
