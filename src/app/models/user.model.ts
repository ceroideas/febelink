/**
 * Description [Interface to define user.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */
 export interface IUser {
    id: number;
    role_id: number;
    nick: string;
    name: string;
    lastName?: string;
    email: string;
    avatar: string;
    email_verified_at: string | null;
    provider: string | null;
    settings: string | null;
    created_at: string;
    updated_at: string;
    descripcion: string | null;
    
    direccion: string | null;
    direccion_resto: string | null;
    
    province_id: number;
    town_id: number | null;
    country: string | null;
    state: string | null;
    department: string | null;
    locality: string | null;
    place_id: string | null;

    telefono: string | null;
    logo: string | null;
    dni: string | null;
    doc_type?: string;
    kyc_verified_at?: string;
    link_url?: string;
    card_brand: string | null;
    card_last_four: string | null;
    trial_ends_at: string | null;
    stripe_id: number | null;
    skip_wizard: number;
    reference: string;
    google_id: string | null;
    facebook_id: string | null;
    suspended: number;

    public?: string
}
export interface IUserShow
{
    nick?: string
    name?: string
    lastName?: string
    logo?: string
    avatar?: string
}