import { Entry } from './entry';
import { OutRel } from './outRel';
import { InRel } from './inRel';

export class Term {
  _id: String;
  term: String;
  eid: Number;
  def: String[];
  nodes: [{
    nt: String;
    ntid: Number;
    ntname: String;
    entries: [Entry];
  }];
  relations: [{
    rt: String;
    rtid: Number;
    rtname: String;
    rtgpname: String;
    rthelp: String;
    outRels: [OutRel];
    inRels: [InRel];
  }];
}
