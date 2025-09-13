import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.name || !body.icon) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc: name, icon'
      })
    }

    const config = useRuntimeConfig()
    
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    const newMenu = {
      name: body.name.trim(),
      href: body.href ? body.href.trim() : '#',
      icon: body.icon.trim(),
      order: body.order || 1,
      is_active: body.is_active !== undefined ? body.is_active : true,
      parent_id: body.parent_id || null,
      level: body.level || 1
    }
    

    const { data, error } = await supabase
      .from('menus')
      .insert(newMenu)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Lỗi Supabase: ${error.message}`
      })
    }
    
    return {
      success: true,
      message: 'Thêm menu hệ thống thành công',
      data
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi thêm menu hệ thống mới'
    })
  }
})