import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenItemComponent } from './full-screen-item.component';

describe('FullScreenItemComponent', () => {
  let component: FullScreenItemComponent;
  let fixture: ComponentFixture<FullScreenItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullScreenItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullScreenItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
