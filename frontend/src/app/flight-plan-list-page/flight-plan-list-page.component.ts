import {ChangeDetectorRef, Component} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {FlightPlanService} from '../api/flight-plan.service';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {FlightPlan} from '../../shared/models/FlightPlan';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {Clipboard} from '@angular/cdk/clipboard';
import {environment} from '../../environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {MediaMatcher} from '@angular/cdk/layout';

class Source {
  constructor(
    public url: string,
    public withCredentials: boolean = true
  ) {
  }
}

export class FlightPlanPdf {
  public source: Source;

  constructor(
    public id: number,
    public flightPlan: FlightPlan,
  ) {
    this.source = new Source(`${environment.backendUrl}/flight-plan/${id}/pdf`);
  }
}

@Component({
  selector: 'app-flight-plan-list-page',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    PdfViewerModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './flight-plan-list-page.component.html',
  styleUrl: './flight-plan-list-page.component.css'
})
export class FlightPlanListPageComponent {
  flightPlanPdfs: FlightPlanPdf[] = [];
  mobileQuery: MediaQueryList;
  tabletQuery: MediaQueryList;

  constructor(
    private flightPlanService: FlightPlanService,
    private clipboard: Clipboard,
    private dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.refreshFlightPlans();
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.tabletQuery = media.matchMedia('(max-width: 800px)');
    this.mobileQuery.addEventListener('change', () => changeDetectorRef.detectChanges());
    this.tabletQuery.addEventListener('change', () => changeDetectorRef.detectChanges());
  }

  private refreshFlightPlans() {
    this.flightPlanService.readAllFlightPlans().subscribe(flightPlansWithId => {
      this.flightPlanPdfs = [];
      for (const flightPlanWithId of flightPlansWithId) {
        this.flightPlanPdfs.push(new FlightPlanPdf(flightPlanWithId.id, flightPlanWithId.flightPlan));
      }
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  copyLink(url: string) {
    this.clipboard.copy(url);
  }

  deleteFlightPlan(id: number) {
    this.dialog.open(ConfirmationDialogComponent)
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.flightPlanService.deleteFlightPlan(id).subscribe(() => {
            this.refreshFlightPlans();
          });
        }
      });
  }
}
