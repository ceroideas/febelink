export interface Sector {
  icon: string,
  id: number,
  link: string,
  nombre: string,
  keySearch: KeySearch[]
}

export interface KeySearch {
  id: number,
  sector_id: number,
  key_name: string
}