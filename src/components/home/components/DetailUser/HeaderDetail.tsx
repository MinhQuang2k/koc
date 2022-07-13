import AuthStore from '@src/stores/auth.store'
import RootStore from '@src/stores/RootStore'
import { inject, observer } from 'mobx-react'
import React from 'react'

const HeaderDetail: React.FC<{
  authStore?: AuthStore
}> = ({ authStore }) => {
  const { auth } = authStore
  return (
    <div className="header-detail">
      <div className="box-detail">
        <div className="box-detail-left">
          <div className="prf-img">
            <img
              className="rounded-circle"
              src={auth?.avatar ?? ''}
              alt={auth?.name ?? ''}
            />
          </div>
        </div>
        <div className="box-detail-middle">
          <div className="box-info">
            <span className="box-nick-name">{auth?.name ?? ''}</span>

            <div
              className="box-description"
              dangerouslySetInnerHTML={{ __html: `${auth?.description ?? ''}` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject(({ store }: { store: RootStore }) => ({
  authStore: store.authStore,
}))(observer(HeaderDetail))
