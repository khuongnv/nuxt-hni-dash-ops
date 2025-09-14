import { useErrorHandler } from './useErrorHandler'

export interface Department {
  id: number
  code: string
  name: string
  parent_id: number | null
  map_id: number | null
  level: number
  note: string | null
  created_at: string
  updated_at: string
}

export const useDepartments = () => {
  const { handleAsyncError } = useErrorHandler()

  const getDepartments = async (): Promise<Department[]> => {
    return await handleAsyncError(async () => {
      const { data } = await $fetch('/api/departments')
      return data
    }, 'Lấy danh sách departments')
  }

  const getDepartmentById = async (id: number): Promise<Department> => {
    return await handleAsyncError(async () => {
      const { data } = await $fetch(`/api/departments/${id}`)
      return data
    }, 'Lấy thông tin department')
  }

  const createDepartment = async (departmentData: Partial<Department>): Promise<Department> => {
    return await handleAsyncError(async () => {
      const { data } = await $fetch('/api/departments', {
        method: 'POST',
        body: departmentData
      })
      return data
    }, 'Tạo department')
  }

  const updateDepartment = async (id: number, departmentData: Partial<Department>): Promise<Department> => {
    return await handleAsyncError(async () => {
      const { data } = await $fetch(`/api/departments/${id}`, {
        method: 'PUT',
        body: departmentData
      })
      return data
    }, 'Cập nhật department')
  }

  const deleteDepartment = async (id: number): Promise<void> => {
    return await handleAsyncError(async () => {
      await $fetch(`/api/departments/${id}`, {
        method: 'DELETE'
      })
    }, 'Xóa department')
  }

  // Helper function to build department tree
  const buildDepartmentTree = (departments: Department[]): Department[] => {
    const departmentMap = new Map<number, Department & { children?: Department[] }>()
    const rootDepartments: Department[] = []

    // First pass: create map
    departments.forEach(department => {
      departmentMap.set(department.id, { ...department, children: [] })
    })

    // Second pass: build tree
    departments.forEach(department => {
      const departmentWithChildren = departmentMap.get(department.id)!
      if (department.parent_id) {
        const parent = departmentMap.get(department.parent_id)
        if (parent) {
          parent.children!.push(departmentWithChildren)
        }
      } else {
        rootDepartments.push(departmentWithChildren)
      }
    })

    return rootDepartments
  }

  // Helper function to get parent departments (for dropdown)
  const getParentDepartments = (departments: Department[], excludeId?: number): Department[] => {
    return departments.filter(dept => dept.id !== excludeId)
  }

  // Helper function to get departments by level
  const getDepartmentsByLevel = (departments: Department[], level: number): Department[] => {
    return departments.filter(dept => dept.level === level)
  }

  return {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    buildDepartmentTree,
    getParentDepartments,
    getDepartmentsByLevel
  }
}
