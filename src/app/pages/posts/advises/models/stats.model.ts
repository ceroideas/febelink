import { IAdviseFull } from "./advises.model";

export interface IStats {
    qPosts: number
    qReacts: number
    posts: IAdviseFull[]
}