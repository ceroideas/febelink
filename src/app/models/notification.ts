export interface Notification {
    id: number;
    id_receiver: number;
    title: string;
    message?: string;
    is_read?: number;
    type?: NotifType;
    route?: string;
}

export enum NotifType {
    Chat = 1
}

export interface UnreadNotificationsCount{
    chats:number; 
    offers:number; 
    ratings:number;
}
