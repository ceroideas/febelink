export enum ReactTypes {
    NONE = 0
    , LIKE = 1
    , DISAGREEMENT = 2
    , LOVE = 3
    , USEFUL = 4
}

export interface IReactTypes {
    id: number
    type: string
    state: number
}
export abstract class Reacts
{
    static LIKE: IReactTypes = { id: ReactTypes.LIKE, type: 'like', state: 1 }
    static DISAGREEMENT: IReactTypes = { id: ReactTypes.DISAGREEMENT, type: 'disagreement', state: 1 }
    static LOVE: IReactTypes = { id: ReactTypes.LOVE, type: 'love', state: 1 }
    static USEFUL: IReactTypes = { id: ReactTypes.USEFUL, type: 'useful', state: 1 }
    static NONE: IReactTypes = { id: ReactTypes.NONE, type: '', state: 1 }

    public static get( reactType?: ReactTypes ): IReactTypes
    {
        switch ( reactType )
        {
            case ReactTypes.LIKE: return Reacts.LIKE
            case ReactTypes.DISAGREEMENT: return Reacts.DISAGREEMENT
            case ReactTypes.LOVE: return Reacts.LOVE
            case ReactTypes.USEFUL: return Reacts.USEFUL
            case ReactTypes.NONE: default: return Reacts.NONE
        }
    }
    public static list(): IReactTypes[]
    {
        return [
            Reacts.NONE
            , Reacts.LIKE
            , Reacts.DISAGREEMENT
            , Reacts.LOVE
            , Reacts.USEFUL
        ]
    }
    public static img( reactType?: ReactTypes ): string
    {
        const iReactType: IReactTypes = Reacts.get( reactType );
        return `assets/icon/svg/react${ !iReactType?.type ? '' : '_' + iReactType.type }.svg`
    }
}
