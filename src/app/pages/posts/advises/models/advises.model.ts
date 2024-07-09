import { IPaginationFilter } from './../../../../models/pagination.model';
import { IUserShow } from './../../../../models/user.model';

export interface IAdvise {
  id?: number;
  uid?: number;
  topic?: number;
  lang: number;
  id_advise?: number;

  id_sector?: number;
  id_subsector?: number;

  title: string;
  subtitle?: string;
  summary: string;
  content?: string;

  media_url?: string;
  media_name?: string;
  media_ext?: string;
  //To Upload File
  media?: File;

  shared?: number;
  reacts?: number;

  created_at?: string;
  updated_at?: string;
  id_state?: number;
  state?: string;
}

export interface IAdviseFull extends IAdvise, IUserShow {
  sector?: string | number;
  subsector?: string | number;

  react_qant?: number;
  reacted?: number;

  comments_qant?: number;
}

export interface IAdviseFilter extends IPaginationFilter {
  topic: string | number;

  sector?: string | number;
  subsector?: string | number;
  lang?: number;
  user?: number;
  hideContent?: boolean;
}

export interface ITopic {
  id: number;
  name: string;
}
