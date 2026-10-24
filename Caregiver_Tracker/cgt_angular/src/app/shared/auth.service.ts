import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { ToastService } from './toast/toast.service';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper;
  firstLogin = new Subject<boolean>();
  private loggedIn$ = new BehaviorSubject<boolean>(false);
  loggedInUser: string;
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.jwtHelper = new JwtHelperService();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  signUpUser(email_id: string, pass_word: string, full_name: string) {
    this.httpClient
      .post(
        `${environment.expressURL}/user/add-user`,
        { email: email_id, password: pass_word, fullname: full_name },
        { observe: 'response' }
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.status === 200) {
            this.router.navigate(['cgt/home'], { state: { isFirstLogin: response.body } })
            this.toastService.show(
              'Sign up message',
              'Signed up successfully',
              'bg-success text-light sign-up-toast',
              true
            );
          }
        },
        error: () => {
          this.toastService.show(
            'Sign up message',
            'Sign up failed',
            'bg-danger text-light sign-up-toast',
            true
          );
        },
      });
  }

  loginUser(email_id: string, pass_word: string) {
    this.httpClient
      .post(
        `${environment.expressURL}/user/login-user`,
        {
          user_email: email_id,
          password: pass_word,
        },
        { observe: 'response', withCredentials: true }
      )
      .subscribe({
        next: (response: HttpResponse<{ firstLogin: boolean; user: { userEmail: string; userFullname: string; userName: string } }>) => {
          if (response.body.firstLogin) {
            this.firstLogin.next(response.body.firstLogin);
            this.router.navigate(['cgt/home'], { state: { isFirstLogin: true } })
          } else {
            this.loggedIn$.next(true);
            this.loggedInUser = email_id;
            this.router.navigate(['cgt/home'], { state: { isFirstLogin: false } })
            this.toastService.show(
              'Login message',
              'Logged in successfully',
              'bg-success text-light login-toast',
              true
            );
          };
        },
        error: (response: HttpErrorResponse) => {
          this.toastService.show(
            'Login message',
            response.error,
            'bg-danger text-light login-toast',
            true
          );
        },
      });
  }

  shouldAllow(): boolean {
    console.log('Logged in status:', this.loggedIn$.value);
    return this.loggedIn$.value;
  }

  loggedInUserEmail(): string {
    return this.loggedInUser;
  }

  doLogOut() {
    this.httpClient.delete(`${environment.expressURL}/user/logout-user`).subscribe({
      next: () => {
        this.loggedIn$.next(false);
        this.router.navigate(['login']);
        this.toastService.show(
          'Logout message',
          'You are now logged out',
          'bg-warning text-light logout-toast',
          true
        );
      }
    });
  }

  isUserLoggedIn() {
    return this.httpClient
      .get(
        `${environment.expressURL}/user/is-user-loggedin`,
        { observe: 'response', withCredentials: true }
      ).pipe(
        tap(() => this.loggedIn$.next(true)),
        map(() => true),
        catchError((error) => {
          console.error('Error checking user login status:', error);
          this.loggedIn$.next(false);
          return of(false);
        })
      )
  }
}
