import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { getApiUrl } from '../../utils/apiUrl'
import Header from '../Header'
import Profile from '../Profile'
import './index.css'

const UserDetails = () => {
  const { id } = useParams()
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFailure, setIsFailure] = useState(false)
  const navigate = useNavigate()

  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true)
    setIsFailure(false)

    try {
      const token = Cookies.get('jwt_token')
      const response = await fetch(getApiUrl(`/apis/insta-share/users/${id}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Handle different API response structures
        const profile = data.user_details || data.profile_details || data.profile
        if (profile) {
          setProfileData(profile)
        } else {
          setIsFailure(true)
        }
      } else {
        setIsFailure(true)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setIsFailure(true)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    const token = Cookies.get('jwt_token')
    if (!token) {
      navigate('/login')
    } else {
      Promise.resolve().then(fetchUserProfile)
    }
  }, [fetchUserProfile, navigate])

  const handleSearch = (searchInput) => {
    navigate(`/?search=${encodeURIComponent(searchInput)}`)
  }

  return (
    <div className="user-details-container">
      <Header onSearch={handleSearch} />
      <Profile
        profileData={profileData}
        isLoading={isLoading}
        isFailure={isFailure}
        onRetry={fetchUserProfile}
        type="user"
      />
    </div>
  )
}

export default UserDetails