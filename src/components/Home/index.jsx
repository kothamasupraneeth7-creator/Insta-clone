import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import { getApiUrl } from '../../utils/apiUrl'
import Header from '../Header'
import UserStories from '../UserStories'
import PostsList from '../postsList'
import './index.css'

const Home = () => {
  const [stories, setStories] = useState([])
  const [posts, setPosts] = useState([])
  const [storiesLoading, setStoriesLoading] = useState(false)
  const [postsLoading, setPostsLoading] = useState(false)
  const [storiesFailure, setStoriesFailure] = useState(false)
  const [postsFailure, setPostsFailure] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const fetchStories = useCallback(async () => {
    setStoriesLoading(true)
    setStoriesFailure(false)

    try {
      const token = Cookies.get('jwt_token')
      const response = await fetch(getApiUrl('/apis/insta-share/stories'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStories(data.users_stories)
      } else {
        setStoriesFailure(true)
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
      setStoriesFailure(true)
    } finally {
      setStoriesLoading(false)
    }
  }, [])

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true)
    setPostsFailure(false)

    try {
      const token = Cookies.get('jwt_token')
      const response = await fetch(getApiUrl('/apis/insta-share/posts'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
        setSearchResults(null)
      } else {
        setPostsFailure(true)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPostsFailure(true)
    } finally {
      setPostsLoading(false)
    }
  }, [])

  const fetchSearchResults = useCallback(async (searchInput) => {
    if (!searchInput.trim()) {
      setSearchResults(null)
      setPosts([])
      fetchPosts()
      return
    }

    setPostsLoading(true)
    setPostsFailure(false)

    try {
      const token = Cookies.get('jwt_token')
      const response = await fetch(
        getApiUrl(`/apis/insta-share/posts?search=${encodeURIComponent(searchInput)}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.posts || [])
      } else {
        setPostsFailure(true)
        setSearchResults([])
      }
    } catch (error) {
      console.error('Error searching posts:', error)
      setPostsFailure(true)
      setSearchResults([])
    } finally {
      setPostsLoading(false)
    }
  }, [fetchPosts])

  const handleSearch = (searchInput) => {
    fetchSearchResults(searchInput)
  }

  const handleLikeChange = (postId, isLiked, likesCount) => {
    const postsToUpdate = searchResults !== null ? searchResults : posts
    const updatedPosts = (postsToUpdate || []).map((post) => {
      if (post.post_id === postId) {
        return {
          ...post,
          is_liked: isLiked,
          likes_count: likesCount,
        }
      }
      return post
    })

    if (searchResults !== null) {
      setSearchResults(updatedPosts)
    } else {
      setPosts(updatedPosts)
    }
  }

  const handleAddComment = async (postId, commentText) => {
    const token = Cookies.get('jwt_token')
    
    try {
      const response = await fetch(
        getApiUrl(`/apis/insta-share/posts/${postId}/comments`),
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment: commentText,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const newComment =
          data.comment ||
          data.comment_details ||
          data.commentDetails ||
          data.commentObject ||
          {
            user_name: 'You',
            comment: commentText,
          }

        if (!newComment.comment && newComment.comment_text) {
          newComment.comment = newComment.comment_text
        }

        if (!newComment.user_name && newComment.username) {
          newComment.user_name = newComment.username
        }

        const postsToUpdate = searchResults !== null ? searchResults : posts
        const updatedPosts = (postsToUpdate || []).map((post) => {
          if (post.post_id === postId) {
            return {
              ...post,
              comments: [...(post.comments || []), newComment],
            }
          }
          return post
        })

        if (searchResults !== null) {
          setSearchResults(updatedPosts)
        } else {
          setPosts(updatedPosts)
        }
      } else {
        console.error('Error posting comment:', response.statusText)
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  useEffect(() => {
    const token = Cookies.get('jwt_token')
    if (!token) {
      navigate('/login')
    } else {
      Promise.resolve().then(() => {
        fetchStories()
        fetchPosts()
      })
    }
  }, [navigate, fetchStories, fetchPosts])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('search')

    const updateSearch = async () => {
      if (q) {
        await fetchSearchResults(q)
      } else if (searchResults !== null) {
        setSearchResults(null)
        await fetchPosts()
      }
    }

    updateSearch()
  }, [location.search, fetchSearchResults, fetchPosts, searchResults])

  const displayPosts = searchResults !== null ? searchResults : posts

  return (
    <div className="home-container">
      <Header onSearch={handleSearch} />
      
      {!searchResults && (
        <>
          {storiesLoading && <p className="loading-text">Loading stories...</p>}
          {storiesFailure && (
            <button
              onClick={fetchStories}
              className="retry-btn"
            >
              Retry Stories
            </button>
          )}
          {!storiesLoading && !storiesFailure && stories.length > 0 && (
            <UserStories stories={stories} />
          )}
        </>
      )}

      {searchResults !== null && searchResults.length === 0 && (
        <div className="search-not-found">
          <img
            src="/search-not-found.svg"
            alt="search not found"
          />
          <p>No posts found for your search</p>
        </div>
      )}

      <PostsList
        posts={displayPosts}
        isLoading={postsLoading}
        isFailure={postsFailure}
        onRetry={searchResults !== null ? () => handleSearch('') : fetchPosts}
        onLikeChange={handleLikeChange}
        onAddComment={handleAddComment}
      />
    </div>
  )
}

export default Home
