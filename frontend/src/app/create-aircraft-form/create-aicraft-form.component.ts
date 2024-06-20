import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AirCraft} from "../../shared/models/AirCraft";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AircraftTypeInputComponent} from "../flying-plan-form/aircraft-type-input/aircraft-type-input.component";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

interface TurbulenceType {
  value: string,
  description: string,
}

@Component({
  selector: 'personal-aircraft-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormField, MatInput, MatLabel, AircraftTypeInputComponent, MatSelect, MatOption, MatFabButton, MatIcon],
  templateUrl: './create-aicraft-form.component.html',
  styleUrls: ['./create-aircraft-form.component.css']
})
export class PersonalAircraftFormComponent {
  @Output() aircraftCreated = new EventEmitter<AirCraft>();
  readonly turbulenceType: TurbulenceType[] = [
    {value: 'L', description: 'Léger (MTOW <= 7t)'},
    {value: 'M', description: 'Moyen (7t < MTOW <= 136t)'},
    {value: 'H', description: 'Lourd (MTOW > 136t)'},
    {value: 'J', description: 'Super (spécifique à l\'A380)'},
  ];

  aircraftForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.aircraftForm = this.fb.group({
      airCraftId: ['', Validators.required],
      airCraftType: ['', Validators.required],
      turbulenceType: ['', Validators.required],
      equipment: ['', Validators.required],
      transponder: ['', Validators.required],
      colorAndMarkings: ['']
    });
  }

  onSubmit() {
    const newAircraft = new AirCraft(
      this.aircraftForm.value.airCraftId,
      this.aircraftForm.value.airCraftType.designator,
      this.aircraftForm.value.turbulenceType,
      this.aircraftForm.value.equipment,
      this.aircraftForm.value.transponder,
      this.aircraftForm.value.colorAndMarkings
    );
    this.aircraftCreated.emit(newAircraft);
    this.aircraftForm.reset();
  }
}
