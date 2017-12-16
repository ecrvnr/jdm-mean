import { Component, OnInit, Input } from '@angular/core';
import { Term } from '../term';
import { Node } from '../node';
import { Relation } from '../relation';
import { TermService } from '../term.service';

@Component({
  selector: 'app-term-nodes-relations',
  templateUrl: './term-nodes-relations.component.html',
  styleUrls: ['./term-nodes-relations.component.css'],
  providers: [TermService]
})
export class TermNodesRelationsComponent implements OnInit {

  @Input()
  set _term(term: Term) {
    if (term !== undefined) {
      this.term = term;
    }
  }

  term: Term;
  toShow: String;

  constructor(private termService: TermService) { }

  ngOnInit(): void { 
    this.toShow = 'nodes';
  }

  show(toShow: String): void {
    this.toShow = toShow;
  }
}
