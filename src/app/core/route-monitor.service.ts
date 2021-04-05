import {Injectable, EventEmitter} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from '@angular/router';

/* 路由状态监听 */
@Injectable({
  providedIn: 'root'
})
export class RouteMonitorService implements CanActivate, CanActivateChild {

  private path: string;

  /* 获取当前的路径 */
  public get curPath(): string {
    return this.path;
  }

  public routePathChanged: EventEmitter<string> = new EventEmitter();

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.path = state.url;
    this.routePathChanged.emit(state.url);
    return true;
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.path = state.url;
    this.routePathChanged.emit(state.url);
    return true;
  }
}
