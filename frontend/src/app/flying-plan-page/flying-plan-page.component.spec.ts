import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlyingPlanPageComponent } from './flying-plan-page.component';

describe('FlyingPlanPageComponent', () => {
  let component: FlyingPlanPageComponent;
  let fixture: ComponentFixture<FlyingPlanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlyingPlanPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlyingPlanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
