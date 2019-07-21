import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.module.routing';
import { WelcomeComponent } from './routes/welcome/welcome.component';
import { LayoutComponent } from './routes/layout/layout.component';
import { ErrorComponent } from './routes/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LayoutComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
