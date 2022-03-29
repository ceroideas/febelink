import { IFile } from 'src/app/components/file-picker/models/file.model';

export interface IAssistant {
    page: IAssistantPage

}

export enum ILevel {
    SECTIR = 'sector',
    SUBSECTOR = 'subsector',
    KEY = 'key'
}

export enum IAssistantPage {
    SEARCH = 0,
    SUBSECTOR = 1,
    FORM = 2
}

export interface IKeys {
    name?: string
    value?: string

    keyword?: string
    level?: string
}

export interface IKeywords {
    searchText?: string
    keyText?: string
    keys?: IKeys[]

    selectorEnabled?: boolean

    candidates?: any[]
    main?: IMatch
    
    showCard?: boolean
}

export interface IMatch {
    coincidences: number

    priority: number
    priority_level: string

    sector_id: number
    sector_nombre: string

    subsector_id: number
    subsector_nombre: string
}

export interface IForm {
    descript: string
    ofertas_restantes: string
    file: IFile

    id_sector?: number
    sector?: string

    id_subsector?: number
    subsector?: string
}
