import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatIconAnchor, MatIconButton} from "@angular/material/button";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatDialog} from "@angular/material/dialog";
import {KeycloakEventType, KeycloakService} from "keycloak-angular";
import {NgOptimizedImage} from "@angular/common";
import {PlaneAnimatedComponent} from "./plane-animated/plane-animated.component";
import {MediaMatcher} from "@angular/cdk/layout";
import {MatListItem, MatNavList} from "@angular/material/list";

class NavElement {
  constructor(
    public name: string,
    public path: string
  ) {
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbar, MatIcon, MatIconButton, MatAnchor, MatIconAnchor, RouterOutlet, MatSidenavContainer, MatSidenavContent, NgOptimizedImage, PlaneAnimatedComponent, MatSidenav, MatNavList, MatListItem, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  username: string | undefined;
  mobileQuery: MediaQueryList;

  navElements: NavElement[] = [
    {path: '/', name: 'PilotHelper'},
    {path: '/aircraft', name: 'Mes aéronefs'},
    {path: '/my-flyingplans', name: 'Mes plans de vol'},
    {path: '/flyingplan', name: 'Planifier un vol'},
  ];

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private authService: KeycloakService,
    public dialog: MatDialog
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQuery.addEventListener('change', () => changeDetectorRef.detectChanges())
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
