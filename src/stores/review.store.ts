import { action, observable, makeObservable, flow, computed } from 'mobx'
import clone from 'lodash/clone'
import omit from 'lodash/omit'
import RootStore from './RootStore'
import * as reviewServices from '@src/services/review.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { CategoryReview, Review } from '@src/interfaces/Review'
import {
  ListCategoryParams,
  ListVideoParams,
} from '@src/interfaces/dto/review.dto'
import Config from '@src/contains/Config'
import { IApiResponse } from '@src/utils/request'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import { wait } from '@src/helpers/wait'
import { DEFAULT_ERROR_MESSAGE } from '@src/contains/contants'
import { Category } from '@src/interfaces/Category'

export type ReviewHydration = {
  reviews?: Array<Review>
  categories?: Array<CategoryReview>
  pagination?: IPagination
  params?: Record<string, any>
  hasMoreItems?: boolean
  hasEnd?: {
    reviews: boolean
  }
  isChangeParams?: any

  setReviews?: (_data: Array<Review>) => void
  setCategoies?: (_data: Array<CategoryReview>) => void
  setPagination?: (_data: IPagination) => void
  setParams?: (_data: Record<string, any>) => void
  setHasEnd?: (_data: { reviews?: boolean }) => void

  getListReviews?: (params: ListVideoParams) => Promise<any>
  getListCategories?: (params: ListCategoryParams) => Promise<any>
  loadMore?: () => void
  filter?: () => void
}

export default class ReviewStore {
  @observable state = 'pending'
  @observable root: RootStore
  // ds review
  @observable reviews: Array<Review> = []
  // ds danh muc
  @observable categories: Array<CategoryReview> = []
  @observable pagination: IPagination = {
    skip: 0,
    page: 1,
    limit: Config.PAGE_SIZE,
    totalPage: 0,
    total: 0,
    loadMore: false,
  }
  @observable hasEnd: {
    reviews: boolean
  } = {
    reviews: false,
  }
  @observable params: Record<string, any> = {}

  constructor(root: RootStore) {
    this.root = root
    makeObservable(this)
  }

  @action setReviews(_data: Array<Review>) {
    this.reviews = _data
  }

  @action setCategories(_data: Array<CategoryReview>) {
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
    if (_params.fromPoint == '*' && _params.toPoint == '*') {
      _params = omit(_params, ['fromPoint', 'toPoint'])
    }
    this.params = _params
  }

  @action setHasEnd(_data: { reviews?: boolean }) {
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
      const _params: ListVideoParams = {
        ...this.params,
        skip:
          (this.pagination.skip + this.pagination.limit) *
          this.pagination.page++,
        limit: this.pagination.limit,
      }
      await wait(1500)
      this.getListReview(_params)
    } else {
      this.setHasEnd({
        reviews: true,
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
    const _params: ListVideoParams = {
      ...this.params,
      skip: 0,
      limit: this.pagination.limit,
    }
    await wait(1500)
    this.getListReview(_params)
  }

  @flow *getListReview(params: ListVideoParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const res: IApiResponse<ResponseType<Review[]>> =
        yield reviewServices.getListVideo(params, this.root.authStore.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.reviews = res.data?.data as Review[]
        } else {
          this.reviews = [
            ...this.reviews,
            ...((res.data?.data as Review[]) ?? []),
          ]
        }
        if (res.data?.data?.length == 0) {
          if (this.hasEnd['reviews'] == false) {
            this.setHasEnd({
              reviews: true,
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
        yield reviewServices.getListCategory(params, this.root.authStore.token)
      this.state = 'done'
      this.root.loading = false
      if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
        this.caculateParams(res.data?.total ?? 0)
        if (!this.pagination.loadMore) {
          this.categories = res.data?.data as CategoryReview[]
        } else {
          this.categories = [
            ...this.categories,
            ...((res.data?.data as CategoryReview[]) ?? []),
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

  @action hydrate(data?: ReviewHydration) {
    if (data && data.reviews) {
      this.reviews = data.reviews
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
