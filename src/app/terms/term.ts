export class Term {
  _id: String;
  term: String;
  eid: Number;
  def: String[];
  nodeTypes: {
    nt: String;
    ntid: Number;
    ntname: String;
  }[];
  relTypes: {
    rt: String;
    rtid: Number;
    rtname: String;
    rtgpname: String;
    rthelp: String;
  }[];
}
