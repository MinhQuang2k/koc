import { ListParam } from './common.dto'

export interface ListProductTypeParams extends ListParam {
  categoryId?: number
}

export interface ListCategoryParams extends ListParam {}

export interface OrderProductParams {
  receiveName: string
  receivePhone: string
  receiveEmail: string
  provinceId: number
  districtId: number
  wardId: number
  address: string
  listOrderItems: Array<{
    type: 'product'
    typeId: number
    quantity: number
  }>
  phone?: string
}
