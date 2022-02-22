import { IPaginationFilter } from "src/app/models/pagination.model";

export interface IAdvise {
    id?: number
    uid?: number
    lang: number

    id_sector?: number
    id_subsector?: number

    title: string
    subtitle?: string
    summary: string
    content?: string
    
    photo?: string | ArrayBuffer
    video?: string
    
    shared?: number
    reacts?: number

    created_at?: string
    updated_at?: string
    id_state?: number
    state?: string
}

export interface IAdviseFull extends IAdvise {
    nick?: string
    name?: string
    lastName?: string
    avatar?: string

    sector: string | number
    subsector?: string | number

    react_qant?: number
    reacted?: boolean
}

export interface IAdviseFilter extends IPaginationFilter {
    sector?: string | number
    subsector?: string | number
    lang?: number
    user?: number
}
