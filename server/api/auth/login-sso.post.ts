export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { user, ssoUser } = body
    
    if (!user || !ssoUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User and SSO user data are required'
      })
    }
    
    // Add SSO session flag to user data
    const userWithSSO = {
      ...user,
      ssoSession: true,
      ssoSessionId: ssoUser.sessionId,
      lastLogin: new Date().toISOString()
    }
    
    return {
      success: true,
      user: userWithSSO
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `SSO login error: ${error.message}`
    })
  }
})
