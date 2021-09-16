import { Injectable } from '@angular/core';
import { UserLanding } from '../models/user-landing';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

  private numTokens:number;
  private justLogged:boolean;
  private user:UserLanding;

  setNumTokens(numTokens:number) {
    this.numTokens = numTokens;
  }

  setJustLogged(justLogged:boolean) {
    this.justLogged = justLogged;
  }

  setUser(user:UserLanding) {
    this.user = user;
  }

  getNumTokens():number {
    return this.numTokens;
  }

  isJustLogged():boolean {
    return this.justLogged;
  }

  getUser():UserLanding {
    return this.user;
  }
}
