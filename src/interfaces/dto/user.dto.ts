import { TRANSACTION_TYPE } from '../enums'
import { ListParam } from './common.dto'

export interface CumstomerInfoParams extends Record<string, any> {
  name?: string
  email?: string
  birth?: string | number
  gender?: string | number
  address?: string
  avatar?: string
  provinceId?: string | number
  districtId?: string | number
  wardId?: string | number
  contact?: string
}

export interface HistoryTransactionParams extends ListParam {
  /**
    @params type accumulate or exchange
    @description loại accumulate: tích điểm, exchange: đổi điểm
  */
  type?: TRANSACTION_TYPE
  fromTime?: number
  toTime?: number
}

export interface HistoryTransactionAcumulateParams
  extends Omit<HistoryTransactionParams, 'type'> {}

export interface TransferPointParams {
  receiveId: number
  point: number
  description: string
}

export interface HistoryPointTranferParams extends ListParam {}

export interface ITranferObject extends Record<string, any> {
  receiver?: Record<string, any>
  receiveId?: number
  phone?: string
  point?: number
  description?: string
}
