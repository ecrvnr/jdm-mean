import { Component, Input } from '@angular/core';
import { Term } from '../term';
import { TermService } from '../term.service';

@Component({
  selector: 'app-term-details',
  templateUrl: './term-details.component.html',
  styleUrls: ['./term-details.component.css'],
  providers: [TermService]
})
export class TermDetailsComponent {

  @Input()
  term: Term;

  entries: {}[];
  outRels: {}[];
  inRels: {}[];

  constructor(private termService: TermService) { }

}
