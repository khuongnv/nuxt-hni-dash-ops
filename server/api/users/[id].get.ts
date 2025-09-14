import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID người dùng không hợp lệ'
      })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!
    )

    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        full_name,
        username,
        email,
        department_id,
        role_id,
        position_id,
        gender_id,
        dob,
        status,
        created_at,
        updated_at,
        department:departments(name),
        role:categories!role_id(name),
        position:categories!position_id(name),
        gender:categories!gender_id(name)
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Lỗi khi lấy thông tin người dùng'
    })
  }
})
