import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const search = query.search as string || ''
    const status = query.status as string || ''
    const offset = (page - 1) * limit

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!
    )

    // Build query
    let queryBuilder = supabase
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
      `, { count: 'exact' })

    // Apply search filter
    if (search) {
      queryBuilder = queryBuilder.or(`full_name.ilike.%${search}%,username.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Apply status filter
    if (status && status !== 'all') {
      queryBuilder = queryBuilder.eq('status', status)
    }

    // Apply ordering and pagination
    queryBuilder = queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Lỗi khi lấy danh sách người dùng'
    })
  }
})
