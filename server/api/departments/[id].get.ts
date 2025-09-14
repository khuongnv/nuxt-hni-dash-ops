import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!
    )
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID là bắt buộc'
      })
    }

    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy department'
      })
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Lỗi khi lấy thông tin department'
    })
  }
})
