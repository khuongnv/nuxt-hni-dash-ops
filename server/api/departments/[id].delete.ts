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

    // Check if department has children
    const { data: children } = await supabase
      .from('departments')
      .select('id')
      .eq('parent_id', id)

    if (children && children.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Không thể xóa department có department con'
      })
    }

    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    return {
      success: true,
      message: 'Xóa department thành công'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Lỗi khi xóa department'
    })
  }
})
