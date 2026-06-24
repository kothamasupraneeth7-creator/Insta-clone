import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const DEMO_ENABLED = import.meta.env.VITE_ENABLE_DEMO === 'true'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.')
      return
    }

    await performLogin()
  }

  const performLogin = async () => {
    setIsLoading(true)
    try {
      // timeout helper
      const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))

      const payload = JSON.stringify({ username, password })
      const controller = new AbortController()
      const signal = controller.signal

      const fetchPromise = fetch('/apis/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
        signal,
      })

      let response
      try {
        response = await Promise.race([fetchPromise, timeout(15000)])
      } catch (err) {
        // first attempt failed (network/timeout) - try once more
        console.warn('First login attempt failed, retrying...', err)
        const retryFetch = fetch('/apis/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: payload,
        })
        response = await Promise.race([retryFetch, timeout(15000)])
      }

      const parseResponseBody = async (responseToParse) => {
        const contentType = responseToParse.headers.get('content-type') || ''
        const text = await responseToParse.text()
        if (contentType.includes('application/json')) {
          try {
            return JSON.parse(text)
          } catch {
            return { _rawText: text }
          }
        }
        try {
          return JSON.parse(text)
        } catch {
          return { _rawText: text }
        }
      }

      const data = await parseResponseBody(response)

      if (response.ok) {
        if (data && data.jwt_token) {
          Cookies.set('jwt_token', data.jwt_token, { expires: 30 })
          navigate('/')
        } else {
          const message = data && (data.error_msg || data.error || data.message || data._rawText)
          setErrorMsg(message || 'Login succeeded but the response was missing expected data.')
        }
      } else {
        const serverMsg = data && (data.error_msg || data.error || data.message || data._rawText)
        setErrorMsg(serverMsg || `Login failed (status ${response.status})`)
      }
    } catch (error) {
      console.error('Login error:', error)
      // If demo mode is enabled, allow offline fallback with configured demo credentials
      if (DEMO_ENABLED && username.trim() === 'rahul' && password.trim() === 'rahul@2021') {
        Cookies.set('jwt_token', 'demo_jwt_token', { expires: 30 })
        try {
          sessionStorage.setItem('demo_mode', 'true')
        } catch {
          // ignore
        }
        navigate('/')
        return
      }
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setErrorMsg('You appear to be offline. Please check your internet connection and try again.')
      } else if (error && error.message === 'timeout') {
        setErrorMsg('The request timed out. Please try again.')
      } else {
        // show available error message
        setErrorMsg(error && error.message ? `Network error: ${error.message}` : 'Network error. Please check your connection and try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image-section">
          <img src="/landing-img.svg" alt="website login" className="login-landing-image" />
        </div>
        
        <div className="login-form-section">
          <img
            src="/insta-logo.svg"
            alt="InstaClone logo"
            className="logo"
          />
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            {errorMsg && <p className="error-message">{errorMsg}</p>}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </button>
            {errorMsg && !isLoading && (
              <button type="button" className="retry-btn" onClick={performLogin}>
                Try again
              </button>
            )}
            {DEMO_ENABLED && (
              <p className="login-hint">
                Demo credentials: <strong>rahul</strong> / <strong>rahul@2021</strong>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
