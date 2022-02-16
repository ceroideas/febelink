import { IPaginationFilter } from "src/app/models/pagination.model";

export interface IAdvise {
    id: number
    uid: number
    
    lang: number

    id_sector: number
    sector: string

    id_subsector: number
    subsector: string

    title: string
    subtitle: string
    summary: string
    content: string
    
    photo: string
    video: string
    
    shared: number
    reacts: number

    created_at: string
    updated_at: string
    state: number
}

export interface IAdviseFilter extends IPaginationFilter {
    sector?: number
    subsector?: number
    lang?: number
    user?: number
}
