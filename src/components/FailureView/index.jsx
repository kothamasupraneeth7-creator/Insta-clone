import './index.css'

const FailureView = ({ onRetry, message }) => {
  const displayMessage = message || 'Something went wrong. Please try again.'

  return (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/delqquzzb/image/upload/v1779859274/Group_1_kcnzwc.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-message">{displayMessage}</p>
      <button onClick={onRetry} className="retry-btn">
        Try again
      </button>
    </div>
  )
}

export default FailureView
