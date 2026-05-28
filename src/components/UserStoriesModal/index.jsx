import './index.css'

const UserStoriesModal = ({ story, onClose }) => {
  if (!story) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>
          ×
        </button>
        <img src={story.story_url} alt="user story" className="modal-image" />
        <div className="modal-info">
          <p className="modal-username">{story.user_name}</p>
        </div>
      </div>
    </div>
  )
}

export default UserStoriesModal
