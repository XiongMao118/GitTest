import { ref } from 'vue'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  email: string
  username: string
  avatar_url: string
  is_admin: boolean
  created_at: string
}

const currentUser = ref<UserProfile | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export const useUserStore = () => {
  
  const signUp = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      
      if (!email || !password || !username) {
        error.value = '请填写所有字段'
        isLoading.value = false
        return false
      }
      
      if (password.length < 6) {
        error.value = '密码至少需要6个字符'
        isLoading.value = false
        return false
      }
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            avatar_url: '',
            is_admin: false
          }
        }
      })
      
      if (signUpError) {
        error.value = signUpError.message
        isLoading.value = false
        return false
      }
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            username,
            avatar_url: '',
            is_admin: false
          })
        
        if (profileError) {
          error.value = profileError.message
          isLoading.value = false
          return false
        }
        
        currentUser.value = {
          id: data.user.id,
          email,
          username,
          avatar_url: '',
          is_admin: false,
          created_at: new Date().toISOString()
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
        return true
      } else {
        error.value = '注册成功！请检查邮箱确认账号'
        isLoading.value = false
        return false
      }
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const signIn = async (account: string, password: string): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      
      if (!account || !password) {
        error.value = '请填写账号和密码'
        isLoading.value = false
        return false
      }
      
      const isEmail = account.includes('@')
      let email: string
      
      if (isEmail) {
        email = account
      } else {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .ilike('username', account)
          .limit(1)
        
        if (profileError || !profileData || profileData.length === 0) {
          error.value = '账号不存在'
          isLoading.value = false
          return false
        }
        
        email = profileData[0].email
      }
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (signInError) {
        error.value = signInError.message
        isLoading.value = false
        return false
      }
      
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .limit(1)
        
        if (profileError) {
          error.value = profileError.message
          isLoading.value = false
          return false
        }
        
        let profile
        
        if (!profileData || profileData.length === 0) {
          const usernameFromMeta = data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'user'
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email || '',
              username: usernameFromMeta,
              avatar_url: '',
              is_admin: false
            })
          
          if (insertError) {
            const uniqueUsername = usernameFromMeta + '_' + Date.now().toString(36)
            const { error: retryError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: data.user.email || '',
                username: uniqueUsername,
                avatar_url: '',
                is_admin: false
              })
            
            if (retryError) {
              error.value = '创建用户资料失败: ' + retryError.message
              isLoading.value = false
              return false
            }
            
            profile = {
              id: data.user.id,
              email: data.user.email || '',
              username: uniqueUsername,
              avatar_url: '',
              is_admin: false,
              created_at: new Date().toISOString()
            }
          } else {
            profile = {
              id: data.user.id,
              email: data.user.email || '',
              username: usernameFromMeta,
              avatar_url: '',
              is_admin: false,
              created_at: new Date().toISOString()
            }
          }
        } else {
          profile = profileData[0]
        }
        
        currentUser.value = {
          id: profile.id,
          email: profile.email,
          username: profile.username,
          avatar_url: profile.avatar_url || '',
          is_admin: profile.is_admin || false,
          created_at: profile.created_at
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      }
      
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const signOut = async (): Promise<void> => {
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        error.value = signOutError.message
        return
      }
      
      currentUser.value = null
      localStorage.removeItem('currentUser')
      error.value = null
    } catch (e: any) {
      error.value = e.message
    }
  }
  
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!currentUser.value) {
        error.value = '用户未登录'
        return false
      }
      
      isLoading.value = true
      error.value = null
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', currentUser.value.id)
      
      if (updateError) {
        error.value = updateError.message
        return false
      }
      
      currentUser.value = { ...currentUser.value, ...updates }
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const checkSession = async (): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .limit(1)
        
        if (!profileError && profileData && profileData.length > 0) {
          const profile = profileData[0]
          currentUser.value = {
            id: profile.id,
            email: profile.email,
            username: profile.username,
            avatar_url: profile.avatar_url || '',
            is_admin: profile.is_admin || false,
            created_at: profile.created_at
          }
          localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
        }
      }
    } catch (e: any) {
      error.value = e.message
    }
  }
  
  const resetError = (): void => {
    error.value = null
  }
  
  return {
    currentUser,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    checkSession,
    resetError,
  }
}
