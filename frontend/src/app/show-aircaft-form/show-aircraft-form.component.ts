import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {AirCraft} from "../../shared/models/AirCraft";
import {PersonalAircraftFormComponent} from "../create-aircraft-form/create-aicraft-form.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'show-aircraft-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PersonalAircraftFormComponent, MatLabel, MatSelect, MatOption, MatFormField],
  templateUrl: './show-aircraft-form.component.html',
  styleUrls: ['./show-aircraft-form.component.css']
})

export class ShowAircraftForm implements OnChanges {

  @Input() airCraftList!: AirCraft[];
  @Output() updatedAircraftList = new EventEmitter<AirCraft[]>();
  selected: AirCraft | undefined;
  visibleAircrafts: AirCraft[] = this.airCraftList;

  filterChange(value: AirCraft | undefined) {
    if (value) {
      this.visibleAircrafts = [value];
    } else {
      this.visibleAircrafts = this.airCraftList;
    }
    this.updatedAircraftList.emit(this.visibleAircrafts);
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.selected = undefined;
    this.filterChange(this.selected);
  }
}
