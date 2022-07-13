import React, { FC } from 'react'
import { observer } from 'mobx-react'

interface PromotionCodeProps {
  store?: any
}

const PromotionCode: FC<PromotionCodeProps> = (props: PromotionCodeProps) => {
  const {} = props

  return (
    <React.Fragment>
      <div className="c-payment-form1__item1">
        <div className="form-group">
          <input
            className="form-control"
            placeholder="Nhập mã giảm giá, mã ưu đãi"
          />
          <a href="/#">
            <img src="/static/images/scan-qr.png" />
          </a>
        </div>
      </div>
    </React.Fragment>
  )
}

export default observer(PromotionCode)
