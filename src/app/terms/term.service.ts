import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Term } from './term';
import { OutRel } from './outRel';
import { InRel } from './inRel';
import { Entry } from './entry';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TermService {
  private termsUrl = '/api/terms';
  constructor(private http: Http) { }

  // get("/api/terms/:term")
  getTerm(getTerm: String): Promise<void | Term> {
    return this.http.get(this.termsUrl + '/' + getTerm)
      .toPromise()
      .then(response => response.json() as Term)
      .catch(this.handleError);
  }

  // get("/api/terms/")
  getAllTerms(): Promise<void | Term[]> {
    return this.http.get(this.termsUrl)
      .toPromise()
      .then(response => response.json() as Term[])
      .catch(this.handleError);
  }

  // get("/api/terms/out/:eid/:page/:pageSize")
  getOutRels(eid: Number, page: Number, pageSize: Number): Promise<void | OutRel[]> {
    return this.http.get(this.termsUrl + '/out/' + eid + '/' + page + '/' + pageSize)
      .toPromise()
      .then(response => response.json() as OutRel[])
      .catch(this.handleError);
  }

  // get("/api/terms/in/:eid/:page/:pageSize")
  getInRels(eid: Number, page: Number, pageSize: Number): Promise<void | InRel[]> {
    return this.http.get(this.termsUrl + '/in/' + eid + '/' + page + '/' + pageSize)
      .toPromise()
      .then(response => response.json() as InRel[])
      .catch(this.handleError);
  }

  // get("/api/entries/out/:eid/:page/:pageSize")
  getEntries(eid: Number, page: Number, pageSize: Number): Promise<void | Entry[]> {
    return this.http.get(this.termsUrl + '/entries/' + eid + '/' + page + '/' + pageSize)
      .toPromise()
      .then(response => response.json() as Entry[])
      .catch(this.handleError);
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }

}
