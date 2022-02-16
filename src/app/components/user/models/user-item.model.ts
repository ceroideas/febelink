import { IUser } from "src/app/models/user.model";

export interface IUserItem extends IUser {
    txEnd: string
    txSubend: string
}