import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Role } from 'app/common/role';
import { RoleFunction } from 'app/common/role-function';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Observable, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild, CanLoad {
  user: User;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
     * Constructor
     */
  constructor(
    private _userService: UserService,
    private _router: Router
  ) {

     // Subscribe to the user service
     this._userService.user$
     .pipe((takeUntil(this._unsubscribeAll)))
     .subscribe((user: User) => {
         this.user = user;
     });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthorized(route);
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthorized(childRoute);
  }

  canLoad(route: ActivatedRouteSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.isAuthorized(route);
  }

  isAuthorized(route: ActivatedRouteSnapshot): boolean {

    const expectedRoles = route.data.expectedRoles;
    if(expectedRoles && !expectedRoles.some((r: any) => this.hasRole(r))){
      return false;
    }
    return true;
  }

  hasRole(role: Role) {
    return this.user && this.user.empRole === role;
  }

  hasFunction(userFunction: RoleFunction){
    return this.user && this.user.empFunctions.some((r: RoleFunction) => r === userFunction)
  }
}
