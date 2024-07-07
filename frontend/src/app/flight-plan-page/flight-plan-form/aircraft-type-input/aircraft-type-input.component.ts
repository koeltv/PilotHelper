import {Component, Input} from '@angular/core';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {AbstractControl, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PlanningToolsService} from "../../../api/planning-tools.service";
import {AircraftType} from "../../../../shared/models/AircraftType";
import {Observable} from "rxjs";

@Component({
  selector: 'app-aircraft-type-input',
  standalone: true,
  imports: [
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatMenu,
    MatMenuItem,
    MatOption,
    MatSuffix,
    ReactiveFormsModule,
    MatMenuTrigger
  ],
  templateUrl: './aircraft-type-input.component.html',
  styleUrl: './aircraft-type-input.component.css'
})
export class AircraftTypeInputComponent {
  constructor(private planningToolsService: PlanningToolsService) {
  }

  @Input({transform: (value: AbstractControl): FormControl => <FormControl>value}) control!: FormControl<string | AircraftType | null>;
  @Input() name!: string;

  public options: AircraftType[] = [];
  public filteredOptions: AircraftType[] = [];
  public filterBy: string = 'icao';

  setFilterTo(filter: string) {
    if (filter != this.filterBy) {
      this.options = [];
      this.filteredOptions = [];
      this.control.patchValue('');
    }
    this.filterBy = filter;
  }

  filterAircraftTypesBy(aircraftTypes: AircraftType[], filter: string, value: string): AircraftType[] {
    return aircraftTypes.filter(it => {
      let searchCriteria: string | null;
      if (filter == 'icao') searchCriteria = it.designator;
      else searchCriteria = it.name;
      return searchCriteria?.toUpperCase().includes(value);
    });
  }

  handleAircraftTypeAutocomplete(): void {
    const aircraftType = this.control.value;
    if (!aircraftType || typeof aircraftType != 'string') return;

    const typedInput = aircraftType.toUpperCase();

    if (typedInput.length <= 1) {
      this.options = [];
      this.filteredOptions = [];
      return;
    }

    if (this.options.length == 0) {
      let promisedAircraftTypes: Observable<AircraftType[]>;
      if (this.filterBy == 'icao') promisedAircraftTypes = this.planningToolsService.getAircraftTypesByType(typedInput);
      else promisedAircraftTypes = this.planningToolsService.getAircraftTypesByName(typedInput);

      promisedAircraftTypes.subscribe(aircraftTypes => {
        this.options = aircraftTypes;
        this.filteredOptions = this.filterAircraftTypesBy(this.options, this.filterBy, typedInput);
      });
    } else {
      this.filteredOptions = this.filterAircraftTypesBy(this.options, this.filterBy, typedInput)
    }
  }

  displayAircraftType(aircraftType: AircraftType | string | null): string {
    if (aircraftType == null) return '';
    if (typeof aircraftType == 'string') return aircraftType;
    return aircraftType.designator ? aircraftType.designator : 'ZZZZ';
  }

}
