export interface LinkCity {
  description: string;
  h1: string;
  h2: string;
  id: number;
  link: string;
  locations_id: { id: number, title: string };
  citys_id: { id: number, title: string };
  page_title: string;
  sector_id: { id: number, name: string };
  subsector_id: { id: number, name: string };
  title: string;
  updated_at: string;
}