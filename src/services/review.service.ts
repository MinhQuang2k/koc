import {
  ListVideoParams,
  ListCategoryParams,
} from '@src/interfaces/dto/review.dto'
import request, { IApiResponse } from '@src/utils/request'

export function getListVideo<T>(
  params: ListVideoParams,
  token?: string
): Promise<IApiResponse<T>> {
  const url = `/video/list`
  if (token) {
    return request<T>({
      url,
      options: {
        method: 'post',
        data: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  }
  return request<T>({
    url,
    options: {
      method: 'post',
      data: params,
    },
  })
}

export function getListCategory<T>(
  params: ListCategoryParams,
  token?: string
): Promise<IApiResponse<T>> {
  const url = `/video-category/list`
  if (token) {
    return request<T>({
      url,
      options: {
        method: 'post',
        data: params || {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  }
  return request<T>({
    url,
    options: {
      method: 'post',
      data: params || {},
    },
  })
}
