/**
 * Description [Interface to define sector.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */
export interface ISector {
    id: number;
    nombre: string;
}

/**
 * Description [Interface to define sector.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */
export interface ISubSector {
    id: number;
    nombre: string;
    id_sector: number;
    icon?: string,
    keySearchParse?: string,
}

/**
 * Description [Interface to define sector.]
 *
 * @version 0.0.1
 *
 * @interface
 */
export interface Sector {
    sector: number;
    nombre: string;
    search_term?: string;
    icon?: string;
}