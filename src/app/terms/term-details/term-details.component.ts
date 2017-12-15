import { Component, Input } from '@angular/core';
import { Term } from '../term';
import { TermService } from '../term.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-term-details',
  templateUrl: './term-details.component.html',
  styleUrls: ['./term-details.component.css'],
  providers: [TermService]
})
export class TermDetailsComponent implements OnInit {

  @Input()
  set termString(termString: String) {
    this.searchTerm(termString);
  }

  term: Term;
  loading: Boolean;

  constructor(private termService: TermService) { }

  ngOnInit() {
    this.loading = false;
  }

  searchTerm(string: String) {
    this.term = null;
    this.loading = true;
    if (string.length > 0) {
      this.termService.getTerm(string).then((term: Term) => {
        if (term === null) {
          this.term = null;
        } else {
          this.term = term;
        }
        this.loading = false;
        console.log(this.term);
      });
    }
  }
}
