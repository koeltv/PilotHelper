import {Component, Inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatActionList, MatListItem} from "@angular/material/list";
import {Route} from "../../../shared/models/Route";

@Component({
  selector: 'app-select-route-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatActionList,
    MatListItem,
    MatDialogClose
  ],
  templateUrl: './select-route-dialog.component.html',
  styleUrl: './select-route-dialog.component.css'
})
export class SelectRouteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public routes: Route[],
  ) {
  }
}
