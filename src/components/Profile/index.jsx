import { BsGrid3X3 } from 'react-icons/bs'
import { BiCamera } from 'react-icons/bi'
import { Rings } from 'react-loader-spinner'
import FailureView from '../FailureView'
import './index.css'

const Profile = ({ profileData, isLoading, isFailure, onRetry, type = 'my' }) => {
  if (isLoading) {
    return (
      <div className="loader-container" data-testid="loader">
        <Rings color="gold" height={80} width={80} />
      </div>
    )
  }

  if (isFailure) {
    return <FailureView onRetry={onRetry} message={"Failed to load profile. Please try again."} />
  }

  if (!profileData) {
    return <p>No profile data available</p>
  }

  const altText = type === 'my' ? 'my profile' : 'user profile'
  const postAlt = type === 'my' ? 'my post' : 'user post'

  const getPostImageUrl = (post) => {
    return (
      post?.post_details?.image_url ||
      post?.post_details?.imageUrl ||
      post?.post_details?.image ||
      post?.image_url ||
      post?.imageUrl ||
      post?.image ||
      ''
    )
  }

  const getProfilePicUrl = () => {
    return profileData?.profile_pic || profileData?.profilePic || ''
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={getProfilePicUrl()}
          alt={altText}
          className="profile-pic"
        />
        <div className="profile-info">
          <h2 className="profile-name">{profileData.user_name || profileData.userName}</h2>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-label">Posts</span>
              <span className="stat-value">
                {profileData.posts_count || profileData.posts?.length || profileData.postsCount || 0}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Followers</span>
              <span className="stat-value">
                {profileData.followers_count || profileData.followersCount}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Following</span>
              <span className="stat-value">
                {profileData.following_count || profileData.followingCount}
              </span>
            </div>
          </div>
          <p className="profile-bio">{profileData.user_bio || profileData.userBio}</p>
        </div>
      </div>

      <div className="profile-posts">
        <div className="posts-header">
          <BsGrid3X3 size={24} />
          <h3>Posts</h3>
        </div>

        {!profileData.posts || profileData.posts.length === 0 ? (
          <div className="no-posts-view">
            <BiCamera size={48} />
            <p>No posts yet</p>
          </div>
        ) : (
          <div className="posts-grid">
            {profileData.posts.map((post) => {
              const imageUrl = getPostImageUrl(post)
              return (
                <div key={post.post_id} className="grid-post">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={postAlt}
                      className="grid-post-image"
                    />
                  ) : (
                    <div className="grid-post-placeholder">No image</div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
