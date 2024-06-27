import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FlyingPlanListPageComponent} from './flying-plan-list-page.component';

describe('FlyingPlanListPageComponent', () => {
  let component: FlyingPlanListPageComponent;
  let fixture: ComponentFixture<FlyingPlanListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlyingPlanListPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FlyingPlanListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
