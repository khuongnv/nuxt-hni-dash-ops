export const useSupabase = () => {
  const { $supabase } = useNuxtApp()
  return $supabase
}

// Composable cho menus
export const useMenus = () => {
  const supabase = useSupabase()

  // Lấy tất cả menus
  const getMenus = async () => {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .order('order', { ascending: true })
    
    if (error) throw error
    return data
  }

  // Lấy menu theo ID
  const getMenuById = async (id: number) => {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // Tạo menu mới
  const createMenu = async (menuData: any) => {
    const { data, error } = await supabase
      .from('menus')
      .insert(menuData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Cập nhật menu
  const updateMenu = async (id: number, menuData: any) => {
    const { data, error } = await supabase
      .from('menus')
      .update(menuData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Xóa menu
  const deleteMenu = async (id: number) => {
    const { error } = await supabase
      .from('menus')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Lấy menus theo cấp độ
  const getMenusByLevel = async (level: number) => {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('level', level)
      .eq('is_active', true)
      .order('order', { ascending: true })
    
    if (error) throw error
    return data
  }

  // Lấy menus con theo parent_id
  const getChildMenus = async (parentId: number) => {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('parent_id', parentId)
      .eq('is_active', true)
      .order('order', { ascending: true })
    
    if (error) throw error
    return data
  }

  // Real-time subscription cho menus
  const subscribeToMenus = (callback: (payload: any) => void) => {
    return supabase
      .channel('menus_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'menus' }, 
        callback
      )
      .subscribe()
  }

  return {
    getMenus,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu,
    getMenusByLevel,
    getChildMenus,
    subscribeToMenus
  }
}

