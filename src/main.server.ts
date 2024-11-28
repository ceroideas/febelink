import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { getDocument, getWindow } from "ssr-window";
import 'localstorage-polyfill';
import { enableProdMode } from '@angular/core';

global['localStorage'] = localStorage;
global['document'] = getDocument();

enableProdMode();

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
