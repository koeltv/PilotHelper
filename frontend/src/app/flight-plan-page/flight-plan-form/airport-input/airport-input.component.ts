import {Component, Input} from '@angular/core';
import {AbstractControl, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {Airport} from "../../../../shared/models/Airport";
import {Observable} from "rxjs";
import {PlanningToolsService} from "../../../api/planning-tools.service";
import {MatDialog} from "@angular/material/dialog";
import {NearbyAirportDialogComponent} from "./nearby-airport-dialog/nearby-airport-dialog.component";
import {AircraftType} from "../../../../shared/models/AircraftType";

@Component({
  selector: 'app-airport-input',
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
  templateUrl: './airport-input.component.html',
  styleUrl: './airport-input.component.css'
})
export class AirportInputComponent {

  constructor(
    private dialog: MatDialog,
    private planningToolsService: PlanningToolsService,
  ) {
  }

  @Input({transform: (value: AbstractControl): FormControl => <FormControl>value}) control!: FormControl<string | AircraftType | null>;
  @Input() name!: string;

  public options: Airport[] = [];
  public filteredOptions: Airport[] = [];
  public filterBy: string = 'icao';

  setFilterTo(filter: string) {
    if (filter != this.filterBy) {
      this.options = [];
      this.filteredOptions = [];
      this.control.patchValue('');
    }
    this.filterBy = filter;
  }

  filterAirportsBy(airports: Airport[], filter: string, value: string): Airport[] {
    return airports.filter(it => {
      let searchCriteria: string | null;
      if (filter == 'icao') searchCriteria = it.icaoCode;
      else if (filter == 'iata') searchCriteria = it.iataCode;
      else searchCriteria = it.name;
      return searchCriteria?.toUpperCase().includes(value);
    });
  }

  handleAirportAutocomplete(): void {
    const airport = this.control.value;
    if (!airport || typeof airport != 'string') return;

    const typedInput = airport.toUpperCase();

    if (typedInput.length <= 1) {
      this.options = [];
      this.filteredOptions = [];
      return;
    }

    if (this.options.length == 0) {
      let promisedAirports: Observable<Airport[]>;
      if (this.filterBy == 'icao') promisedAirports = this.planningToolsService.getAirportsByICAO(typedInput);
      else if (this.filterBy == 'iata') promisedAirports = this.planningToolsService.getAirportsByIATA(typedInput);
      else promisedAirports = this.planningToolsService.getAirportsByName(typedInput);

      promisedAirports.subscribe(airports => {
        this.options = airports;
        this.filteredOptions = this.filterAirportsBy(this.options, this.filterBy, typedInput);
      });
    } else {
      this.filteredOptions = this.filterAirportsBy(this.options, this.filterBy, typedInput)
    }
  }

  displayAirport(airport: Airport | string | null): string {
    if (airport == null) return '';
    if (typeof airport == 'string') return airport;
    return airport.icaoCode ? airport.icaoCode : 'ZZZZ';
  }

  suggestNearbyAirports() {
    this.dialog
      .open(NearbyAirportDialogComponent)
      .afterClosed()
      .subscribe(airport => {
        if (airport) {
          this.control.patchValue(airport);
        }
      });
  }
}
