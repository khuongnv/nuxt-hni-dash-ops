import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { full_name, username, password, email, department_id, role_id, position_id, gender_id, dob, status } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID người dùng không hợp lệ'
      })
    }

    // Validation
    if (!full_name || !username || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!
    )

    const updateData: any = {
      full_name,
      username,
      email,
      department_id: department_id || null,
      role_id: role_id || null,
      position_id: position_id || null,
      gender_id: gender_id || null,
      dob: dob || null,
      status: status || 'active',
      updated_at: new Date().toISOString()
    }

    // Only update password if provided
    if (password) {
      updateData.password = password
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
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
      statusMessage: error.statusMessage || 'Lỗi khi cập nhật người dùng'
    })
  }
})
