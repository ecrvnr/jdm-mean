import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermNodesRelationsComponent } from './term-nodes-relations.component';

describe('TermNodesRelationsComponent', () => {
  let component: TermNodesRelationsComponent;
  let fixture: ComponentFixture<TermNodesRelationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermNodesRelationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermNodesRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
