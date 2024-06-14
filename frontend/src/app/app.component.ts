import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatIconAnchor, MatIconButton} from "@angular/material/button";
import {MatSidenavContainer} from "@angular/material/sidenav";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbar, MatIcon, MatIconButton, MatAnchor, MatIconAnchor, RouterOutlet, MatSidenavContainer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor(private router: Router) {
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
