import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import RootStore from '@src/stores/RootStore'
import PageLoading from '@src/helpers/PageLoading'
import ReviewStore from '@src/stores/review.store'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import { reaction, toJS } from 'mobx'
import isEqual from 'lodash/isEqual'

const DetailReview: React.FC<{
  reviewStore?: ReviewStore
  loading?: boolean
}> = ({ reviewStore, loading }) => {
  console.log(
    `🚀 ~ file: DetailReview.tsx ~ line 15 ~ reviewStore`,
    toJS(reviewStore)
  )
  const disposers = []
  const [toggleState, setToggleState] = useState(0)

  const filterCategory = ({ category }) => {
    setToggleState(category)
    reviewStore.setHasEnd({
      reviews: false,
    })
    reviewStore?.setParams({
      category,
    })
  }

  const handleLoadMore = React.useCallback(() => {
    reviewStore?.loadMore()
  }, [reviewStore.pagination])
  const hasMoreItems = reviewStore?.hasMoreItems
  console.log(
    `🚀 ~ file: DetailReview.tsx ~ line 36 ~ hasMoreItems`,
    hasMoreItems
  )
  const [lastElementRef] = useInfiniteScroll(
    hasMoreItems
      ? handleLoadMore
      : () => {
        if (reviewStore.hasEnd['reviews'] == false) {
          reviewStore.setHasEnd({
            ['reviews']: true,
          })
        }
      },
    loading
  )
  React.useEffect(() => {
    disposers.push(
      reaction(
        () => reviewStore.isChangeParams,
        (value: any, prevValue: any) => {
          if (isEqual(value, prevValue) === false) {
            reviewStore?.filter()
          }
        },
        {
          name: 'reviews_change_params',
        }
      )
    )
    return () => {
      disposers.forEach((disposer) => disposer())
    }
  }, [])
  React.useEffect(() => {
    if (!toggleState) {
      if (reviewStore?.categories && reviewStore?.categories.length > 0) {
        return filterCategory({ category: reviewStore?.categories[0]?.id })
      }
    }
  }, [])
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  });
  return (
    <>
      <div className="box-review">
        <div className="box-review-button">
          <Swiper slidesPerView={'auto'}>
            {reviewStore?.categories &&
              reviewStore?.categories.length > 0 &&
              reviewStore?.categories.map((category) => (
                <>
                  <SwiperSlide
                    key={category.id}
                  >
                    <button
                      className={toggleState === category.id ? 'tabs active-tabs' : 'tabs'
                      }
                      onClick={() => {
                        filterCategory({ category: category.id })
                      }}
                    >
                      {category.name}
                    </button>
                  </SwiperSlide>
                </>
              ))}
          </Swiper>
        </div>
        {reviewStore?.reviews.length <= 0 && !loading ? (
          'Không tìm thấy sản phẩm nào'
        ) : (
          <>
            {toggleState === 1 ? (
              <div className="box-review-list">
                {reviewStore?.reviews &&
                  reviewStore?.reviews.length > 0 &&
                  reviewStore?.reviews.map((item, idx) => (
                    <>
                      {item.category === toggleState
                        ? (
                          <div className="tiktok-video--item"
                            key={item.id}
                            ref={
                              reviewStore?.reviews.length == idx + 1 ? lastElementRef : null
                            }
                          >
                            <div className="tiktok-ratio">
                              <div className="tiktok-ratio-container">
                                <div className="tiktok-ratio-wrapper"
                                  dangerouslySetInnerHTML={{ __html: item.embed }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : null
                      }
                    </>
                  ))}
              </div>
            ) : (
              <div className="box-list-youtube">
                {reviewStore?.reviews &&
                  reviewStore?.reviews.length > 0 &&
                  reviewStore?.reviews.map((item, idx) => (
                    <>
                      {item.category === toggleState
                        ? (
                          <div className="video-item"
                            key={item.id}
                            ref={
                              reviewStore?.reviews.length == idx + 1 ? lastElementRef : null
                            }
                          >
                            <div className="video-container">
                              <div className="video-wrapper">
                                <div className="video-card">
                                  <div className="video-player"
                                    dangerouslySetInnerHTML={{ __html: item.embed }}
                                  >
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null
                      }
                    </>
                  ))}
              </div>
            )}
          </>
        )}
        {loading ? <PageLoading style={{ height: '150px' }} /> : null}
      </div>
    </>
  )
}

export default inject(({ store }: { store: RootStore }) => ({
  reviewStore: store.reviewStore,
  loading: store.loading,
}))(observer(DetailReview))
