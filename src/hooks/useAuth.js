import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!Cookies.get('jwt_token')
  })

  useEffect(() => {
    // Check token status immediately
    const checkAuth = () => {
      setIsAuthenticated(!!Cookies.get('jwt_token'))
    }

    // Check on interval to catch cookie changes
    const interval = setInterval(checkAuth, 100)

    // Also listen for storage events (logout in other tabs)
    window.addEventListener('storage', checkAuth)

    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  return isAuthenticated
}

export default useAuth
