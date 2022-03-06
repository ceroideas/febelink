import { Injectable } from '@angular/core';

export enum ConsoleType
{
      TABLE
    , INFO
    , WARN
    , ERROR
}

export interface IConsole
{
      type?: ConsoleType
    , message: string
    , color?: string
    , fontSize?: number
}

@Injectable({
  providedIn: 'root',
})
export class ConsoleSvc
{
    async log( iConsoles: IConsole | IConsole[] )
    {
        [].concat( iConsoles ).forEach( iConsole =>
        {
            const msg = `%c${iConsole.message}`
            const style = `color: ${iConsole.color || 'white' }; font-size: ${iConsole.fontSize || 16}px`
            switch( iConsole.type )
            {
                case ConsoleType.TABLE:
                    console.table( msg )
                    break
                case ConsoleType.WARN:
                    console.warn( msg, style )
                    break
                case ConsoleType.ERROR:
                    console.error( msg, style )
                    break
                case ConsoleType.INFO:
                default:
                    console.log( msg, style )
                    break
            }
        });
    }

    warning()
    {
        this.log([
            { type: ConsoleType.ERROR, message: '!ADVERTENCIA!', color: 'red', fontSize: 30 } as IConsole,
            { fontSize: 18, message: 'Esta es una función del navegador para desarrolladores.'
              + ' Si se le pidió que copiara y pegara algo aquí, '
              + 'alguien podría querer tomar el control de su cuenta. '
              + 'No introduzca ningún código de script sin saber lo que hace.' } as IConsole
          ])
    }
}
