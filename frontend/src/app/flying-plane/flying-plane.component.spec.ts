import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FlyingPlaneComponent} from './flying-plane.component';

describe('FlyingPlaneComponent', () => {
  let component: FlyingPlaneComponent;
  let fixture: ComponentFixture<FlyingPlaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlyingPlaneComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FlyingPlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
