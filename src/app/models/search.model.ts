import { IUser } from "./user.model";

/**
 * Description [Interface to define search.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */
export interface ISearch {
    completada: number;
    descripcion: string;
    id: number;
    demandante?: string;
    id_demandante: number;
    imagen: string;
    nombre: string;
    ofertas: [];
    ofertas_restantes: number;
    reference_demandante: string;
    sector: string;
    sub_sector: number;
    user: IUser;
    valoracion: string;
    favorito: boolean;
}