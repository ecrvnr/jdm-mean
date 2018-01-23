import { InRel } from './inRel';
import { OutRel } from './outRel';

export class Relation {
    rt: String;
    rtid: Number;
    rtname: String;
    rtgpname: String;
    rthelp: String;
    outRels: OutRel[];
    inRels: InRel[];
}
