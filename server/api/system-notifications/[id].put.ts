import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID thông báo là bắt buộc'
      })
    }
    
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    // Validate required fields
    if (!body.title || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tiêu đề và nội dung thông báo là bắt buộc'
      })
    }

    const { data: notification, error } = await supabase
      .from('system_notifications')
      .update({
        title: body.title,
        message: body.message,
        type: body.type || 'info',
        status: body.status || 'active',
        start_at: body.start_at || null,
        end_at: body.end_at || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
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
      message: 'Cập nhật thông báo hệ thống thành công',
      data: notification
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi cập nhật thông báo hệ thống'
    })
  }
})
