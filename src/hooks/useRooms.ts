import { useState, useEffect } from 'react'
import api from '@/lib/api'

export interface Room {
  id: string
  name: string
  deleted: boolean
  createdAt: string
  updatedAt: string
}

export interface UseRoomsReturn {
  rooms: Room[]
  loading: boolean
  error: string | null
  fetchRooms: () => Promise<void>
  createRoom: (name: string) => Promise<void>
  updateRoom: (id: string, name: string) => Promise<void>
  deleteRoom: (id: string) => Promise<void>
}

export const useRooms = (): UseRoomsReturn => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/rooms')
      setRooms(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar salas')
      console.error('Error fetching rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const createRoom = async (name: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.post('/rooms', { name })
      await fetchRooms() // Recarrega a lista
    } catch (err) {
      setError('Erro ao criar sala')
      console.error('Error creating room:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateRoom = async (id: string, name: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.put(`/rooms/${id}`, { name })
      await fetchRooms() // Recarrega a lista
    } catch (err) {
      setError('Erro ao atualizar sala')
      console.error('Error updating room:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteRoom = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.delete(`/rooms/${id}`)
      await fetchRooms() // Recarrega a lista
    } catch (err) {
      setError('Erro ao excluir sala')
      console.error('Error deleting room:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  }
} 