import { useNavigate } from 'react-router-dom'
import './index.css'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="not-found-container">
      <img
        src="/page-not-found.svg"
        alt="page not found"
        className="not-found-image"
      />
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button onClick={() => navigate('/')} className="go-home-btn">
        Go to Home
      </button>
    </div>
  )
}

export default NotFound