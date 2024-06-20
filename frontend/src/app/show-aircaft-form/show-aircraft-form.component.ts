import {Component, EventEmitter, Input, Output} from "@angular/core";
import {AirCraft} from "../../shared/models/AirCraft";
import {PersonalAircraftFormComponent} from "../create-aircraft-form/create-aicraft-form.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'show-aircraft-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PersonalAircraftFormComponent],
  templateUrl: './show-aircraft-form.component.html',
  styleUrls: ['./show-aircraft-form.component.css']
})

export class showAircraftForm{

  @Input()airCraftList!: AirCraft[];
  @Output()visibleAirCraftList = new EventEmitter<AirCraft[]>();
  listFilter : string = '0';
  visibleAircraft : AirCraft[] = this.airCraftList;

  filterChange (value : any){
    if (value === '0'){
      this.visibleAircraft = this.airCraftList;
    } else {
      this.visibleAircraft = [this.airCraftList[value-1]];
    }
    this.visibleAirCraftList.emit(this.visibleAircraft);
  }

}
