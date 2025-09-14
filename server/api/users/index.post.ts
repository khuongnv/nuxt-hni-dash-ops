import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { full_name, username, password, email, department_id, role_id, position_id, gender_id, dob, status } = body

    // Validation
    if (!full_name || !username || !password || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!
    )

    const { data, error } = await supabase
      .from('users')
      .insert({
        full_name,
        username,
        password,
        email,
        department_id: department_id || null,
        role_id: role_id || null,
        position_id: position_id || null,
        gender_id: gender_id || null,
        dob: dob || null,
        status: status || 'active'
      })
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
        updated_at
      `)
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
      statusMessage: error.statusMessage || 'Lỗi khi tạo người dùng'
    })
  }
})
