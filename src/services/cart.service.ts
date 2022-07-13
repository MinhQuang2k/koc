import { OrderProductParams } from '@src/interfaces/dto/product.dto'
import request, { IApiResponse } from '@src/utils/request'

export function createOrderProduct<T>(
  data: OrderProductParams,
  token: string
): Promise<IApiResponse<T>> {
  return request<T>({
    url: '/order-koc/create-order',
    options: {
      method: 'post',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}
