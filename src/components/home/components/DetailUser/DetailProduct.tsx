import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import get from 'lodash/get'
import Link from 'next/link'
import { encodeUrl } from '@src/utils'
import { inject, observer } from 'mobx-react'
import RootStore from '@src/stores/RootStore'
import PageLoading from '@src/helpers/PageLoading'
import ProductStore from '@src/stores/product.store'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import { reaction, toJS } from 'mobx'
import isEqual from 'lodash/isEqual'

const DetailProduct: React.FC<{
  productStore?: ProductStore
  loading?: boolean
}> = ({ productStore, loading }) => {
  console.log(
    `🚀 ~ file: DetailProduct.tsx ~ line 18 ~ productStore`,
    toJS(productStore)
  )
  const disposers = []
  const [toggleState, setToggleState] = useState(0)

  const filterCategory = ({ categoryId }) => {
    setToggleState(categoryId)
    productStore.setHasEnd({
      products: false,
    })
    productStore?.setParams({
      categoryId,
    })
  }

  const handleLoadMore = React.useCallback(() => {
    productStore?.loadMore()
  }, [productStore.pagination])
  const hasMoreItems = productStore?.hasMoreItems
  console.log(
    `🚀 ~ file: DetailProduct.tsx ~ line 39 ~ hasMoreItems`,
    hasMoreItems
  )
  const [lastElementRef] = useInfiniteScroll(
    hasMoreItems
      ? handleLoadMore
      : () => {
        if (productStore.hasEnd['products'] == false) {
          productStore.setHasEnd({
            ['products']: true,
          })
        }
      },
    loading
  )

  React.useEffect(() => {
    disposers.push(
      reaction(
        () => productStore.isChangeParams,
        (value: any, prevValue: any) => {
          if (isEqual(value, prevValue) === false) {
            productStore?.filter()
          }
        },
        {
          name: 'products_change_params',
        }
      )
    )
    return () => {
      disposers.forEach((disposer) => disposer())
    }
  }, [])

  return (
    <React.Fragment>
      <div className="box-product">
        <Swiper slidesPerView={'auto'}>
          <SwiperSlide key={0}>
            <button
              className={toggleState === 0 ? 'tabs active-tabs' : 'tabs'}
              onClick={() => filterCategory({ categoryId: 0 })}
            >
              {`TẤT CẢ`}
            </button>
          </SwiperSlide>
          {productStore?.categories &&
            productStore?.categories.length > 0 &&
            productStore?.categories.map((category) => (
              <>
                <SwiperSlide key={category.id}>
                  <button
                    className={
                      toggleState === category.id ? 'tabs active-tabs' : 'tabs'
                    }
                    onClick={() => {
                      filterCategory({ categoryId: category.id })
                    }}
                  >
                    {category.name}
                  </button>
                </SwiperSlide>
              </>
            ))}
        </Swiper>
      </div>
      {productStore?.products.length <= 0 && !loading ? (
        'Không tìm thấy sản phẩm nào'
      ) : (
        <div className="box-product-list">
          {productStore?.products.map((item, idx) => (
            <div
              className="box-product-items"
              key={`${encodeUrl(item.name)}-${item.id}`}
              ref={
                productStore?.products.length == idx + 1 ? lastElementRef : null
              }
            >
              <Link href={'/chi-tiet/' + encodeUrl(item.name) + '/' + item.id}>
                <a>
                  <div className="box-items-body">
                    <div className="box-item-image">
                      <img
                        src={get(item, 'images.[0]', '') ?? ''}
                        alt={item.name}
                      />
                      <div className="box-items-footer"></div>
                    </div>
                  </div>
                  <div className="box-items-title">
                    <div className="title">{item.name}</div>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
      {loading ? <PageLoading style={{ height: '150px' }} /> : null}
    </React.Fragment>
  )
}

export default inject(({ store }: { store: RootStore }) => ({
  productStore: store.productStore,
  loading: store.loading,
}))(observer(DetailProduct))
