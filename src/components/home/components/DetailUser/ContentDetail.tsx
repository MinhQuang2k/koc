import React, { useState } from 'react'
import DetailReview from './DetailReview'
import DetailProduct from './DetailProduct'

const ContentDetail: React.FC = () => {
  const [toggleState, setToggleState] = useState(2)

  const toggleTab = (index) => {
    setToggleState(index)
  }
  return (
    <div className="content-detail">
      <ul className="nav">
        <li key={1}>
          <button
            className={toggleState === 1 ? 'tabs active-tabs' : 'tabs'}
            onClick={() => toggleTab(1)}
          >
            REVIEW NỔI BẬT
          </button>
        </li>
        <li key={2}>
          <button
            className={toggleState === 2 ? 'tabs active-tabs' : 'tabs'}
            onClick={() => toggleTab(2)}
          >
            SẢN PHẨM YÊU THÍCH
          </button>
        </li>
      </ul>
      <div
        className={toggleState === 1 ? 'content  active-content' : 'content'}
      >
        <DetailReview />
      </div>
      <div
        className={toggleState === 2 ? 'content  active-content' : 'content'}
      >
        <DetailProduct />
      </div>
    </div>
  )
}

export default ContentDetail
