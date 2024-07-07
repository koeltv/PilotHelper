import {ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Aircraft} from '../../../shared/models/Aircraft';
import {FlightPlan} from '../../../shared/models/FlightPlan';
import {NgForOf} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {PlanningToolsService} from '../../api/planning-tools.service';
import {Airport} from '../../../shared/models/Airport';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {SelectRouteDialogComponent} from './select-route-dialog/select-route-dialog.component';
import {AirportInputComponent} from './airport-input/airport-input.component';
import {AircraftTypeInputComponent} from './aircraft-type-input/aircraft-type-input.component';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatDivider} from '@angular/material/divider';
import {SelectAircraftComponent} from '../../aircraft-page/select-aircraft/select-aircraft.component';
import {DataService} from '../../api/data.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {AircraftFormComponent} from '../../aircraft-page/aircraft-form/aircraft-form.component';

@Component({
  selector: 'app-flight-plan-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    AirportInputComponent,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatIcon,
    AircraftTypeInputComponent,
    MatCheckbox,
    MatGridList,
    MatGridTile,
    MatDivider,
    SelectAircraftComponent,
    MatFabButton,
    AircraftFormComponent
  ],
  templateUrl: './flight-plan-form.component.html',
  styleUrl: './flight-plan-form.component.css'
})
export class FlightPlanFormComponent {
  @Output() readonly formSubmit = new EventEmitter<FlightPlan>();
  flightPlanForm: FormGroup;
  aircraftData: FormGroup;

  aircrafts: Aircraft[] = [];

  mobileQuery: MediaQueryList;

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly planningToolsService: PlanningToolsService,
    private readonly dataService: DataService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQuery.addEventListener('change', () => changeDetectorRef.detectChanges());

    this.aircraftData = this.fb.group({
      aircraftId: [''],
      aircraftType: [null],
      turbulenceType: [''],
      equipment: [''],
      transponder: [''],
      colorAndMarkings: ['']
    });

    this.flightPlanForm = this.fb.group({
      flightRules: ['', Validators.required],
      flightType: ['', Validators.required],
      aircraftData: this.aircraftData,
      aircraftCount: [1, Validators.required],
      startingAirport: [null, Validators.required],
      startingTime: ['', Validators.required],
      cruisingSpeed: ['', Validators.required],
      cruisingAltitude: ['', Validators.required],
      path: ['', Validators.required],
      destinationAirport: [null, Validators.required],
      estimatedTime: ['', Validators.required],
      alternativeAirport: this.fb.array(['']),
      otherInformations: this.fb.array(['']),
      autonomy: ['', Validators.required],
      occupantCount: [1, Validators.required],
      equipment: this.fb.group({
        uhfPost: [false],
        vhfPost: [false],
        rdbaBeacon: [false],
        survivalEquipmentPolar: [false],
        survivalEquipmentDesert: [false],
        survivalEquipmentMaritime: [false],
        survivalEquipmentJungle: [false],
        safetyJacketWithLight: [false],
        safetyJacketWithFluorescein: [false],
        safetyJacketWithUHF: [false],
        safetyJacketWithVHF: [false],
        raftCount: [0],
        raftCapacity: [0],
        raftCoverageColor: ['']
      }),
      remarks: [''],
      pilot: ['', Validators.required]
    });

    this.dataService.readAllAircraft().subscribe(aircrafts => {
      this.aircrafts = aircrafts;
    });
  }

  onAircraftSelected(selectedAircraft: Aircraft[]) {
    if (selectedAircraft.length == 0) return;
    this.updateAircraftData(selectedAircraft[0]);
  }

  get alternativeAirports(): FormArray {
    return this.flightPlanForm.get('alternativeAirport') as FormArray;
  }

  get otherInformations(): FormArray {
    return this.flightPlanForm.get('otherInformations') as FormArray;
  }

  updateAircraftData(selectedAircraft: Aircraft) {
    this.aircraftData.patchValue({
      aircraftId: selectedAircraft.aircraftId,
      aircraftType: selectedAircraft.aircraftType,
      turbulenceType: selectedAircraft.turbulenceType,
      equipment: selectedAircraft.equipment,
      transponder: selectedAircraft.transponder,
      colorAndMarkings: selectedAircraft.colorAndMarkings
    });
  }

  onSubmit() {
    if (this.flightPlanForm.valid) {
      if (typeof this.flightPlanForm.value.startingAirport == 'object')
        this.flightPlanForm.value.startingAirport = this.flightPlanForm.value.startingAirport.icaoCode ?
          this.flightPlanForm.value.startingAirport.icaoCode : 'ZZZZ';
      if (typeof this.flightPlanForm.value.destinationAirport == 'object') this.flightPlanForm.value.destinationAirport =
        this.flightPlanForm.value.destinationAirport.icaoCode ?
          this.flightPlanForm.value.destinationAirport.icaoCode : 'ZZZZ';

      this.flightPlanForm.value.startingTime = this.flightPlanForm.value.startingTime.replace(/:/, '');
      this.flightPlanForm.value.estimatedTime = this.flightPlanForm.value.estimatedTime.replace(/:/, '');
      this.flightPlanForm.value.autonomy = this.flightPlanForm.value.autonomy.replace(/:/, '');

      this.formSubmit.emit(this.flightPlanForm.value);
    }
  }

  suggestRoutes() {
    let startingAirport: string | Airport | null = this.flightPlanForm.get('startingAirport')?.value;
    let destinationAirport: string | Airport | null = this.flightPlanForm.get('destinationAirport')?.value;

    if (startingAirport != null && destinationAirport != null) {
      if (startingAirport instanceof Airport) {
        startingAirport = startingAirport.iataCode ? startingAirport.iataCode : '';
      }
      if (destinationAirport instanceof Airport) {
        destinationAirport = destinationAirport.iataCode ? destinationAirport.iataCode : '';
      }
      this.planningToolsService.getRoutesBetween(startingAirport, destinationAirport).subscribe(routes => {
        this.dialog
          .open(SelectRouteDialogComponent, {data: routes,})
          .afterClosed()
          .subscribe(route => {
            if (route) {
              this.flightPlanForm.patchValue({path: route.route});
            }
          });
      });
    } else {
      this.snackbar.open('Merci de renseigner l\'aéroport de départ et d\'arrivée', 'OK');
    }
  }
}
