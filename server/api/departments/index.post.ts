import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!
    )
    const body = await readBody(event)

    // Validation
    if (!body.code || !body.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Code và name là bắt buộc'
      })
    }

    // Check if code already exists
    const { data: existingDepartment } = await supabase
      .from('departments')
      .select('id')
      .eq('code', body.code)
      .single()

    if (existingDepartment) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Code đã tồn tại'
      })
    }

    const { data, error } = await supabase
      .from('departments')
      .insert({
        code: body.code,
        name: body.name,
        parent_id: body.parent_id || null,
        map_id: body.map_id || null,
        level: body.level || 1,
        note: body.note || null
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Lỗi khi tạo department'
    })
  }
})
