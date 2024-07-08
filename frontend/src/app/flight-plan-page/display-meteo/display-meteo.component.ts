import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PlanningToolsService} from '../../api/planning-tools.service';
import {Cloud} from '../../../shared/models/Weather';
import {NgIf} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {Airport} from '../../../shared/models/Airport';

@Component({
  selector: 'app-display-meteo',
  standalone: true,
  imports: [
    NgIf,
    MatListModule,
    MatCardModule
  ],
  templateUrl: './display-meteo.component.html',
  styleUrl: './display-meteo.component.css'
})

export class DisplayMeteoComponent implements OnChanges {
  @Input() airport!: string | Airport | null;

  nameDisplay: string = 'Entrez un aéroport pour y voir la météo !';
  conditionDisplay: string = '';
  temperatureDisplay: string = '';
  dewpointDisplay: string = '';
  pressureDisplay: string = '';
  windsDisplay: string = '';
  visibilityDisplay: string = '';
  cloudsDisplay: string = '';

  constructor(private planningToolService: PlanningToolsService) {
  }

  ngOnChanges(_changes: SimpleChanges) {
    if (this.airport) {
      const airportCode = typeof this.airport == 'string' ? this.airport : (this.airport.icaoCode ?? 'ZZZZ');

      if (airportCode.length == 4) {
        this.displayWeatherFunction(airportCode);
      } else {
        this.reset();
        this.nameDisplay = 'Entrez un aéroport pour y voir la météo !';
      }
    }
  }

  reset() {
    this.nameDisplay = '';
    this.conditionDisplay = '';
    this.temperatureDisplay = '';
    this.dewpointDisplay = '';
    this.pressureDisplay = '';
    this.windsDisplay = '';
    this.visibilityDisplay = '';
    this.cloudsDisplay = '';
  }

  displayWeatherFunction(airportCode: string) {
    this.planningToolService.getWeatherInfoFor(airportCode).subscribe(info => {
      if (!info) {
        this.nameDisplay = `Aucune information pour ${airportCode}`;
        return;
      }

      this.nameDisplay = `<b>METAR pour :</b> ${info.name} `;
      this.conditionDisplay = `<b>Conditions &agrave;:</b> ${this.unixToTimespan(info.obsTime).toLocaleString()} `;
      this.temperatureDisplay = `<b>Temperature:</b>	${info.temp}°C (${this.celsiusToFahrenheit(info.temp)}°F) `;
      this.dewpointDisplay = `<b>Point de ros&eacute;e:</b>	${info.dewp}°C (${this.celsiusToFahrenheit(info.dewp)} °F) `;
      this.pressureDisplay = `<b>Pressure (altimeter):</b>	${this.mbToInchHg(info.altim)}  inches Hg (${info.altim} mb)`;
      this.windsDisplay = `<b>Vents:</b> ${this.degToCompass(info.wdir)} (${info.wdir} degrés) à ${this.ktToMph(info.wspd)} MPH (${info.wspd} knots; ${this.ktToMs(info.wspd)} m/s)`;
      this.visibilityDisplay = `<b>Visibilit&eacute;:</b>	${this.visibilityDecode(info.visib)}`;
      this.cloudsDisplay = `<b>Nuages:</b> ${this.cloudInfoDisplay(info.clouds)}`;
    });
  }

  cloudInfoDisplay(clouds: Cloud[] | undefined) {
    let cloudsSentence = '';
    if (clouds) {
      clouds.forEach(cloud => {
        if (cloud.base != null) {
          cloudsSentence += `${this.coverAbbreviationToCover(cloud.cover)} à ${cloud.base} pieds, `;
        } else {
          cloudsSentence += `${this.coverAbbreviationToCover(cloud.cover)}`;
        }
      });
    }
    return cloudsSentence;
  }

  visibilityDecode(visibility: string): string {
    if (visibility == '6+') {
      return '6+ sm (10+ km)';
    } else {
      const visibilityInKm = (Number(visibility) * 1.60934).toFixed(2);
      return `${visibility} sm ( ${visibilityInKm} km)`;
    }
  }

  degToCompass(num: number) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ['Nord', 'Nord-Nord-Est', 'Nord-Est', 'Est-Nord-Est', 'Est', 'Est-Sud-Est', 'Sud-Est', 'Sud-Sud-Est', 'Sud', 'Susuroît', 'Suroît', 'Ouest-Suroît', 'Ouest', 'Ouest-Noroît', 'Noroît', 'Nord-Noroît'];
    return arr[(val % 16)];
  }

  ktToMph(num: number) {
    return (1.15 * num).toFixed(2);
  }

  ktToMs(num: number) {
    return (0.514444 * num).toFixed(2);
  }

  celsiusToFahrenheit(num: number) {
    return (2 * num + 30).toFixed(2);
  }

  coverAbbreviationToCover(coverShorthand: string) {
    switch (coverShorthand) {
      case 'FEW': {
        return 'peu de nuages';
      }
      case 'SCT': {
        return 'nuages épars';
      }
      case 'BKN': {
        return 'nuages fragmentés';
      }
      case 'OVC': {
        return 'couverts';
      }
      case 'CAVOK': {
        return 'Le plafond et la visibilité sont OK';
      }
      default: {
        return 'Il y a eu une erreur.';
      }
    }
  }

  mbToInchHg(mb: number) {
    return (mb / 33.8639).toFixed(2);
  }

  unixToTimespan(unix: number) {
    return new Date(unix * 1000);
  }
}
