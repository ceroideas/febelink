export interface UserLanding {
    id?: number;
    name?: string;
    lastName?:string;
    email?: string;
    dni?: string;
    link_url?: string;
    phone?: string;

    address?: string;
    address_rest?: string;

    province_id?:number;
    town_id?:number;
    country?: string;
    state?: string;
    department?: string;
    locality?: string;
    place_id?: string;
}
