/**
 * Description [Interface to define GeoPlacesAPI params.]
 *
 * @author abdias
 * @version 0.0.1
 *
 * @interface
 */
 export interface GeoPlacesModel {

    // adr_address 
    span_address?: string;

    // formatted_address
    address?: string;

    // name:
    //      country   || administrative_area_level_1  || administrative_area_level_2 ||
    //      locality  || sublocality                  || postal_code
    placeType?: string;

    place_id?: string;

    // To go to google maps at this Geo Place
    url?: string;
    
    // country
    Country?: {
        long?: string,
        short?: string,
    },
    // administrative_area_level_1 || autonomous_comunity
    State?: {
        long?: string,
        short?: string,
    },
    // administrative_area_level_2 || province
    Department?: {
        long?: string,
        short?: string,
    },
    // locality || town
    Locality?: {
        long?: string,
        short?: string,
    }
    // neighborhood
    Barrio?: {
        long?: string,
        short?: string,
    }
    // street_number
    StreetNumber?: {
        long?: string,
        short?: string,
    }
    // route
    StreetName?: {
        long?: string,
        short?: string,
    }
    // postal_code
    CP?: {
        long?: string,
        short?: string,
    }
    // postal_code_suffix
    CP_SUFIX?: {
        long?: string,
        short?: string,
    }
  }