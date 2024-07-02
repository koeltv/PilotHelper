import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {Aircraft} from "../../../shared/models/Aircraft";
import {AircraftFormComponent} from "../aircraft-form/aircraft-form.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-select-aircraft',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AircraftFormComponent, MatLabel, MatSelect, MatOption, MatFormField],
  templateUrl: './select-aircraft.component.html',
  styleUrls: ['./select-aircraft.component.css']
})

export class SelectAircraftComponent implements OnChanges {

  @Input() aircraftList!: Aircraft[];
  @Output() updatedAircraftList = new EventEmitter<Aircraft[]>();
  selected: Aircraft | undefined;
  visibleAircrafts: Aircraft[] = this.aircraftList;

  filterChange(value: Aircraft | undefined) {
    if (value) {
      this.visibleAircrafts = [value];
    } else {
      this.visibleAircrafts = this.aircraftList;
    }
    this.updatedAircraftList.emit(this.visibleAircrafts);
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.selected = undefined;
    this.filterChange(this.selected);
  }
}
