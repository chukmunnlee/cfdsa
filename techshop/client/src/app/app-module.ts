import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';

import { App } from './app';
import {BackendService} from './backend';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(), provideHttpClient(),
    BackendService
  ],
  bootstrap: [App]
})
export class AppModule { }
