import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    
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
      .insert({
        title: body.title,
        message: body.message,
        type: body.type || 'info',
        status: body.status || 'active',
        created_by: body.created_by || null,
        start_at: body.start_at || null,
        end_at: body.end_at || null
      })
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
      message: 'Thêm thông báo hệ thống thành công',
      data: notification
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi tạo thông báo hệ thống'
    })
  }
})
