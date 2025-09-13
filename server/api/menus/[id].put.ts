import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID menu không hợp lệ'
      })
    }

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

    const updateData = {
      name: body.name.trim(),
      href: body.href ? body.href.trim() : '#',
      icon: body.icon.trim(),
      order: body.order || 1,
      is_active: body.is_active !== undefined ? body.is_active : true,
      parent_id: body.parent_id || null,
      level: body.level || 1,
      updated_at: new Date().toISOString()
    }
    

    const { data, error } = await supabase
      .from('menus')
      .update(updateData)
      .eq('id', Number(id))
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Không tìm thấy menu'
        })
      }
      throw createError({
        statusCode: 500,
        statusMessage: `Lỗi Supabase: ${error.message}`
      })
    }
    
    return {
      success: true,
      message: 'Cập nhật menu hệ thống thành công',
      data
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi cập nhật menu hệ thống'
    })
  }
})

