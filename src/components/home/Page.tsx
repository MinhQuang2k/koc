import React, { FC } from 'react'
import DetailUser from '@src/components/home/components/DetailUser'

interface PageProps {}

const Page: FC<PageProps> = () => {
  return (
    <React.Fragment>
      <DetailUser />
    </React.Fragment>
  )
}

export default Page
