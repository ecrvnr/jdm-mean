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

  termString: String;
  term: Term;
  loading: Boolean;

  constructor(private termService: TermService) { }

  searchTerm() {
    this.term = null;
    this.loading = true;
    if (this.termString !== undefined) {
      this.termService.getTerm(this.termString).then((term: Term) => {
        if (term !== {}) {
          this.term = null;
        } else {
          this.term = term;
        }
        this.termString = null;
        this.loading = false;
        console.log(this.term);
      });
    }
  }
}
