import { Subsector } from "./subsector"

export interface Sector {
  icon: string,
  id: number,
  link: string,
  nombre: string,
  keySearch: KeySearch[],
  subSectors: Subsector[]
}

export interface KeySearch {
  id: number,
  sector_id: number,
  key_name: string
}

export interface SectorKey {
  id: number,
  sector_id: number,
  key_name: string,
  nombre: string,
  link: string,
  icons: string,
  isEdit: boolean,
  icon: string,
  keySearchParse: string,
}