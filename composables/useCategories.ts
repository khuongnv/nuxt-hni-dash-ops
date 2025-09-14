import { useErrorHandler } from './useErrorHandler'

export interface Category {
  id: number
  code: string
  name: string
  parent_id: number | null
  map_id: number | null
  note: string | null
  created_at: string
  updated_at: string
}

export const useCategories = () => {
  const { handleAsyncError } = useErrorHandler()

  const getCategories = async (): Promise<Category[]> => {
    return await handleAsyncError(async () => {
      const { data } = await $fetch('/api/categories')
      return data
    }, 'Lấy danh sách categories')
  }

  const getCategoryById = async (id: number): Promise<Category> => {
    return await handleAsyncError(async () => {
      const { data } = await $fetch(`/api/categories/${id}`)
      return data
    }, 'Lấy thông tin category')
  }

  const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
    return await handleAsyncError(async () => {
      const { data } = await $fetch('/api/categories', {
        method: 'POST',
        body: categoryData
      })
      return data
    }, 'Tạo category')
  }

  const updateCategory = async (id: number, categoryData: Partial<Category>): Promise<Category> => {
    return await handleAsyncError(async () => {
      const { data } = await $fetch(`/api/categories/${id}`, {
        method: 'PUT',
        body: categoryData
      })
      return data
    }, 'Cập nhật category')
  }

  const deleteCategory = async (id: number): Promise<void> => {
    return await handleAsyncError(async () => {
      await $fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      })
    }, 'Xóa category')
  }

  // Helper function to build category tree
  const buildCategoryTree = (categories: Category[]): Category[] => {
    const categoryMap = new Map<number, Category & { children?: Category[] }>()
    const rootCategories: Category[] = []

    // First pass: create map
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] })
    })

    // Second pass: build tree
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id)
        if (parent) {
          parent.children!.push(categoryWithChildren)
        }
      } else {
        rootCategories.push(categoryWithChildren)
      }
    })

    return rootCategories
  }

  // Helper function to get parent categories (for dropdown)
  const getParentCategories = (categories: Category[], excludeId?: number): Category[] => {
    return categories.filter(cat => cat.id !== excludeId)
  }

  return {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    buildCategoryTree,
    getParentCategories
  }
}
