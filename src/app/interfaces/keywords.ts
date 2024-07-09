import { LinkLocation } from "./link-location";
import { Link } from "./link";
import { Location } from "./location";
import { Sector } from "./sector";
import { Subsector } from "./subsector";
import { LinkCity } from "./link-city";
import { City } from "./city";

export interface Keywords {
  linklocations: LinkLocation[];
  linkcitys: LinkCity[];
  links: Link[];
  citys: City[];
  locations: Location[];
  sector: Sector[];
  subsector: Subsector[];
}
