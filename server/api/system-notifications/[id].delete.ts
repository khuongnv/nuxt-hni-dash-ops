import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const id = getRouterParam(event, 'id')
    
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

    const { error } = await supabase
      .from('system_notifications')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Lỗi Supabase: ${error.message}`
      })
    }
    
    return {
      success: true,
      message: 'Xóa thông báo hệ thống thành công'
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi xóa thông báo hệ thống'
    })
  }
})
