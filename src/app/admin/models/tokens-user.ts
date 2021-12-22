export interface TokensUser {
    nick?:string,
    name:string,
    lastname:string,
    email:string,
    dni:string,
    num_tokens:number,
    phase_tokens:number,
    payed_date:string,
    retained: boolean,
    date:string,
    id:number
}

export interface TokenPhase {
    value: string,
    label: string
}

export enum TokenCRUD {
    Create = 'admin.create',
    Read = 'admin.read',
    Update = 'admin.update',
    Delete = 'admin.delete'
}