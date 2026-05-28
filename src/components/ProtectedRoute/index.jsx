import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = ({ children, isAuthenticated }) => {
  // Use the passed prop or check cookie directly as fallback
  const token = isAuthenticated !== undefined ? isAuthenticated : !!Cookies.get('jwt_token')
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default ProtectedRoute
