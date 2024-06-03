import {Component, EventEmitter, Input, Output} from "@angular/core";
import { airCraft } from "../../shared/models/airCraft";
import {PersonalAircraftFormComponent} from "../create-aircraft-form/create-aicraft-form.component";
import { NgForOf, CommonModule } from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'show-aircraft-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PersonalAircraftFormComponent],
  templateUrl: './show-aircraft-form.component.html',
  styleUrls: ['./show-aircraft-form.component.css']
})

export class showAircraftForm{

  @Input()airCraftList: airCraft[] = [];
  @Output()visibleAirCraftList = new EventEmitter<airCraft[]>();
  listFilter : string = '0';
  visibleAircraft : airCraft[] = this.airCraftList;

  filterChange (value : any){
    if (value === '0'){
      this.visibleAircraft = this.airCraftList;
    } else {
      this.visibleAircraft = [this.airCraftList[value-1]];
    }
    this.visibleAirCraftList.emit(this.visibleAircraft);
  }

}
