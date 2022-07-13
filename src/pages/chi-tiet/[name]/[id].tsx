import React, { FC } from 'react'
import DetailFooter from '@src/components/home/components/DetailUser/DetailFooter'
import Page from '@src/components/detail/Page'
import { withServerSideProps } from '@src/helpers/wrapperProps'
import { GetServerSideProps } from 'next'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { ProductHydration } from '@src/stores/product.store'
import * as productServices from '@src/services/product.service'
import { Product } from '@src/interfaces/Product'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { getTokenCookie } from '@src/helpers/authCookies'
import withLayout from '@src/lib/withLayout'
import Layout from '@src/layouts'
import Link from 'next/link'

interface DetailPageProps {}

const DetailPage: FC<DetailPageProps> = (props: DetailPageProps) => {
  const {} = props
  return (
    <Layout>
      <div className="container-product">
        <header>
          <div className="logo">
            <Link href={`/`}>
              <a>
                <img src={'/static/images/logo.png'} alt="KOC-Megapont" />
              </a>
            </Link>
          </div>
        </header>
        <div className="main-detail">
          <Page />
        </div>
        <DetailFooter />
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = withServerSideProps(
  async function getServerSideProps({ query, req }) {
    const token = getTokenCookie(req)
    if (!token) {
      return {
        props: {},
      }
    }
    const hydrationData = {}
    let productStore: ProductHydration
    const resDetail = await productServices.getProductTypeInfo<
      ResponseType<Product>
    >(query.id, token)

    // init data here
    if (
      (resDetail && resDetail.status === HttpStatusCode.OK) ||
      resDetail.data?.code === 0
    ) {
      productStore = {
        detail: resDetail?.data?.data as Product,
      }
    }

    // hydrationData
    if (productStore) {
      Object.assign(hydrationData, { productStore })
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
  }
)

export default withLayout(DetailPage)
