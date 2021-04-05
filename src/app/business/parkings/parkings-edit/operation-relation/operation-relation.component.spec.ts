import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditOperationRelationComponent } from './operation-relation.component';

describe('EditOperationRelationComponent', () => {
  let component: EditOperationRelationComponent;
  let fixture: ComponentFixture<EditOperationRelationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOperationRelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOperationRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
