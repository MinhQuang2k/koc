import React, { FC } from 'react'
import { ToastContainer } from '@src/helpers/Toast'

interface LayoutProps {
  children: React.ReactChild
}

const Layout: FC<LayoutProps> = (props: LayoutProps) => {
  return (
    <React.Fragment>
      {props.children}
      <ToastContainer />
    </React.Fragment>
  )
}

export default Layout
