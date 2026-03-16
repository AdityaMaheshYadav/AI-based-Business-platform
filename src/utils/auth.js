export const fakeLogin = (email, password) => {
  // Simulate auth — replace with real Axios call later
  if (email && password && password.length >= 4) {
    try {
      const token = btoa(unescape(encodeURIComponent(email)))
      localStorage.setItem('nexus_token', token)
      localStorage.setItem('nexus_user', JSON.stringify({ name: email.split('@')[0], email }))
      return true
    } catch (e) {
      // fallback token
      localStorage.setItem('nexus_token', 'user_token')
      localStorage.setItem('nexus_user', JSON.stringify({ name: email.split('@')[0], email }))
      return true
    }
  }
  return false
}

export const logout = () => {
  localStorage.removeItem('nexus_token')
  localStorage.removeItem('nexus_user')
}

export const getUser = () => {
  try { return JSON.parse(localStorage.getItem('nexus_user')) } catch { return null }
}

export const isAuthenticated = () => !!localStorage.getItem('nexus_token')
