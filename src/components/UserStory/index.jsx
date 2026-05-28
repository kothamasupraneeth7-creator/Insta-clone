import './index.css'

const UserStory = ({ story, onClick }) => {
  return (
    <button
      type="button"
      className="user-story-btn"
      onClick={onClick}
    >
      <img
        src={story.story_url}
        alt="user story"
        className="story-image"
      />
      <p className="story-username">{story.user_name}</p>
    </button>
  )
}

export default UserStory
