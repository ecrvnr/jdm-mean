import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
    term: Term;

    @Output()
    searchEvent = new EventEmitter<string>();

    selected: {};
    toShow: String;

    constructor(private termService: TermService) { }

    ngOnInit(): void { }

    selectItem(selected: any): void {
        this.selected = selected;
        console.log(selected);
    }

    show(toShow: String): void {
        this.toShow = toShow;
    }

    searchTerm(term: string): void {
        this.searchEvent.next(term);
    }
}
