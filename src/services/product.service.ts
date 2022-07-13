import {
  ListCategoryParams,
  ListProductTypeParams,
} from '@src/interfaces/dto/product.dto'
import request, { IApiResponse } from '@src/utils/request'

export function getProductTypeInfo<T>(
  productTypeId: number,
  token?: string
): Promise<IApiResponse<T>> {
  const url = `/v2/producttype/get-product-type-info`
  if (token) {
    return request<T>({
      url,
      options: {
        method: 'post',
        data: {
          productTypeId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  } else {
    return request<T>({
      url,
      options: {
        method: 'post',
        data: {
          productTypeId,
        },
      },
    })
  }
}

export function getListProductType<T>(
  params: ListProductTypeParams,
  token?: string
): Promise<IApiResponse<T>> {
  const url = `/v2/producttype/get-list-product-type`
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
  params: ListCategoryParams | undefined,
  token?: string
): Promise<IApiResponse<T>> {
  const url = `/category/get-list-category-of-koc`
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
      data: params ?? {},
    },
  })
}
