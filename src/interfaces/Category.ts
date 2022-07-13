export interface Category {
  id: number
  name: string
  parentId?: number
  image?: string | Array<string>
  type?: string
  hotSequence?: boolean
  isHot?: boolean
}
