import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TermDetailsComponent } from './terms/term-details/term-details.component';


@NgModule({
  declarations: [
    AppComponent,
    TermDetailsComponent,
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    FormsModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
