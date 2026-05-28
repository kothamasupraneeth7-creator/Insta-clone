import { Rings } from 'react-loader-spinner'
import Post from '../Post'
import FailureView from '../FailureView'
import './index.css'

const PostsList = ({ posts, isLoading, isFailure, onRetry, onLikeChange, onAddComment }) => {
  if (isLoading) {
    return (
      <div className="loader-container" data-testid="loader">
        <Rings color="gold" height={80} width={80} />
      </div>
    )
  }

  if (isFailure) {
    return <FailureView onRetry={onRetry} message={"Failed to load posts. Please check your network and try again."} />
  }

  if (!posts || posts.length === 0) {
    return <p className="no-posts">No posts available</p>
  }

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <Post
          key={post.post_id}
          details={post}
          onLikeChange={onLikeChange}
          onAddComment={onAddComment}
        />
      ))}
    </div>
  )
}

export default PostsList
