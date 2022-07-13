import { ListParam } from './common.dto'

export interface ListVideoParams extends ListParam {
  categoryId?: number
}

export interface ListCategoryParams extends ListParam {}
