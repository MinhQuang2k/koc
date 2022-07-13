import { action, observable, makeObservable } from 'mobx'
import { create } from 'mobx-persist'
import CartStore, { CartHydration } from './cart.store'
import AuthStore, { AuthHydration } from './auth.store'
import ModalStore, { ModalHydration } from './modal.store'
import ProductStore, { ProductHydration } from './product.store'
import ReviewStore, { ReviewHydration } from './review.store'

const isClient = typeof window !== 'undefined'
let hydrate
if (isClient) {
  hydrate = create({
    storage: localStorage,
    jsonify: true,
  })
}

export type RootStoreHydration = {
  loading?: boolean

  setLoader?: (loading: boolean) => void

  cartStore?: CartHydration
  authStore?: AuthHydration
  modalStore?: ModalHydration
  productStore?: ProductHydration
  reviewStore?: ReviewHydration
}

export default class RootStore {
  @observable loading = false
  cartStore: CartStore
  authStore: AuthStore
  modalStore: ModalStore
  productStore?: ProductStore
  reviewStore?: ReviewStore
  // sizeSwitcherStore: ReturnType<typeof sizeSwitcherStoreFactory>;

  constructor() {
    // this.sizeSwitcherStore = sizeSwitcherStoreFactory(this);
    this.cartStore = new CartStore(this)
    this.authStore = new AuthStore(this)
    this.modalStore = new ModalStore(this)
    this.productStore = new ProductStore(this)
    this.reviewStore = new ReviewStore(this)
    if (isClient) {
      hydrate('authStore', this.authStore).then(() =>
        console.warn('authStore hydrated')
      )
      hydrate('cartStore', this.cartStore).then(() =>
        console.warn('cartStore hydrated')
      )
    }
    makeObservable(this)
  }

  @action setLoader(_loading: boolean) {
    this.loading = _loading
  }

  @action hydrate(data: RootStoreHydration) {
    if (data.cartStore) {
      this.cartStore.hydrate(data.cartStore)
      if (isClient) {
        hydrate('cartStore', this.cartStore, data.cartStore).then(() =>
          console.warn('cartStore rehydrated')
        )
      }
    }
    if (data.authStore) {
      this.authStore.hydrate(data.authStore)
      if (isClient) {
        hydrate('authStore', this.authStore, data.authStore).then(() =>
          console.warn('authStore rehydrated')
        )
      }
    }
    if (data.modalStore) {
      this.modalStore.hydrate(data.modalStore)
    }
    if (data.productStore) {
      this.productStore.hydrate(data.productStore)
    }
    if (data.reviewStore) {
      this.reviewStore.hydrate(data.reviewStore)
    }
  }
}
