export interface City {
  h1: string;
  id: number;
  link: string;
  meta_description: string;
  page_title: string;
  title: string;
  updated_at: string;
  locations_id: { id: number, title: string };
  location: { id: number, title: string };
  checked: boolean;
}