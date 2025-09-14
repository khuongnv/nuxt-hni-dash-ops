import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username } = body
    
    if (!username) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username is required'
      })
    }
    
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_API_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Supabase configuration missing'
      })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Check if user exists in database
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id,
        username,
        full_name,
        email,
        status,
        department_id,
        role_id,
        position_id,
        gender_id,
        dob,
        created_at,
        updated_at,
        department:departments(name),
        role:categories!role_id(name),
        position:categories!position_id(name),
        gender:categories!gender_id(name)
      `)
      .eq('username', username)
      .eq('status', 'active')
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // User not found
        return {
          success: false,
          error: 'User not found in database'
        }
      }
      throw error
    }
    
    if (!user) {
      return {
        success: false,
        error: 'User not found in database'
      }
    }
    
    return {
      success: true,
      user
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Check user error: ${error.message}`
    })
  }
})
