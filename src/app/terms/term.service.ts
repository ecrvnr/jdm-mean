import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Term } from './term';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TermService {
  private termsUrl = '/api/terms';
  constructor(private http: Http) {}

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

  private handleError (error: any) {
    const errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }

}
