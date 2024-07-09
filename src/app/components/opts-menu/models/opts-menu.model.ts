export interface IOptsMenuButton {
    text: string
    
    icon?: string
    img?: string

    click: ( iOptsMenuButton: IOptsMenuButton ) => any
    preventDismissOnClick?: boolean
}