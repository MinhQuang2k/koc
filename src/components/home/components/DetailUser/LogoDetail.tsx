import React from 'react'
import { observer } from 'mobx-react'
import Link from 'next/link'

const LogoDetail = () => {
  return (
    <div className="logo-detail">
      <Link href="/">
        <a>
          <img
            className="img-detail"
            src={'/static/images/logo.png'}
            alt="KOC-Megapont"
          />
        </a>
      </Link>
    </div>
  )
}

export default observer(LogoDetail)
