import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {NgxElectronModule} from 'ngx-electron';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgxElectronModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
