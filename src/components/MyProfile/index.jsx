import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { getApiUrl } from '../../utils/apiUrl'
import Header from '../Header'
import Profile from '../Profile'
import './index.css'

const MyProfile = () => {
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFailure, setIsFailure] = useState(false)
  const navigate = useNavigate()

  const fetchMyProfile = async () => {
    setIsLoading(true)
    setIsFailure(false)

    try {
      const token = Cookies.get('jwt_token')
      const response = await fetch(getApiUrl('/apis/insta-share/my-profile'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Handle different API response structures
        const profile = data.profile || data.profile_details || data.user_details
        if (profile) {
          setProfileData(profile)
        } else {
          setIsFailure(true)
        }
      } else {
        setIsFailure(true)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setIsFailure(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = Cookies.get('jwt_token')
    if (!token) {
      navigate('/login')
    } else {
      Promise.resolve().then(fetchMyProfile)
    }
  }, [navigate])

  const handleSearch = (searchInput) => {
    navigate(`/?search=${encodeURIComponent(searchInput)}`)
  }

  return (
    <div className="my-profile-container">
      <Header onSearch={handleSearch} />
      <Profile
        profileData={profileData}
        isLoading={isLoading}
        isFailure={isFailure}
        onRetry={fetchMyProfile}
        type="my"
      />
    </div>
  )
}

export default MyProfile