import { IPaginationFilter } from "src/app/models/pagination.model";
import { IUserShow } from "src/app/models/user.model";

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
    
    photo?: any
    video?: string
    
    shared?: number
    reacts?: number

    created_at?: string
    updated_at?: string
    id_state?: number
    state?: string
}

export interface IAdviseFull extends IAdvise, IUserShow
{
    sector: string | number
    subsector?: string | number

    react_qant?: number
    reacted?: number

    comments_qant?: number
}

export interface IAdviseFilter extends IPaginationFilter {
    sector?: string | number
    subsector?: string | number
    lang?: number
    user?: number
}
