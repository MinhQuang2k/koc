export interface Product {
  id: number
  name: string
  avatar?: string | Array<string>
  createdAt: number
  updatedAt: number
  itemId?: number
  categoryId?: number
  subCategoryId?: number
  description?: string
  isActive?: boolean
  thumbnail?: string
  payment?: string
  paymentCash?: number
  originPrice?: number
  trademark?: string
  storeId?: number
  tags?: string
  campaignId?: number
  valueAccumulatePoints?: number
  percentAccumlatePoints?: number
  accumlatePointType?: string
  isApprove?: boolean
  weight?: number
  discountRate?: number
  note?: string
  productTypeIdRef?: number
  purchased?: number
  total?: number
  images?: Array<string>
  productId?: number
}
