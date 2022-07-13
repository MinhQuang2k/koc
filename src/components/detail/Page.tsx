import React, { FC, useState, useEffect } from 'react'
import province from '@src/helpers/dataMap/province.json'
import district from '@src/helpers/dataMap/district.json'
import ward from '@src/helpers/dataMap/ward.json'
import { toastUtil } from '@src/helpers/Toast'
import { inject, observer } from 'mobx-react'
import { RootStoreHydration } from '@src/stores/RootStore'
import { ProductHydration } from '@src/stores/product.store'
import { flowResult, toJS } from 'mobx'
import CartStore from '@src/stores/cart.store'
import numeral from 'numeral'
import { OrderProductParams } from '@src/interfaces/dto/product.dto'
import get from 'lodash/get'

const provincelist = province.RECORDS
const districtlistAll = district.RECORDS
const wardlistAll = ward.RECORDS

interface DetailProductProps {
  productStore?: ProductHydration
  cartStore?: CartStore
}

const DetailProduct: FC<DetailProductProps> = (props: DetailProductProps) => {
  const { productStore, cartStore } = props
  console.log(
    `🚀 ~ file: Page.tsx ~ line 21 ~ productStore`,
    toJS(productStore)
  )
  const product = productStore?.detail

  const [quantity, setQuantity] = useState<number>(1)
  const [nameCustomer, setNameCustomer] = useState<string>('')
  const [phoneCustomer, setPhoneCustomer] = useState<string>('')
  const [addressCustomer, setAddressCustomer] = useState<string>('')
  const [emailCustomer, setEmailCustomer] = useState<string>('')
  const [provinceIdUpdate, setProvinceIdUpdate] = useState<number>(0)
  const [districtIdUpdate, setDistrictIdUpdate] = useState<number>(0)
  const [wardIdUpdate, setWardIdUpdate] = useState<number>(0)
  const [districtListUpdate, setDistrictListUpdate] = useState([])
  const [wardListUpdate, setWardListUpdate] = useState([])

  const changeQuantity = (val: number) => {
    setQuantity((prev) => {
      if (prev + val <= 0) {
        return 1
      }
      return prev + val
    })
  }

  const updateNameCustomer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setNameCustomer(val)
  }

  const updatePhoneCustomer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setPhoneCustomer(val)
  }

  const updateAddressCustomer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAddressCustomer(val)
  }

  const updateEmailCustomer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setEmailCustomer(val)
  }

  useEffect(() => {
    const listDistrict = districtlistAll
      .filter((item) => parseInt(item.province) === provinceIdUpdate)
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      )
    setDistrictListUpdate(listDistrict)
  }, [provinceIdUpdate])

  useEffect(() => {
    const listWard = wardlistAll
      .filter((item) => parseInt(item.district) === districtIdUpdate)
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      )
    setWardListUpdate(listWard)
  }, [districtIdUpdate])

  const handleProvinceUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setProvinceIdUpdate(parseInt(val))
    setDistrictIdUpdate(0)
    setWardIdUpdate(0)
  }

  const handleDistrictUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setDistrictIdUpdate(parseInt(val))
    setWardIdUpdate(0)
  }

  const handleWardUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setWardIdUpdate(parseInt(val))
  }

  const checkout = async () => {
    if (
      nameCustomer == '' ||
      emailCustomer == '' ||
      phoneCustomer == '' ||
      addressCustomer == '' ||
      provinceIdUpdate == 0 ||
      districtIdUpdate == 0 ||
      wardIdUpdate == 0
    ) {
      console.error('error')
      toastUtil.warning('Vui lòng cập nhập thông tin người dùng')
    } else {
      const params: OrderProductParams = {
        receiveEmail: emailCustomer,
        receivePhone: phoneCustomer,
        receiveName: nameCustomer,
        provinceId: provinceIdUpdate,
        districtId: districtIdUpdate,
        wardId: wardIdUpdate,
        address: addressCustomer,
        listOrderItems: [
          {
            type: 'product',
            typeId: product.productId,
            quantity,
          },
        ],
        phone: phoneCustomer,
      }
      console.log(`🚀 ~ file: Page.tsx ~ line 135 ~ checkout ~ params`, params)
      const resOrder = await flowResult<any>(cartStore.checkout(params))
      if (resOrder && resOrder.errorCode) {
        toastUtil.error(
          resOrder.message || 'Đã có lỗi xảy ra. Vui lòng thực hiện lại sau!'
        )
      } else {
        toastUtil.success('BẠN ĐÃ ĐẶT HÀNG THÀNH CÔNG')
      }
    }
  }

  return (
    <React.Fragment>
      <div className="wrapper-product">
        <div className="title-order">
          <span>Thông tin sản phẩm</span>
        </div>
        <div className="wrapper-body">
          <div className="product-order">
            <div className="product-left">
              <img
                src={get(product, 'images[0]', '') ?? ''}
                alt={get(product, 'images[0]', '') ?? ''}
              />
            </div>
            <div className="hr-center"></div>
            <div className="product-right">
              <div className="product-title">
                <span>{product.name ?? ''}</span>
              </div>
              <div className="product-info">
                <p>{product.description ?? ''}</p>
              </div>
              <div className="product-group">
                <div className="product-quantity">
                  <p>Số lượng</p>
                  <div className="group-input">
                    <button
                      className="remove-product"
                      onClick={() => {
                        changeQuantity(-1)
                      }}
                    >
                      <img src={'/static/images/icons-remove.svg'} alt="" />
                    </button>
                    <div className="number-product">
                      <span>{quantity}</span>
                    </div>
                    <button
                      className="add-product"
                      onClick={() => {
                        changeQuantity(1)
                      }}
                    >
                      <img src={'/static/images/icons-add.svg'} alt="" />
                    </button>
                  </div>
                </div>
                <div className="group-price">
                  <div className="unit-price">
                    <span>Đơn giá</span>
                    <span>
                      {numeral(product.originPrice).format('#,#')} VNĐ
                    </span>
                  </div>
                  <div className="total-price">
                    <span>Thành tiền</span>
                    <span>
                      {numeral(product.originPrice * quantity).format('#,#')}{' '}
                      VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="c-info-user">
            <div className="c-wrapper-info">
              <div className="c-title-info-user">
                <span>Thông tin người dùng</span>
              </div>
              <ul>
                <li>
                  <div className="c-info-name">
                    <span>Họ Tên:</span>
                    <div className="c-group-err">
                      <input
                        type="text"
                        placeholder="Nhập tên"
                        value={nameCustomer}
                        onChange={updateNameCustomer}
                        required
                      />
                    </div>
                  </div>
                </li>
                <li>
                  <div className="c-info-phone">
                    <span>Số điện thoại:</span>
                    <div className="c-group-err">
                      <input
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={phoneCustomer}
                        onChange={updatePhoneCustomer}
                        required
                      />
                    </div>
                  </div>
                </li>
                <li>
                  <div className="group-address">
                    <div className="c-form-group">
                      <label className="c-name-address">Tỉnh /TP:</label>
                      <div className="c-select-address">
                        <span>
                          <img src={'/static/images/nav-down.png'} alt="" />
                        </span>
                        <select
                          value={provinceIdUpdate}
                          onChange={handleProvinceUpdate}
                          className="c-form-control"
                        >
                          <option value={0}>Tỉnh/Thành phố</option>
                          {provincelist.map((s) => (
                            <option key={parseInt(s.id, 10)} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="c-form-group">
                      <label className="c-name-address">Quận/ huyện:</label>
                      <div className="c-select-address">
                        <span>
                          <img src={'/static/images/nav-down.png'} alt="" />
                        </span>
                        <select
                          value={districtIdUpdate}
                          onChange={handleDistrictUpdate}
                          className="c-form-control"
                        >
                          <option value={0}>Quận/Huyện</option>
                          {districtListUpdate.map((s) => (
                            <option key={parseInt(s.id, 10)} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="c-form-group">
                      <label className="c-name-address">Phường/ xã:</label>

                      <div className="c-select-address">
                        <span>
                          <img src={'/static/images/nav-down.png'} alt="" />
                        </span>
                        <select
                          value={wardIdUpdate}
                          onChange={handleWardUpdate}
                          className="c-form-control"
                        >
                          <option value={0}>Phường/Xã</option>
                          {wardListUpdate.map((s) => (
                            <option key={parseInt(s.id, 10)} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="c-info-address">
                    <span>Địa chỉ:</span>
                    <div className="c-group-err">
                      <input
                        type="text"
                        placeholder="Nhập địa chỉ"
                        value={addressCustomer}
                        onChange={updateAddressCustomer}
                        required
                      />
                    </div>
                  </div>
                </li>
                <li>
                  <div className="c-info-email">
                    <span>E-mail: </span>
                    <div className="group-err">
                      <input
                        type="email"
                        placeholder="Điền email để kiểm tra tình trạng đơn hàng"
                        value={emailCustomer}
                        onChange={updateEmailCustomer}
                        required
                      />
                    </div>
                  </div>
                </li>
              </ul>
              <div className="order-button">
                <button onClick={checkout}>Đặt hàng</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }: { store: RootStoreHydration }) => ({
  productStore: store?.productStore,
  cartStore: store?.cartStore,
  loading: store.loading,
}))(observer(DetailProduct))
