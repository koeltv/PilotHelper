import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatIconAnchor, MatIconButton} from "@angular/material/button";
import {MatSidenavContainer} from "@angular/material/sidenav";
import {AuthentificationService} from "./api/authentification.service";
import {MatDialog} from "@angular/material/dialog";
import {LoginData, LoginDialogComponent} from "./dialog/login-dialog/login-dialog.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbar, MatIcon, MatIconButton, MatAnchor, MatIconAnchor, RouterOutlet, MatSidenavContainer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  username: string | undefined;

  constructor(
    private router: Router,
    private authentificationService: AuthentificationService,
    public dialog: MatDialog
  ) {
    if (this.authentificationService.checkForLogin()) {
      this.updateLoginState();
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  updateLoginState() {
    this.authentificationService.getUserInfo()?.subscribe(data => {
      this.username = data.name;
    });
  }

  openLoginDialog(): void {
    this.dialog
      .open(LoginDialogComponent, {data: new LoginData()})
      .afterClosed()
      .subscribe(data => {
        if (data != undefined) {
          this.authentificationService.login(data).subscribe(_ => {
            this.updateLoginState();
          });
        }
      });
  }

  logout() {
    this.authentificationService.logout();
    this.username = undefined;
  }
}
