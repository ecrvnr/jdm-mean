import { TestBed, inject } from '@angular/core/testing';

import { TermService } from './term.service';

describe('TermService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TermService]
    });
  });

  it('should be created', inject([TermService], (service: TermService) => {
    expect(service).toBeTruthy();
  }));
});
