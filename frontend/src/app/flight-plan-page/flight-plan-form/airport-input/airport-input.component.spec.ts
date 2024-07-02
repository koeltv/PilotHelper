import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AirportInputComponent} from './airport-input.component';

describe('AirportInputComponent', () => {
  let component: AirportInputComponent;
  let fixture: ComponentFixture<AirportInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirportInputComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AirportInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
