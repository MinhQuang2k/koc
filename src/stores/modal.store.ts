import { action, observable, makeObservable } from 'mobx'
import RootStore from './RootStore'

export type ModalHydration = {
  isShow?: boolean
  content?: string | JSX.Element
  setModal?: (params: {
    isShow: boolean
    content: string | JSX.Element | Record<string, unknown>
  }) => void
  setContent?: (_content: string | JSX.Element) => void
  setIsshow?: (value: boolean) => void
}

export default class ModalStore {
  @observable root: RootStore
  @observable isShow = false
  @observable content = null

  constructor(root: RootStore) {
    this.root = root
    makeObservable(this)
  }

  @action setModal({
    isShow,
    content,
  }: {
    isShow: boolean
    content: string | JSX.Element
  }) {
    this.isShow = isShow
    this.content = content
  }

  @action setContent(_content: string | JSX.Element) {
    this.content = _content
  }

  @action setIsshow(value: boolean) {
    this.isShow = value
  }

  @action hydrate(data?: ModalHydration) {
    if (data && data.isShow) {
      this.isShow = data.isShow
    }
    if (data && data.content) {
      this.content = data.content
    }
  }
}
