import { useState } from 'react'
import SlickSlider from 'react-slick'
import UserStory from '../UserStory'
import UserStoriesModal from '../UserStoriesModal'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'

const Slider = SlickSlider?.default ?? SlickSlider

const UserStories = ({ stories }) => {
  const [selectedStory, setSelectedStory] = useState(null)

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  }

  if (!stories || stories.length === 0) {
    return null
  }

  return (
    <>
      <div className="user-stories-container">
        <Slider {...settings}>
          {stories.map((story) => (
            <div key={story.user_id} className="story-item">
              <UserStory
                story={story}
                onClick={() => setSelectedStory(story)}
              />
            </div>
          ))}
        </Slider>
      </div>
      <UserStoriesModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </>
  )
}

export default UserStories
