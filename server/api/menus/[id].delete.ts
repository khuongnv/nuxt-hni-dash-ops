import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID menu không hợp lệ'
      })
    }

    const config = useRuntimeConfig()
    
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    // Kiểm tra menu có tồn tại không
    const { data: existingMenu, error: checkError } = await supabase
      .from('menus')
      .select('id')
      .eq('id', Number(id))
      .single()

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Không tìm thấy menu'
        })
      }
      throw createError({
        statusCode: 500,
        statusMessage: `Lỗi Supabase: ${checkError.message}`
      })
    }

    // Xóa menu
    const { error } = await supabase
      .from('menus')
      .delete()
      .eq('id', Number(id))

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Lỗi Supabase: ${error.message}`
      })
    }
    
    return {
      success: true,
      message: 'Xóa menu hệ thống thành công'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi xóa menu hệ thống'
    })
  }
})