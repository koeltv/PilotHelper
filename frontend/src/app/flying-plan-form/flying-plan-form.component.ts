import {Component, EventEmitter, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AirCraft} from "../../shared/models/AirCraft";
import {FlightPlan} from "../../shared/models/FlightPlan";
import {NgForOf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatFabButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {PlanningToolsService} from "../api/planning-tools.service";
import {Airport} from "../../shared/models/Airport";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {SelectRouteDialogComponent} from "../dialog/select-route-dialog/select-route-dialog.component";
import {AirportInputComponent} from "./airport-input/airport-input.component";
import {AircraftTypeInputComponent} from "./aircraft-type-input/aircraft-type-input.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatDivider} from "@angular/material/divider";
import {ShowAircraftForm} from "../show-aircaft-form/show-aircraft-form.component";
import {DataService} from "../api/data.service";

@Component({
  selector: 'app-flying-plan-form',
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
    ShowAircraftForm,
    MatFabButton
  ],
  templateUrl: './flying-plan-form.component.html',
  styleUrl: './flying-plan-form.component.css'
})
export class FlyingPlanFormComponent {

  @Output() formSubmit = new EventEmitter<FlightPlan>();
  @Output() formChange = new EventEmitter<{ [key: string]: any }>();
  flyingPlanForm: FormGroup;
  aircraftData: FormGroup;

  aircrafts: AirCraft[] = [];

  selectedAircraft: AirCraft = {
    aircraftId: '',
    aircraftType: '',
    turbulenceType: '',
    equipment: '',
    transponder: '',
    colorAndMarkings: ''
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly planningToolsService: PlanningToolsService,
    private readonly dataService: DataService,
  ) {
    this.aircraftData = this.fb.group({
      aircraftId: [''],
      aircraftType: [undefined],
      turbulenceType: [''],
      equipment: [''],
      transponder: [''],
      colorAndMarkings: ['']
    });

    this.flyingPlanForm = this.fb.group({
      flightRules: ['', Validators.required],
      flightType: ['', Validators.required],
      aircraftData: this.aircraftData,
      aircraftCount: [1, Validators.required],
      startingAirport: [undefined, Validators.required],
      startingTime: ['', Validators.required],
      cruisingSpeed: ['', Validators.required],
      cruisingAltitude: ['', Validators.required],
      path: ['', Validators.required],
      destinationAirport: [undefined, Validators.required],
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
    })

    Object.keys(this.flyingPlanForm.controls).forEach(fieldName => {
      this.flyingPlanForm.get(fieldName)?.valueChanges.subscribe(newValue => {
        this.formChange.emit({[fieldName]: newValue});
      });
    });
  }

  onAircraftSelected(selectedAircraft: AirCraft[]) {
    if (selectedAircraft.length == 0) return;
    this.updateAircraftData(selectedAircraft[0]);
  }

  get alternativeAirports(): FormArray {
    return this.flyingPlanForm.get('alternativeAirport') as FormArray;
  }

  get otherInformations(): FormArray {
    return this.flyingPlanForm.get('otherInformations') as FormArray;
  }

  updateAircraftData(selectedAircraft: AirCraft) {
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
    if (this.flyingPlanForm.valid) {
      if (typeof this.flyingPlanForm.value.startingAirport == 'object')
        this.flyingPlanForm.value.startingAirport = this.flyingPlanForm.value.startingAirport.icaoCode ?
          this.flyingPlanForm.value.startingAirport.icaoCode : 'ZZZZ';
      if (typeof this.flyingPlanForm.value.destinationAirport == 'object') this.flyingPlanForm.value.destinationAirport =
        this.flyingPlanForm.value.destinationAirport.icaoCode ?
          this.flyingPlanForm.value.destinationAirport.icaoCode : 'ZZZZ';

      this.flyingPlanForm.value.startingTime = this.flyingPlanForm.value.startingTime.replace(/:/, '');
      this.flyingPlanForm.value.estimatedTime = this.flyingPlanForm.value.estimatedTime.replace(/:/, '');
      this.flyingPlanForm.value.autonomy = this.flyingPlanForm.value.autonomy.replace(/:/, '');

      this.formSubmit.emit(this.flyingPlanForm.value);
    }
  }

  suggestRoutes() {
    let startingAirport: string | Airport | undefined = this.flyingPlanForm.get('startingAirport')?.value;
    let destinationAirport: string | Airport | undefined = this.flyingPlanForm.get('destinationAirport')?.value;

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
              this.flyingPlanForm.patchValue({path: route.route});
            }
          });
      });
    } else {
      this.snackbar.open('Merci de renseigner l\'aéroport de départ et d\'arrivée', 'OK');
    }
  }
}
