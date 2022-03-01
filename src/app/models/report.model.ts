import { IUserShow } from "./user.model";

export interface IReport
{
    id?: number

    perfil?: number
    demanda?: number
    advise?: number
    comment?: number

    why: string
    uid?: number

    created_at?: string
    updated_at?: string
    state_at?: string
}

export interface IReportFull extends IReport, IUserShow {}