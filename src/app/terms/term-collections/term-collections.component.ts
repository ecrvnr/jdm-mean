import { Component, OnInit, Input } from '@angular/core';
import { TermService } from '../term.service';
import { Term } from '../term';
import { OutRel } from '../outRel';
import { InRel } from '../inRel';
import { Entry } from '../entry';

@Component({
  selector: 'app-term-collections',
  templateUrl: './term-collections.component.html',
  styleUrls: ['./term-collections.component.css'],
  providers: [TermService]
})
export class TermCollectionsComponent {

  @Input()
  term: Term;

  page: Number;
  pageSize: Number;
  loading: Boolean;

  entries: Entry[];
  outRels: OutRel[];
  inRels: InRel[];

  constructor(private termService: TermService) { }

  getEntries() {
    this.loading = true;
    this.termService.getEntries(this.term.eid, this.page, this.pageSize).then((entries: Entry[]) => {
      this.entries = entries;
      this.loading = false;
    });
  }

  getOutRels(page: Number, pageSize: Number) {
    this.loading = true;
    this.termService.getOutRels(this.term.eid, this.page, this.pageSize).then((outRels: OutRel[]) => {
      this.outRels = outRels;
      this.loading = false;
    });
  }

  getInRels(page: Number, pageSize: Number) {
    this.loading = true;
    this.termService.getInRels(this.term.eid, this.page, this.pageSize).then((inRels: InRel[]) => {
      this.inRels = inRels;
      this.loading = false;
    });
  }

  test(): void {
    console.log('POUET');
  }
}
