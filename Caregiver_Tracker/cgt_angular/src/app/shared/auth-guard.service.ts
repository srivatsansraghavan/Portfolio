import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private auth: AuthService, public router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const destinationUrl = state.url;
    return this.auth.isLoggedIn$.pipe(
      take(1),
      switchMap((isLoggedIn) => {
        console.log('AuthGuardService: isLoggedIn =', isLoggedIn);
        if (!isLoggedIn) {
          return this.auth.isUserLoggedIn();
        }
        return of(isLoggedIn);
      }),
      map((isLoggedIn) => {
        console.log('AuthGuardService: isLoggedIn after check =', isLoggedIn);
        if (isLoggedIn && destinationUrl === '/login') {
          this.router.navigate(['/cgt/home']);
          return false;
        }
        if (!isLoggedIn && destinationUrl !== '/login') {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }));
  }
}
