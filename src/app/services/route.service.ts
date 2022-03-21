import { Injectable } from "@angular/core";
import { NavigationEnd, NavigationExtras, Params, Router, RouterEvent } from "@angular/router";
import { filter } from "rxjs/operators";

@Injectable({
    providedIn: 'root',
  })
export class RouteSvc
{
    url: string
    params: Params
    listener: ( url: string, params: Params ) => any

    constructor(
        private router: Router
    ) {
        this.catchEvents()
    }

    private catchEvents()
    {
      // To refresh list on routing to this page
      this.router.events.pipe(
        filter(( events: RouterEvent ) => events instanceof NavigationEnd )
      ).subscribe(( val ) => {
        let urlTree = this.router.parseUrl(this.router.url)
        this.params = urlTree.queryParams
        urlTree.queryParams = {}
        urlTree.fragment = null // optional
        this.url = urlTree.toString()

        if( this.listener )
            this.listener( this.url, this.params )
      });
    }

    addListener( listener: ( url: string, params: Params ) => any )
    {
        this.listener = listener

        if( this.url )
            this.listener( this.url, this.params )
    }

    navigate(commands: any[], extras?: NavigationExtras): Promise<boolean>
    {
        return this.router.navigate( commands, extras );
    }

    navigateReload(commands: any[], extras?: NavigationExtras)
    {
      this.navigate( commands, extras )
        .then(() => {
          window.location.reload();
        })
    }
}