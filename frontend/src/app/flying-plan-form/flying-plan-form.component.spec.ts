import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlyingPlanFormComponent } from './flying-plan-form.component';

describe('FlyingPlanFormComponent', () => {
  let component: FlyingPlanFormComponent;
  let fixture: ComponentFixture<FlyingPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlyingPlanFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlyingPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
