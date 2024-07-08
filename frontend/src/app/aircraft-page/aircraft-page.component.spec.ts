import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AircraftPageComponent} from './aircraft-page.component';

describe('AircraftPageComponent', () => {
  let component: AircraftPageComponent;
  let fixture: ComponentFixture<AircraftPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AircraftPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AircraftPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
