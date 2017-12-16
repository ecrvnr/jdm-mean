import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TermDetailsComponent } from './terms/term-details/term-details.component';
import { TermCollectionsComponent } from './terms/term-collections/term-collections.component';
import { TermNodesRelationsComponent } from './terms/term-nodes-relations/term-nodes-relations.component';


@NgModule({
  declarations: [
    AppComponent,
    TermDetailsComponent,
    TermCollectionsComponent,
    TermNodesRelationsComponent,
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
