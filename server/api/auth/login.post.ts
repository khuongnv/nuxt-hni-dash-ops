import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    // Validation
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Vui lòng nhập đầy đủ thông tin'
      })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!
    )

    // Find user by username and password
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
      .eq('username', username)
      .eq('password', password)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Tên đăng nhập hoặc mật khẩu không đúng'
      })
    }

    // Return user data without password
    return {
      success: true,
      user: data,
      message: 'Đăng nhập thành công'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Có lỗi xảy ra khi đăng nhập'
    })
  }
})
