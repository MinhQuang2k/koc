import { action, observable, makeObservable, flow, computed } from 'mobx'
import clone from 'lodash/clone'
import omit from 'lodash/omit'
import RootStore from './RootStore'
import * as productServices from '@src/services/product.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { Product } from '@src/interfaces/Product'
import {
  ListCategoryParams,
  ListProductTypeParams,
} from '@src/interfaces/dto/product.dto'
import Config from '@src/contains/Config'
import { IApiResponse } from '@src/utils/request'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import { wait } from '@src/helpers/wait'
import { DEFAULT_ERROR_MESSAGE } from '@src/contains/contants'
import { Category } from '@src/interfaces/Category'

export type ProductHydration = {
  detail?: Product
  products?: Array<Product>
  categories?: Array<Product>
  pagination?: IPagination
  params?: Record<string, any>
  hasMoreItems?: boolean
  hasEnd?: {
    products: boolean
  }
  isChangeParams?: any

  setProducts?: (_data: Array<Product>) => void
  setCategoies?: (_data: Array<Product>) => void
  setPagination?: (_data: IPagination) => void
  setParams?: (_data: Record<string, any>) => void
  setHasEnd?: (_data: { products?: boolean }) => void

  getListProducts?: (params: ListProductTypeParams) => Promise<any>
  getListCategories?: (params: ListCategoryParams) => Promise<any>
  loadMore?: () => void
  filter?: () => void
}

export default class ProductStore {
  @observable state = 'pending'
  @observable root: RootStore
  // ds san pham
  @observable products: Array<Product> = []
  // ưu đãi hot nhat
  @observable categories: Array<Category> = []
  // chi tiet
  @observable detail: Product | unknown = {}
  @observable pagination: IPagination = {
    skip: 0,
    page: 1,
    limit: Config.PAGE_SIZE,
    totalPage: 0,
    total: 0,
    loadMore: false,
  }
  @observable hasEnd: {
    products: boolean
  } = {
    products: false,
  }
  @observable params: Record<string, any> = {}

  constructor(root: RootStore) {
    this.root = root
    makeObservable(this)
  }

  @action setProducts(_data: Array<Product>) {
    this.products = _data
  }

  @action setCategories(_data: Array<Category>) {
    this.categories = _data
  }

  @action setPagination(_data: IPagination) {
    const _pagination = clone(this.pagination)
    Object.assign(_pagination, _data)
    this.pagination = _pagination
  }

  @action setParams(_data: Record<string, any>) {
    let _params = clone(this.params)
    Object.assign(_params, _data)
    if (_params.categoryId == 0) {
      _params = omit(_params, ['categoryId'])
    }
    this.params = _params
  }

  @action setHasEnd(_data: { products?: boolean }) {
    const _hasEnd = clone(this.hasEnd)
    Object.assign(_hasEnd, _data)
    this.hasEnd = _hasEnd
  }

  @computed get isChangeParams() {
    return this.params
  }

  @computed get hasMoreItems() {
    return this.pagination.totalPage >= this.pagination.page + 1
  }

  @action async loadMore() {
    this.root.loading = true
    this.setPagination({
      loadMore: true,
    })
    if (this.pagination.totalPage >= this.pagination.page + 1) {
      const _params: ListProductTypeParams = {
        ...this.params,
        skip:
          (this.pagination.skip + this.pagination.limit) *
          this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(1500)
      this.getListProduct(_params)
    } else {
      this.setHasEnd({
        products: true,
      })
    }
  }

  @action async filter() {
    this.root.loading = true
    this.setPagination({
      skip: 0,
      page: 1,
      loadMore: false,
    })
    const _params: ListProductTypeParams = {
      ...this.params,
      skip: 0,
      limit: this.pagination.limit,
    }
    await wait(1500)
    this.getListProduct(_params)
  }

  @flow *getListProduct(params: ListProductTypeParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res: IApiResponse<ResponseType<Product[]>> =
        yield productServices.getListProductType(
          params,
          this.root.authStore.token
        )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.products = res.data?.data as Product[]
        } else {
          this.products = [
            ...this.products,
            ...((res.data?.data as Product[]) ?? []),
          ]
        }
        if (res.data?.data?.length == 0) {
          if (this.hasEnd['products'] == false) {
            this.setHasEnd({
              products: true,
            })
          }
        }
        return res.data
      }
      return {
        errorCode: res?.data?.code || HttpStatusCode.UNKNOW_ERROR,
        message: res?.data?.message || DEFAULT_ERROR_MESSAGE,
      }
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *getListCaretories(params: ListCategoryParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res: IApiResponse<ResponseType<Category[]>> =
        yield productServices.getListCategory(params, this.root.authStore.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.categories = res.data?.data as Category[]
        } else {
          this.categories = [
            ...this.categories,
            ...((res.data?.data as Category[]) ?? []),
          ]
        }
        return res.data
      }
      return {
        errorCode: res?.data?.code || HttpStatusCode.UNKNOW_ERROR,
        message: res?.data?.message || DEFAULT_ERROR_MESSAGE,
      }
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *getProductInfo(productId: number) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res = yield productServices.getProductTypeInfo<Product>(
        productId,
        this.root.authStore.token
      )
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.detail = res.data?.data
        return res.data
      }
      return {
        errorCode: res?.data?.code || HttpStatusCode.UNKNOW_ERROR,
        message: res?.data?.message || DEFAULT_ERROR_MESSAGE,
      }
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @action hydrate(data?: ProductHydration) {
    if (data && data.detail) {
      this.detail = data.detail
    }
    if (data && data.products) {
      this.products = data.products
    }
    if (data && data.categories) {
      this.categories = data.categories
    }
    if (data && data.pagination) {
      const _pagination = clone(this.pagination)
      this.pagination = {
        ..._pagination,
        ...data.pagination,
        totalPage: Math.floor(
          ((data.pagination?.total ?? 0) + _pagination.limit - 1) /
            _pagination.limit
        ),
      }
    }
  }

  private caculateParams(total: number) {
    const _pagination = clone(this.pagination)
    this.pagination = {
      ..._pagination,
      total,
      totalPage: Math.floor(
        (total + _pagination.limit - 1) / _pagination.limit
      ),
    }
  }
}
