import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

import { App } from './app';
import { Main } from './views/main';
import { Search } from './views/search';
import { Game } from './views/game';
import {BggService} from './bgg.service';

const appRoutes: Routes = [
  { path: '', component: Main },
  { path: 'search', component: Search },
  { path: 'game/:gid', component: Game },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    App, Main, Search, Game
  ],
  imports: [
    BrowserModule, ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    BggService
  ],
  bootstrap: [App]
})
export class AppModule { }
