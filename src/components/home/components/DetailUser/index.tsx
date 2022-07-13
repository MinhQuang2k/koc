import React from 'react'
import LogoDetail from './LogoDetail'
import HeaderDetail from './HeaderDetail'
import ContentDetail from './ContentDetail'
import DetailFooter from './DetailFooter'

interface DetailUserProps {}

const DetailUser: React.FC<DetailUserProps> = () => {
  return (
    <React.Fragment>
      <div className="container-detail">
        <div className="wrapper-detail">
          <LogoDetail />
          <div className="body-detail">
            <HeaderDetail />
            <ContentDetail />
          </div>
        </div>
        <DetailFooter />
      </div>
    </React.Fragment>
  )
}

export default DetailUser
