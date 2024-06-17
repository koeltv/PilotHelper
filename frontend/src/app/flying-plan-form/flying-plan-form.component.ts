import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AirCraft} from "../../shared/models/AirCraft";
import {FlightPlan} from "../../shared/models/FlightPlan";
import {NgForOf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {PlanningToolsService} from "../api/planning-tools.service";
import {Airport} from "../../shared/models/Airport";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {SelectRouteDialogComponent} from "../dialog/select-route-dialog/select-route-dialog.component";
import {AirportInputComponent} from "./airport-input/airport-input.component";

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
  ],
  templateUrl: './flying-plan-form.component.html',
  styleUrl: './flying-plan-form.component.css'
})
export class FlyingPlanFormComponent implements OnChanges {

  @Input() selectedAircraft: AirCraft | null = null;
  @Output() formSubmit = new EventEmitter<FlightPlan>();
  @Output() formChange = new EventEmitter<{ [key: string]: any }>();
  flyingPlanForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private planningToolsService: PlanningToolsService,
  ) {
    this.flyingPlanForm = this.fb.group({
      flightRules: ['', Validators.required],
      flightType: ['', Validators.required],
      aircraftData: this.fb.group({
        aircraftId: [''],
        airCraftType: [''],
        turbulenceType: [''],
        equipment: [''],
        transponder: [''],
        colorAndMarkings: ['']
      }),
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
      equipement: this.fb.group({
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

    Object.keys(this.flyingPlanForm.controls).forEach(fieldName => {
      this.flyingPlanForm.get(fieldName)?.valueChanges.subscribe(newValue => {
        this.formChange.emit({[fieldName]: newValue});
      });
    });

  }


  get alternativeAirports(): FormArray {
    return this.flyingPlanForm.get('alternativeAirport') as FormArray;
  }

  get otherInformations(): FormArray {
    return this.flyingPlanForm.get('otherInformations') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedAircraft'] && this.selectedAircraft) {
      this.updateAircraftData(this.selectedAircraft);
    }
  }

  updateAircraftData(selectedAircraft: AirCraft) {
    this.flyingPlanForm.patchValue({
      aircraftData: {
        aircraftId: selectedAircraft.aircraftId,
        airCraftType: selectedAircraft.aircraftType,
        turbulenceType: selectedAircraft.turbulenceType,
        equipment: selectedAircraft.equipment,
        transponder: selectedAircraft.transponder,
        colorAndMarkings: selectedAircraft.colorAndMarkings
      }
    });
  }

  onSubmit() {
    if (this.flyingPlanForm.valid) {
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

  controlLenght(){

    console.log("there were a change");
  }
}
