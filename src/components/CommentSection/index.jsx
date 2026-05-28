import './index.css'

const CommentSection = props => {
  const {comments = []} = props

  return (
    <ul className="comment-section-list">
      {comments.map(eachComment => (
        <li className="comment-section-item" key={eachComment.user_id}>
          <p className="comment-section-text">
            <span className="comment-section-username">
              {eachComment.user_name}{' '}
            </span>
            {eachComment.comment}
          </p>
        </li>
      ))}
    </ul>
  )
}

export default CommentSection
