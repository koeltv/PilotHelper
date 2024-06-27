import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NearbyAirportDialogComponent} from './nearby-airport-dialog.component';

describe('NearbyAirportDialogComponent', () => {
  let component: NearbyAirportDialogComponent;
  let fixture: ComponentFixture<NearbyAirportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyAirportDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NearbyAirportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
