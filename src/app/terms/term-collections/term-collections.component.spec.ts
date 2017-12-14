import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermCollectionsComponent } from './term-collections.component';

describe('TermCollectionsComponent', () => {
  let component: TermCollectionsComponent;
  let fixture: ComponentFixture<TermCollectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermCollectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
