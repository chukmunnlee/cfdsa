export interface GameList {
  gid: number,
  name: string
}

export interface UserComment {
  user: string
  c_text: string
  rating: number
}

export interface GameDetails {
  gid: number
  name: string,
  year: number
  ranking: number
  users_rated: number
  url: string
  image: string
  comments: UserComment[]
}
