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
export class TermCollectionsComponent implements OnInit {

  @Input()
  term: Term;

  toShow: String;
  page: Number;
  pageSize: Number;
  loading: Boolean;

  entries: Entry[];
  outRels: OutRel[];
  inRels: InRel[];

  constructor(private termService: TermService) { }

  ngOnInit(): void {
    this.pageSize = 10;
    this.entries = [];
    this.inRels = [];
    this.outRels = [];
    this.page = 0;
  }

  setPageSize(pageSize: Number): void {
    if (pageSize !== this.pageSize) {
      this.pageSize = pageSize;
      this.entries = [];
      this.inRels = [];
      this.outRels = [];
      this.getCollection();
    }
  }

  getCollection() {
    this.loading = true;
    switch (this.toShow) {
      case 'entries':
        if (this.entries.length !== this.pageSize) {
          this.termService.getEntries(this.term.eid, this.page, this.pageSize).then((entries: Entry[]) => {
            this.entries = entries;
            this.loading = false;
          });
        }
        break;

      case 'outRels':
        if (this.outRels.length !== this.pageSize) {
          this.termService.getOutRels(this.term.eid, this.page, this.pageSize).then((outRels: OutRel[]) => {
            this.outRels = outRels;
            this.loading = false;
          });
        }
        break;

      case 'inRels':
        if (this.inRels.length !== this.pageSize) {
          this.termService.getInRels(this.term.eid, this.page, this.pageSize).then((inRels: InRel[]) => {
            this.inRels = inRels;
            this.loading = false;
          });
        }
        break;
    }
  }

  show(toShow: String): void {
    this.toShow = toShow;
    this.getCollection();
  }
}
