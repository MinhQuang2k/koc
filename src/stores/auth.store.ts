import { action, observable, makeObservable, computed } from 'mobx'
import { persist } from 'mobx-persist'
import RootStore from './RootStore'

export type AuthHydration = {
  state?: string
  token?: string
  auth?: any

  setToken?: (value: string) => void
  setAuth?: (data: { token?: string; auth: any }) => void
}

export default class AuthStore {
  @observable state = 'pending'
  @observable root: RootStore
  @persist @observable token = null
  @persist('object') @observable auth = null

  constructor(root: RootStore) {
    this.root = root
    makeObservable(this)
  }

  @computed get isChangedToken() {
    return this.token == null
  }

  @action setToken(value: string) {
    this.token = value
  }

  @action setAuth(data: { token?: string; auth: any }) {
    if (data.token) {
      this.token = data.token
    }
    this.auth = data.auth
  }

  @action hydrate(data?: AuthHydration) {
    if (data && data.token) {
      this.token = data.token
    }
    if (data && data.auth) {
      this.auth = data.auth
    }
  }
}
