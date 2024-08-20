import { City } from "./city";

export interface Location {
  h1: string;
  id: number;
  link: string;
  meta_description: string;
  page_title: string;
  title: string;
  updated_at: string;
  checked: boolean;
  cities?: City[]
}