import { IUser } from "../../../models/user.model";

export interface IUserItem extends IUser {
    txEnd?: any 
    txSubend?: any  
}