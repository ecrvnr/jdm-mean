import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Term } from '../term';
import { TermService } from '../term.service';

@Component({
  selector: 'app-term-details',
  templateUrl: './term-details.component.html',
  styleUrls: ['./term-details.component.css'],
  providers: [TermService]
})
export class TermDetailsComponent implements OnInit {

  @Input()
  set termString(termString: String) {
    if (termString !== undefined && termString.length > 0) {
      this.searchTerm(termString);
    }
  }

  term: Term;
  loading: Boolean;

  constructor(private termService: TermService) { }

  ngOnInit(): void {
    this.loading = false;
  }

  searchTerm(string: String): void {
    this.term = null;
    this.loading = true;
    this.termService.getTerm(string)
      .then((term: Term) => {
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
