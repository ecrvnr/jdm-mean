import { Component, OnInit } from '@angular/core';
import { TermService } from '../term.service';
import { Term } from '../term';
import { Input } from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-term-collections',
  templateUrl: './term-collections.component.html',
  styleUrls: ['./term-collections.component.css'],
  providers: [TermService]
})
export class TermCollectionsComponent {

  @Input()
  term: Term;

  pageSize: Number;


  constructor(private termService: TermService) { }

  getEntries(page: Number, pageSize: Number) {

  }

  getOutRels(page: Number, pageSize: Number) {

  }

  getInRels(page: Number, pageSize: Number) {

  }
}
