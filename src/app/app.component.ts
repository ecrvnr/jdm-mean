import { Component } from '@angular/core';
import { Term } from './terms/term';
import { TermService } from './terms/term.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TermService]
})
export class AppComponent {
  title = 'app';

  placeHolderString: String;
  termString: String;

  constructor(private termService: TermService) { }

  search() {
    if (this.placeHolderString.length > 0) {
      this.termString = null;
      this.termString = this.placeHolderString;
    }
  }
}
