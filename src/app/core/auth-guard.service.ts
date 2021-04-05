import { Injectable } from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route,
  CanActivateChild
} from '@angular/router';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';

/* 权限守卫 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanLoad, CanActivateChild {

  constructor(private router: Router, private authService: AuthService, private globalService: GlobalService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  public canLoad(route: Route): boolean {
    return this.checkLogin(`/${route.path}`);
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  /** 登录 */
  private checkLogin(url: string): boolean {
    // 根据当前的登录状态来控制页面跳转
    if (url === '/login') {
      if (this.authService.isLoggedIn) {
        this.router.navigate(['home']);
        return false;
      }
    } else {
      if (!this.authService.isLoggedIn) {
        this.router.navigate(['login']);
        return false;
      }
    }
    return true;
  }
}
