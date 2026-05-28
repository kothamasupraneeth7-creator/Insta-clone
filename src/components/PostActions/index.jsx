import { BsHeart, FcLike } from 'react-icons/bs'
import { FaRegComment } from 'react-icons/fa'
import { BiShareAlt } from 'react-icons/bi'
import Cookies from 'js-cookie'
import './index.css'

const PostActions = ({ postId, isLiked, likesCount, onLikeChange }) => {
  const handleLikeToggle = async () => {
    const token = Cookies.get('jwt_token')
    const newLikeStatus = !isLiked

    try {
      const response = await fetch(`/apis/insta-share/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ like_status: newLikeStatus }),
      })

      if (response.ok) {
        onLikeChange(newLikeStatus, newLikeStatus ? likesCount + 1 : likesCount - 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  return (
    <div className="post-actions">
      <div className="action-buttons">
        <button
          type="button"
          data-testid={isLiked ? 'unLikeIcon' : 'likeIcon'}
          onClick={handleLikeToggle}
          className="action-btn"
        >
          {isLiked ? <FcLike size={24} /> : <BsHeart size={24} />}
        </button>
        <button type="button" className="action-btn">
          <FaRegComment size={24} />
        </button>
        <button type="button" className="action-btn">
          <BiShareAlt size={24} />
        </button>
      </div>
      <p className="likes-count">{likesCount} likes</p>
    </div>
  )
}

export default PostActions
