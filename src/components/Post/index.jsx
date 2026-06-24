import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsHeart } from 'react-icons/bs'
import { FcLike } from 'react-icons/fc'
import { FaRegComment } from 'react-icons/fa'
import { BiShareAlt } from 'react-icons/bi'
import Cookies from 'js-cookie'
import { getApiUrl } from '../../utils/apiUrl'
import CommentSection from '../CommentSection'

const Post = ({ details, onLikeChange, onAddComment }) => {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(details.is_liked || false)
  const [likesCount, setLikesCount] = useState(details.likes_count)

  const getPostImageUrl = () => {
    return (
      details?.post_details?.image_url ||
      details?.post_details?.imageUrl ||
      details?.post_details?.image ||
      details?.image_url ||
      details?.imageUrl ||
      details?.image ||
      ''
    )
  }

  const getProfilePicUrl = () => {
    return details?.profile_pic || details?.profilePic || ''
  }

  const getCaption = () => {
    return (
      details?.post_details?.caption ||
      details?.caption ||
      ''
    )
  }

  const handleUsernameClick = () => {
    navigate(`/users/${details.user_id}`)
  }

  const onLike = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        like_status: !liked,
      }),
    }

    try {
      await fetch(
        getApiUrl(`/apis/insta-share/posts/${details.post_id}/like`),
        options,
      )

      setLiked(!liked)
      const newCount = !liked ? likesCount + 1 : likesCount - 1
      setLikesCount(newCount)
      
      if (onLikeChange) {
        onLikeChange(details.post_id, !liked, newCount)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const imageUrl = getPostImageUrl()
  const profilePicUrl = getProfilePicUrl()
  const caption = getCaption()

  return (
    <div className="post-item">
      <div className="post-header">
        <img
          src={profilePicUrl}
          alt="post author profile"
          className="post-author-profile"
        />
        <button
          type="button"
          onClick={handleUsernameClick}
          className="post-author-name"
        >
          {details.user_name}
        </button>
      </div>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt="post"
          className="post-image"
        />
      ) : (
        <div className="post-image-placeholder">Image not available</div>
      )}

      <div className="post-actions-container">
        {liked ? (
          <button
            type="button"
            onClick={onLike}
            data-testid="unLikeIcon"
            className="action-icon"
          >
            <FcLike />
          </button>
        ) : (
          <button
            type="button"
            onClick={onLike}
            data-testid="likeIcon"
            className="action-icon"
          >
            <BsHeart />
          </button>
        )}

        <button type="button" className="action-icon">
          <FaRegComment />
        </button>

        <button type="button" className="action-icon">
          <BiShareAlt />
        </button>
      </div>

      <p className="likes-text">{likesCount} likes</p>

      {caption && (
        <p className="post-caption">{caption}</p>
      )}

      <CommentSection 
        comments={details.comments}
        postId={details.post_id}
        onAddComment={onAddComment}
      />

      <p className="post-time">{details.created_at}</p>
    </div>
  )
}

export default Post