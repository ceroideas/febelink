/**
 * Description [Interface to define offer.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */
export interface IOffer {
    demanda?: string;
    descripcion: string;
    estado: number;
    estado_oferta?: string;
    id: number;
    id_demanda: number;
    id_ofertante: number;
    nombre: string;
    precio: number;
    respondida: number;
}
