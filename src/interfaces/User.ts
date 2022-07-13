import { GENDER } from './enums'

export interface IUserResponse {
  code: number
  message: number
  data: {
    userInfo: User
    token?: string
  }
}

export interface User {
  id: number
  name: string
  avatar?: string
  address?: string
  birth?: number
  codeCount?: number
  contact?: number
  createdAt: 1634288570437
  email?: string
  exchangeId?: string
  gender?: GENDER
  phone?: string
  point?: number
  tierId?: number
  updatedAt?: number
  vndAccno?: Array<Record<string, any>>
  vndCustId?: string
  vndUsername?: string
  provinceId?: number
  districtId?: number
  wardId?: number
  domainKOC?: string
  description?: string
}
