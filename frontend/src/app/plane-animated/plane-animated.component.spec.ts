import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlaneAnimatedComponent} from './plane-animated.component';

describe('PlaneAnimatedComponent', () => {
  let component: PlaneAnimatedComponent;
  let fixture: ComponentFixture<PlaneAnimatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaneAnimatedComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlaneAnimatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
