import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import Cookies from 'js-cookie'
import './index.css'

const DEMO_ENABLED = import.meta.env.VITE_ENABLE_DEMO === 'true'

const Header = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()
  // demo mode removed for production
  let demoMode = false
  if (DEMO_ENABLED) {
    demoMode = Cookies.get('jwt_token') === 'demo_jwt_token'
    try {
      if (!demoMode && sessionStorage.getItem('demo_mode') === 'true') {
        demoMode = true
      }
    } catch {
      // ignore
    }
  }

  const handleLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      const query = searchInput.trim()
      if (onSearch) {
        onSearch(query)
      }
      navigate(`/?search=${encodeURIComponent(query)}`)
      setSearchInput('')
    }
  }

  return (
    <header className="header">
      <div className="header-container">
        <button className="logo-btn" onClick={() => navigate('/')}>
          <img
            src="/insta-logo.svg"
            alt="InstaClone logo"
            className="logo"
          />
        </button>

        <nav className="nav-links">
          <button onClick={() => navigate('/')} className="nav-btn">
            Home
          </button>
          <button onClick={() => navigate('/my-profile')} className="nav-btn">
            Profile
          </button>
        </nav>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search"
            className="search-input"
          />
          <button type="submit" data-testid="searchIcon" className="search-btn">
            <FaSearch />
          </button>
        </form>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
        {demoMode && <span className="demo-badge">Demo</span>}
      </div>
    </header>
  )
}

export default Header
