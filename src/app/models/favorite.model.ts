/**
 * Description [Interface to define favorite.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */
export interface IFavorite {
    created_at: string;
    favoriteable_id: number;
    favoriteable_type: string;
    updated_at: string;
    user_id: number
}