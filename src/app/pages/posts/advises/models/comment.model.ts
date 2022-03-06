import { IUserShow } from "src/app/models/user.model";

export interface IComment
{
    id?: number
    advise?: number
    id_comment?: number
    uid?: number

    comment: string

    created_at?: string
    updated_at?: string
    state?: number
}

export interface ICommentFull extends IComment, IUserShow
{
    react_qant?: number
}