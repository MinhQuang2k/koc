export interface Review {
  id: number
  name: string
  createdAt: number
  updatedAt: number
  thumbnai?: string | Array<string>
  user: number
  // '<iframe width="560" height="315" src="https://www.youtube.com/embed/TYFoCf51Ets" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
  embed: string
  category: number
  active: boolean
}

export interface CategoryReview {
  createdAt: number
  updatedAt: number
  id: number
  name: string
  active: boolean
}
