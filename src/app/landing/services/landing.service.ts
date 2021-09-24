import { Injectable } from '@angular/core';
import { UserLanding } from '../models/user-landing';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

  private numTokens:number;
  private faseTokens:number;
  private justLogged:boolean;
  private user:UserLanding;

  setNumTokens(numTokens:number) {
    this.numTokens = numTokens;
  }

  getNumTokens():number {
    return this.numTokens;
  }

  setFaseTokens(faseTokens:number) {
    this.faseTokens = faseTokens;
  }

  getFaseTokens():number {
    return this.faseTokens;
  }

  setJustLogged(justLogged:boolean) {
    this.justLogged = justLogged;
  }

  isJustLogged():boolean {
    return this.justLogged;
  }

  setUser(user:UserLanding) {
    this.user = user;
  }

  getUser():UserLanding {
    return this.user;
  }
}
