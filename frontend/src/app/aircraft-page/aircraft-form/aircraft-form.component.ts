import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Aircraft} from "../../../shared/models/Aircraft";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {
  AircraftTypeInputComponent
} from "../../flight-plan-page/flight-plan-form/aircraft-type-input/aircraft-type-input.component";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

interface TurbulenceType {
  value: string,
  description: string,
}

@Component({
  selector: 'app-aircraft-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormField, MatInput, MatLabel, AircraftTypeInputComponent, MatSelect, MatOption, MatFabButton, MatIcon],
  templateUrl: './aircraft-form.component.html',
  styleUrls: ['./aircraft-form.component.css']
})
export class AircraftFormComponent implements OnInit {
  @Input() form!: FormGroup

  @Output() aircraftCreated = new EventEmitter<Aircraft>();
  readonly turbulenceType: TurbulenceType[] = [
    {value: 'L', description: 'Léger (MTOW <= 7t)'},
    {value: 'M', description: 'Moyen (7t < MTOW <= 136t)'},
    {value: 'H', description: 'Lourd (MTOW > 136t)'},
    {value: 'J', description: 'Super (spécifique à l\'A380)'},
  ];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (!this.form) {
      this.form = this.fb.group({
        aircraftId: ['', Validators.required],
        aircraftType: ['', Validators.required],
        turbulenceType: ['', Validators.required],
        equipment: ['', Validators.required],
        transponder: ['', Validators.required],
        colorAndMarkings: ['']
      });
    }
  }

  onSubmit() {
    const designator = typeof this.form.value.aircraftType == 'string' ? this.form.value.aircraftType : this.form.value.aircraftType.designator;

    const newAircraft = new Aircraft(
      this.form.value.aircraftId,
      designator,
      this.form.value.turbulenceType,
      this.form.value.equipment,
      this.form.value.transponder,
      this.form.value.colorAndMarkings
    );
    this.aircraftCreated.emit(newAircraft);
    this.form.reset();
  }
}
