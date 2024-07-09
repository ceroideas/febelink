import { IUserShow } from './../../../../models/user.model';

export interface IComment {
  id?: number;
  advise?: number;
  uid?: number;

  comment: string;

  created_at?: string;
  updated_at?: string;
  state?: number;

  parentId?: number;
}

export interface ICommentFull extends IComment, IUserShow {
  react_qant?: number;
  childComments?: ICommentFull[];
}
