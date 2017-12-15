import { Component } from '@angular/core';
import { Term } from './terms/term';
import { TermService } from './terms/term.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TermService]
})
export class AppComponent implements OnInit {
  title = 'app';

  placeHolderString: String;
  termString: String;

  constructor(private termService: TermService) { }

  ngOnInit() {
    this.placeHolderString = '';
  }

  search() {
    if (this.placeHolderString.length > 0) {
      this.termString = this.placeHolderString;
      this.placeHolderString = '';
    }
  }
}
