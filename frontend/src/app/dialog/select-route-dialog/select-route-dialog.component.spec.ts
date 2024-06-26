import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectRouteDialogComponent} from './select-route-dialog.component';

describe('SelectRouteDialogComponent', () => {
  let component: SelectRouteDialogComponent;
  let fixture: ComponentFixture<SelectRouteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectRouteDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectRouteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
