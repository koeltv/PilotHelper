import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AirCraft} from "../../shared/models/AirCraft";

@Component({
  selector: 'personal-aircraft-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-aicraft-form.component.html',
  styleUrls: ['./create-aircraft-form.component.css']
})
export class PersonalAircraftFormComponent {
  @Output() aircraftCreated = new EventEmitter<AirCraft>();
  typeList : string[] = ['A','B','C','D','E','F'];
  turbulenceType : string[] = ['1','2','3','4','5'];

  aircraftForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.aircraftForm = this.fb.group({
      airCraftId: [''],
      airCraftType: [''],
      turbulenceType: [''],
      equipment: [''],
      transponder: [''],
      colorAndMarkings: ['']
    });
  }

  onSubmit() {
    const newAircraft = new AirCraft(
      this.aircraftForm.value.airCraftId,
      this.aircraftForm.value.airCraftType,
      this.aircraftForm.value.turbulenceType,
      this.aircraftForm.value.equipment,
      this.aircraftForm.value.transponder,
      this.aircraftForm.value.colorAndMarkings
    );
    this.aircraftCreated.emit(newAircraft);
    this.aircraftForm.reset();
  }
}
