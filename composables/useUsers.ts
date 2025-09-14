import { useErrorHandler } from './useErrorHandler'

export interface User {
  id: number
  full_name: string
  username: string
  password?: string
  email: string
  department_id?: number
  role_id?: number
  position_id?: number
  gender_id?: number
  dob?: string
  status: string
  created_at: string
  updated_at: string
  department?: { name: string }
  role?: { name: string }
  position?: { name: string }
  gender?: { name: string }
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface UsersResponse {
  data: User[]
  pagination: PaginationInfo
}

export const useUsers = () => {
  const { handleAsyncError } = useErrorHandler()

  const getUsers = async (page: number = 1, limit: number = 10, search: string = '', status: string = ''): Promise<UsersResponse> => {
    return await handleAsyncError(async () => {
      const response = await $fetch<UsersResponse>('/api/users', {
        query: { page, limit, search, status }
      })
      return response
    }, 'Lấy danh sách người dùng')
  }

  const getUserById = async (id: number): Promise<User> => {
    return await handleAsyncError(async () => {
      const data = await $fetch<User>(`/api/users/${id}`)
      return data
    }, 'Lấy thông tin người dùng')
  }

  const createUser = async (userData: Partial<User>): Promise<User> => {
    return await handleAsyncError(async () => {
      const data = await $fetch<User>('/api/users', {
        method: 'POST',
        body: userData
      })
      return data
    }, 'Tạo người dùng')
  }

  const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
    return await handleAsyncError(async () => {
      const data = await $fetch<User>(`/api/users/${id}`, {
        method: 'PUT',
        body: userData
      })
      return data
    }, 'Cập nhật người dùng')
  }

  const deleteUser = async (id: number): Promise<void> => {
    return await handleAsyncError(async () => {
      await $fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })
    }, 'Xóa người dùng')
  }

  return {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  }
}
