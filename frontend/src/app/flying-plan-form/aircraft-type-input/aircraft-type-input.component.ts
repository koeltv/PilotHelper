import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {AbstractControl, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {PlanningToolsService} from "../../api/planning-tools.service";
import {AirCraftType} from "../../../shared/models/AirCraftType";
import {Observable} from "rxjs";

@Component({
  selector: 'aircraft-type-input',
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
  constructor(
    private dialog: MatDialog,
    private planningToolsService: PlanningToolsService,
  ) {
  }


  @Input({transform: (value: AbstractControl): FormControl<any> => <FormControl<any>>value}) control!: FormControl;
  @Input() name!: string;

  @ViewChild('aircraftTypeInput') aircraftTypeInput!: ElementRef<HTMLInputElement>;

  public options: AirCraftType[] = [];
  public filteredOptions: AirCraftType[] = [];
  public filterBy: string = 'icao';

  setFilterTo(filter: string) {
    if (filter != this.filterBy) {
      this.options = [];
      this.filteredOptions = [];
      this.aircraftTypeInput.nativeElement.value = '';
    }
    this.filterBy = filter;
  }

  filterAircraftTypesBy(aircraftTypes: AirCraftType[], filter: string, value: string): AirCraftType[] {
    return aircraftTypes.filter(it => {
      let searchCriteria: string | null;
      if (filter == 'icao') searchCriteria = it.designator;
      else searchCriteria = it.name;
      return searchCriteria?.toUpperCase().includes(value);
    });
  }

  handleAircraftTypeAutocomplete(): void {
    const typedInput = this.aircraftTypeInput.nativeElement.value.toUpperCase();

    if (typedInput.length <= 1) {
      this.options = [];
      this.filteredOptions = [];
      return;
    }

    if (this.options.length == 0) {
      let promisedAircraftTypes: Observable<AirCraftType[]>;
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

  displayAircraftType(aircraftType: AirCraftType | string | undefined): string {
    if (aircraftType == undefined) return '';
    if (typeof aircraftType == 'string') return 'ZZZZ';
    return aircraftType.designator ? aircraftType.designator : 'ZZZZ';
  }

}
