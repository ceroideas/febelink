export interface TokensUser {
    uid:number,
    nick?:string,
    name:string,
    lastname:string,
    email:string,
    dni:string,
    public:string,
    num_tokens:number,
    id_phase_tokens:number,
    phase_tokens:string,
    payed_date:string,
    retained: boolean,
    date:string,
    id:number
    observations:string,
}

export interface TokenPhase {
    id: string,
    date: string
    phase_tokens: string
}

export enum TokenCRUD {
    Create = 'admin.create',
    Read = 'admin.read',
    Update = 'admin.update',
    Delete = 'admin.delete'
}