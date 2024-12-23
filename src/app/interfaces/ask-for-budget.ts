export interface AskForBudget {
  id: number,
  date: string,
  description: string
  email?: string
  images: string[]
  location: string,
  location_id: number,
  name?: string,
  phone?: string,
  sector: string,
  sector_id: number,
  subsector: string,
  subsector_id: number,
  title?: string
}