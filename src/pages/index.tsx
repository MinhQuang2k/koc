import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import Page from '@src/components/home/Page'
import { IUserResponse } from '@src/interfaces/User'
import HttpStatusCode from '@src/contains/HttpStatusCode'
// import Modal from '@src/components/common/Modal'
import get from 'lodash/get'

import * as userServices from '@src/services/user.service'
import * as productServices from '@src/services/product.service'
import * as reviewServices from '@src/services/review.service'
import { AuthHydration } from '@src/stores/auth.store'
import { ProductHydration } from '@src/stores/product.store'
import { Product } from '@src/interfaces/Product'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { Category } from '@src/interfaces/Category'
import { removeTokenCookie, setTokenCookie } from '@src/helpers/authCookies'
import { ReviewHydration } from '@src/stores/review.store'
import { CategoryReview, Review } from '@src/interfaces/Review'
import FileHelper from '@src/helpers/fileHelper'
import dayjs from 'dayjs'
import { reaction } from 'mobx'
import { inject, observer } from 'mobx-react'
import RootStore from '@src/stores/RootStore'
interface IndexProps {
  store?: RootStore
  isNodomain?: boolean
}

const Index: React.FC<IndexProps> = ({ store, isNodomain }) => {
  const disposers = []

  useEffect(() => {
    reaction(
      () => {
        return store?.authStore?.isChangedToken
      },
      (tokenNull: any) => {
        console.log(
          `🚀 ~ file: index.tsx ~ line 42 ~ useEffect ~ tokenNull`,
          tokenNull
        )
        if (tokenNull) {
          store?.authStore?.setAuth({ auth: null })
        }
      },
      {
        delay: 0,
      }
    )
    return () => {
      disposers.forEach((disposer) => disposer())
    }
  }, [])

  if (isNodomain) {
    return (
      <>
        <h1>Trang này không tồn tại</h1>
      </>
    )
  }
  return (
    <Layout>
      <>
        <Helmet
          title="Trang chủ"
          url={`${Config.publicRuntimeConfig.BASE_URL}`}
          image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
        // keywords=""
        // descriptions=""
        />
        <Page />
        {/* <Modal /> */}
      </>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps =
  async function getServerSideProps(ctx: any) {
    try {
      const { req, res, resolvedUrl, ...rest } = ctx
      console.log(
        `🚀 ~ file: index.tsx ~ getServerSideProps ~ req.headers`,
        req.headers
      )
      let { host } = req.headers
      if (host == 'localhost:13017') {
        host = 'truong123-koc.mpoint.vn'
      }
      // const regexDomain = /([^*]+).mpoint.vn?:?([0-9]+)/
      const regexDomain = /([^*]+)-koc.mpoint.vn/
      const arrDomainReg = host.match(regexDomain)
      const subDomain = get(arrDomainReg, '[1]', '') ?? ''
      FileHelper.writeJson({
        outputFile: `${dayjs().format('YYYYMMDD').toString()}.json`,
        dataJson: {
          headers: req.headers,
          rawHeaders: req.rawHeaders,
          arrDomainReg,
          subDomain,
          resolvedUrl,
          ...rest,
        },
      }).catch((err) => {
        console.error(`🚀 ~ FileHelper.writeJson ~ err`, err)
      })
      if (
        !arrDomainReg ||
        !arrDomainReg[1] ||
        !subDomain ||
        subDomain == '' ||
        subDomain.split('-').length <= 0
      ) {
        return {
          props: {
            isNodomain: true,
            hydrationData: {
              authStore: {
                token: null,
                auth: {},
              },
            },
          },
        }
      }

      const hydrationData = {}
      let authStore: AuthHydration
      let productStore: ProductHydration
      let reviewStore: ReviewHydration
      let token
      const resInfo = await userServices.getCustomerInfo<IUserResponse>(
        subDomain.split('-')[0] || ''
      )
      if (
        resInfo &&
        resInfo.status === HttpStatusCode.OK &&
        resInfo.data &&
        resInfo.data?.code === 0
      ) {
        token = resInfo.data?.data.token || ''
        setTokenCookie(res, token)
        authStore = {
          token,
          auth: resInfo.data?.data?.userInfo,
        }
        const resCateReview = await reviewServices.getListCategory<
          ResponseType<CategoryReview>
        >(
          {
            skip: 0,
            limit: 9999,
          },
          token
        )

        const resReviews = await reviewServices.getListVideo<
          ResponseType<Review>
        >(
          {
            skip: 0,
            limit: Config.PAGE_SIZE_HOMEPAGE,
          },
          token
        )
        const resCate = await productServices.getListCategory<
          ResponseType<Category>
        >(null, token)
        const resProducts = await productServices.getListProductType<
          ResponseType<Product>
        >(
          {
            skip: 0,
            limit: Config.PAGE_SIZE_HOMEPAGE,
          },
          token
        )
        // category review
        if (
          resCateReview &&
          resCateReview.status === HttpStatusCode.OK &&
          resCateReview.data &&
          resCateReview.data?.code === 0
        ) {
          reviewStore = {
            categories: resCateReview.data?.data as CategoryReview[],
          }
        }
        // reviews
        if (
          resReviews &&
          resReviews.status === HttpStatusCode.OK &&
          resReviews.data &&
          resReviews.data?.code === 0
        ) {
          if (reviewStore) {
            reviewStore = {
              ...reviewStore,
              reviews: resReviews.data?.data as Review[],
            }
          } else {
            reviewStore = {
              reviews: resReviews.data?.data as Review[],
            }
          }
        }
        // catgories product
        if (
          resCate &&
          resCate.status === HttpStatusCode.OK &&
          resCate.data &&
          resCate.data?.code === 0
        ) {
          productStore = {
            categories: resCate.data?.data as Product[],
          }
        }
        // products
        if (
          resProducts &&
          resProducts.status === HttpStatusCode.OK &&
          resProducts.data &&
          resProducts.data?.code === 0
        ) {
          if (productStore) {
            productStore = {
              ...productStore,
              products: resProducts.data?.data as Product[],
              pagination: {
                total: resProducts?.data?.total
                  ? Number(resProducts?.data?.total)
                  : 0,
              },
            }
          } else {
            productStore = {
              products: resProducts.data?.data as Product[],
              pagination: {
                total: resProducts?.data?.total
                  ? Number(resProducts?.data?.total)
                  : 0,
              },
            }
          }
        }
      } else {
        // reset cookie
        removeTokenCookie(res)
        authStore = {
          token: null,
          auth: null,
        }
      }
      if (authStore) {
        Object.assign(hydrationData, { authStore })
      }
      if (productStore) {
        Object.assign(hydrationData, { productStore })
      }
      if (reviewStore) {
        Object.assign(hydrationData, { reviewStore })
      }
      if (Object.keys(hydrationData).length > 0) {
        return {
          props: {
            hydrationData,
          },
        }
      }
      return {
        props: {},
      }
    } catch (error) {
      const path = require('path')
      FileHelper.writeJson({
        outputDir: path.resolve(process.cwd(), 'logs/error'),
        outputFile: `${dayjs().format('YYYYMMDD').toString()}.json`,
        dataJson: {
          error: error.message,
        },
      }).catch((err) => {
        console.error(`🚀 ~ FileHelper.writeJson ~ err`, err)
      })
      return {
        props: {},
      }
    }
  }

export default withLayout(inject('store')(observer(Index)))
