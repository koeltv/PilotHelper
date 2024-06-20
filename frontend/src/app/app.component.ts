import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatIconAnchor, MatIconButton} from "@angular/material/button";
import {MatSidenavContainer} from "@angular/material/sidenav";
import {MatDialog} from "@angular/material/dialog";
import {KeycloakEventType, KeycloakService} from "keycloak-angular";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbar, MatIcon, MatIconButton, MatAnchor, MatIconAnchor, RouterOutlet, MatSidenavContainer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  username: string | undefined;

  constructor(
    private router: Router,
    private authService: KeycloakService,
    public dialog: MatDialog
  ) {
  }

  public addAuthCookie(authService: KeycloakService) {
    authService.getToken().then(token => document.cookie = `Authorization=Bearer ${token}`);
  }

  public async ngOnInit() {
    await this.setupAuthentification();
  }

  private async setupAuthentification() {
    const service = this.authService;
    const addAuthCookie = this.addAuthCookie;

    service.keycloakEvents$.subscribe({
      next(event) {
        if (
          event.type == KeycloakEventType.OnAuthSuccess ||
          event.type == KeycloakEventType.OnAuthRefreshSuccess
        ) addAuthCookie(service);
      }
    });

    if (this.authService.isLoggedIn()) {
      addAuthCookie(this.authService);
      const profile = await this.authService.loadUserProfile();
      this.username = profile.username;
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  openLoginDialog(): void {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
    this.username = undefined;
  }
}
