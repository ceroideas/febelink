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
    name: string;
    email: string;
    avatar: string;
    email_verified_at: string | null;
    provider: string | null;
    settings: string | null;
    created_at: string;
    updated_at: string;
    descripcion: string | null;
    direccion: string | null;
    province_id: number;
    town_id: number | null;
    telefono: string | null;
    logo: string | null;
    dni: string | null;
    card_brand: string | null;
    card_last_four: string | null;
    trial_ends_at: string | null;
    stripe_id: number | null;
    skip_wizard: number;
    reference: string;
    google_id: string | null;
    facebook_id: string | null;
    suspended: number;
}