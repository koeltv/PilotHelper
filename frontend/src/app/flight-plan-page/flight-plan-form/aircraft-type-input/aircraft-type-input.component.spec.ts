import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AircraftTypeInputComponent} from './aircraft-type-input.component';

describe('AircraftTypeInputComponent', () => {
  let component: AircraftTypeInputComponent;
  let fixture: ComponentFixture<AircraftTypeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AircraftTypeInputComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AircraftTypeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
