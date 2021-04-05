import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { EntityBase } from '../../utils/z-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class UserPermissionGroupEntity extends EntityBase {
  public permission_group_id: string = undefined; // string	T	权限组id
  public english_name: string = undefined; // string	T	权限组名称(英文)
  public chinese_name: string = undefined; // string	T	权限组名称(中文)
  public is_deleted: string = undefined; // bool  T	是否刪除
  public created_time: string = undefined; // double	T	创建时间
  public updated_time: string = undefined; // double	T	更新时间
}

export class UserEntity extends EntityBase {
  public role: number = undefined; // 角色 1:平台用户 2: 系统厂商 3: 物业公司
  public username: string = undefined; // String	员工id
  public realname: string = undefined; // String	姓名
  public telephone: string = undefined; // Array	联系方式
  public email: string = undefined; // String	邮箱
  public permission_groups: Array<UserPermissionGroupEntity> = undefined; // Array	权限组
  public department: string = undefined; // String	部门
  public remarks: string = undefined; // String	备注
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
  public is_superuser: boolean = undefined; // 是否为管理员

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'permission_groups') {
      return UserPermissionGroupEntity;
    }
    return null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn = false;
  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  private _user: UserEntity;
  public get user(): UserEntity {
    return this._user;
  }

  constructor(private router: Router, private httpService: HttpService) {
  }

  /**
   * 秘钥方式授权直接授权
   * @param user 当前用户
   */
  public authorizeBySecretKey(user: UserEntity) {
    this._user = user;
    this._isLoggedIn = !(user === null || user === undefined);
  }

  /**
   * 登录方式授权获取用户信息
   */
  public authorizeByLogin() {
    this.httpService.get(environment.CIPP_UNIVERSE + '/user').subscribe(data => {
      this._user = UserEntity.Create(data['body']);
      this._isLoggedIn = true;
      this.router.navigate(['', 'home']);
    });
  }

  /**
   * 刷新授权信息(修改用户权限时调用)
   */
  public refreshAuthorize() {
    this.httpService.get(environment.CIPP_UNIVERSE + '/user').subscribe(data => {
      this._user = UserEntity.Create(data['body']);
    });
  }

  /**
   * 检查权限是否授权
   * @param permissions 权限英文名集合
   * @returns boolean 是否有权限
   */
  public checkPermissions(permissions: Array<string>): boolean {
    if (this.user) {
      if (this.user.is_superuser) {
        return true;
      }
      for (const permission of this.user.permission_groups) {
        if (permissions.indexOf(permission.english_name) >= 0) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  /**
   * 授权失败时踢出登录状态
   */
  public kickOut() {
    this._isLoggedIn = false;
    this._user = null;
    this.router.navigate(['login']);
  }

  /**
   * 登出
   */
  public logout() {
    this.httpService.post(environment.CIPP_UNIVERSE + '/logout').subscribe(() => {
      this._isLoggedIn = false;
      this._user = null;
      this.router.navigate(['login']);
    });
  }

  /**
   * 请求权限组列表
   * @returns Array<UserPermissionGroupEntity> 权限组列表
   */
  public requestPermissionGroups(): Observable<Array<UserPermissionGroupEntity>> {
    return this.httpService.get(environment.CIPP_UNIVERSE + '/permission_groups').pipe(map(data => {
      const json = data['body'];
      const tempGroups = [];
      json.forEach(jsonObj => {
        tempGroups.push(UserPermissionGroupEntity.Create(jsonObj));
      });
      return tempGroups;
    }));
  }
}

/*
chinese_name: "实时信息", english_name: "realtime_info"
chinese_name: "数据统计", english_name: "data_statistics"
chinese_name: "数据记录", english_name: "data_record"
chinese_name: "员工管理", english_name: "user"
chinese_name: "停车记录导出", english_name: "parking_record_export"
* */
