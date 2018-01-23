import { Entry } from './entry';
import { OutRel } from './outRel';
import { InRel } from './inRel';
import { Node } from './node';
import { Relation } from './relation';


export class Term {
    _id: String;
    term: String;
    eid: Number;
    def: String[];
    nodes: Node[];
    relations: Relation[];
}
