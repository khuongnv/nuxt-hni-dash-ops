import { useErrorHandler } from './useErrorHandler'

export interface SSOUser {
  userName: string
  sessionId: string
}

export interface SSOApiResponse {
  IsError: boolean
  ErrorCode: number
  ErrorMessage: string
  Data: SSOUser
}

export interface SSOValidationResult {
  success: boolean
  user?: any // User từ database
  error?: string
  ssoUser?: SSOUser
}

export const useSSO = () => {
  const { handleAsyncError } = useErrorHandler()
  
  // SSO Configuration
  const SSO_CONFIG = {
    baseUrl: 'https://id.hanoi.vnpt.vn',
    loginUrl: 'https://id.hanoi.vnpt.vn/account/SSOLogOn',
    logoutUrl: 'https://id.hanoi.vnpt.vn/account/logoff',
    apiUrl: 'https://id.hanoi.vnpt.vn/api/api/ValidateTokenKey'
  }
  
  // Redirect to SSO login
  const redirectToSSO = () => {
    if (process.client) {
      const returnUrl = `${window.location.origin}/auth/sso-callback`
      const ssoUrl = `${SSO_CONFIG.loginUrl}?returnUrl=${encodeURIComponent(returnUrl)}`
      window.location.href = ssoUrl
    }
  }
  
  // Validate SSO token
  const validateSSOToken = async (tokenkey: string): Promise<SSOValidationResult> => {
    return await handleAsyncError(async () => {
      // 1. Gọi SSO API validate token
      const ssoResponse = await $fetch<SSOApiResponse>(SSO_CONFIG.apiUrl, {
        method: 'POST',
        body: {
          TokenKey: tokenkey
        }
      })
      
      // 2. Check SSO response
      if (ssoResponse.IsError) {
        return {
          success: false,
          error: ssoResponse.ErrorMessage || 'SSO validation failed'
        }
      }
      
      const ssoUser = ssoResponse.Data
      
      // 3. Check user exists in database
      const userResponse = await $fetch<{ success: boolean; user?: any; error?: string }>('/api/auth/check-user', {
        method: 'POST',
        body: {
          username: ssoUser.userName
        }
      })
      
      if (!userResponse.success) {
        return {
          success: false,
          error: userResponse.error || 'User not found in database',
          ssoUser
        }
      }
      
      return {
        success: true,
        user: userResponse.user,
        ssoUser
      }
    }, 'SSO Validation')
  }
  
  // Login user after SSO validation
  const loginSSOUser = async (user: any, ssoUser: SSOUser): Promise<boolean> => {
    return await handleAsyncError(async () => {
      // Tạo session cho user
      const response = await $fetch<{ success: boolean; user?: any }>('/api/auth/login-sso', {
        method: 'POST',
        body: {
          user,
          ssoUser
        }
      })
      
      if (response.success && response.user) {
        // Lưu user vào localStorage
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(response.user))
        }
        return true
      }
      
      return false
    }, 'SSO Login')
  }
  
  // Logout from SSO
  const logoutSSO = () => {
    if (process.client) {
      // Clear local session
      localStorage.removeItem('auth_user')
      
      // Redirect to SSO logout
      window.location.href = SSO_CONFIG.logoutUrl
    }
  }
  
  // Check if current session is from SSO
  const isSSOSession = (): boolean => {
    if (process.client) {
      const user = localStorage.getItem('auth_user')
      if (user) {
        try {
          const userData = JSON.parse(user)
          return userData.ssoSession === true
        } catch (error) {
          return false
        }
      }
    }
    return false
  }
  
  return {
    redirectToSSO,
    validateSSOToken,
    loginSSOUser,
    logoutSSO,
    isSSOSession,
    SSO_CONFIG
  }
}
