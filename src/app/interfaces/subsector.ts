import { KeySearch } from "./sector";

export interface Subsector {
  h1: string;
  id: number;
  id_sector: { id: number, name: string };
  imageURL: string;
  keySearch: KeySearch[];
  link: string;
  meta_description: string;
  nombre: string;
  page_title: string;
}