import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanDeactivateComponent } from '../share/interfaces/can-deactivate-component';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';

/* 用来阻止页面跳转的服务 */
@Injectable({
  providedIn: 'root'
})
export class RoutePreventService implements CanDeactivate<CanDeactivateComponent> {

  constructor(private authService: AuthService, private globalService: GlobalService) {
  }

  public canDeactivate(component: CanDeactivateComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | Observable<boolean> {
    if (!this.authService.isLoggedIn) {
      // 未登录时不做页面阻止操作
      return true;
    }

    if ((this.globalService.http403Page && this.globalService.http403Page.http403Flag) || (this.globalService.http500Page && this.globalService.http500Page.http500Flag)) {
      // 当页面报错,500或403时也不阻止页面跳转
      return true;
    }

    return Observable.create(observer => {
      if (!component.canDeactivate()) {
        // 如果修改过页面信息则弹出提示
        this.globalService.confirmationBox.open('操作未完成，是否放弃？', () => {
          this.globalService.confirmationBox.close();
          observer.next(true);
          observer.complete();
        }, '确定', () => {
          observer.next(false);
          observer.complete();
        });
      } else {
        observer.next(true);
        observer.complete();
      }
    });
  }
}
