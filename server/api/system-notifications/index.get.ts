import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    const { data: notifications, error } = await supabase
      .from('system_notifications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Lỗi Supabase: ${error.message}`
      })
    }
    
    return {
      success: true,
      data: notifications
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi đọc dữ liệu thông báo hệ thống'
    })
  }
})
