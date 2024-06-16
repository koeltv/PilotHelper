import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {LoginData} from "../dialog/login-dialog/login-dialog.component";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private cookieOptions = "path=/; Secure=true; SameSite=None";
  private cookieLifetime = 10 * 60 * 60 * 1000; // 10 hours in milliseconds

  constructor(private client: HttpClient) {
  }

  private getCookie(cookieName: string): string | null {
    const name = cookieName + "=";
    const decodedCookies = decodeURIComponent(document.cookie);
    const cookieList = decodedCookies.split(';');
    for (let cookie of cookieList) {
      let trimmedCookie = cookie;
      while (trimmedCookie.startsWith(' ')) {
        trimmedCookie = trimmedCookie.substring(1);
      }
      if (trimmedCookie.startsWith(name)) {
        return trimmedCookie.substring(name.length, trimmedCookie.length);
      }
    }
    return null;
  }

  login(loginData: LoginData): Observable<any> {
    const body = new HttpParams()
      .set('client_id', environment.authentification.clientId)
      .set('client_secret', environment.authentification.clientSecret)
      .set('grant_type', 'password')
      .set('scope', 'openid')
      .set('username', loginData.login)
      .set('password', loginData.password);

    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

    return this.client.post<any>(`${environment.authentification.url}/token`, body.toString(), {headers: headers})
      .pipe(
        map(response => {
          const accessToken = response["access_token"];

          const date = new Date();
          date.setTime(date.getTime() + this.cookieLifetime);
          const expires = `expires=${date.toUTCString()}`;

          document.cookie = `Authorization=Bearer ${accessToken}; ${expires}; ${this.cookieOptions}`;
          document.cookie = `${environment.authentification.cookieName}=${accessToken}; ${expires}; ${this.cookieOptions}`;
        })
      );
  }

  logout() {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const equalPosition = cookie.indexOf("=");
      const name = equalPosition > -1 ? cookie.slice(0, equalPosition) : cookie;
      document.cookie = name + `=;expires=Thu, 01 Jan 1970 00:00:01 GMT; ${this.cookieOptions}`;
    }
  }

  checkForLogin(): boolean {
    const token = this.getCookie(environment.authentification.cookieName);
    return !!token;
  }

  getUserInfo(): Observable<any> | undefined {
    const token = this.getCookie(environment.authentification.cookieName);
    if (token) {
      const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
      return this.client.get(`${environment.authentification.url}/userinfo`, {headers: headers});
    } else {
      return undefined;
    }
  }
}
