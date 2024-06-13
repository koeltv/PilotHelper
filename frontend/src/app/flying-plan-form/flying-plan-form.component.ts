import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { airCraft} from "../../shared/models/airCraft";
import { FlightPlan} from "../../shared/models/FlightPlan";


@Component({
  selector: 'app-flying-plan-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './flying-plan-form.component.html',
  styleUrl: './flying-plan-form.component.css'
})
export class FlyingPlanFormComponent implements OnChanges{

  @Input() selectedAircraft: airCraft | null = null;
  @Output() formSubmit = new EventEmitter<FlightPlan>();

  flyingPlanForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
      startingAirport: ['', Validators.required],
      startingTime: ['', Validators.required],
      cruisingSpeed: ['', Validators.required],
      cruisingAltitude: ['', Validators.required],
      path: ['', Validators.required],
      destinationAirport: ['', Validators.required],
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

  updateAircraftData(selectedAircraft: airCraft) {
    this.flyingPlanForm.patchValue({
      aircraftData: {
        aircraftId: selectedAircraft.aircraftId,
        airCraftType: selectedAircraft.airCraftType,
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
}
