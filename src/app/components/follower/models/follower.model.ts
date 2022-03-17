export interface IFollower
{
    id?: number
    uid_follower: number
    uid_followed: number

    created_at: string
    canceled_at?: string
}
