import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpService } from '../../core/http.service';
import { EntityBase } from '../../../utils/z-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class UserInfoEntity extends EntityBase {
  public username: string = undefined; // 用户名
  public access_token: string = undefined;
  public refresh_token: string = undefined;
  public expires_in: number = undefined;
}

export class LoginParams extends EntityBase {
  public username: string = undefined;	 // T	用户账号
  public password: string = undefined;	// T	用户密码
}

export class LoginResultEntity extends EntityBase {
  public role: number; // 角色 1:平台用户 2: 系统厂商 3: 物业公司
  public username: string = undefined;
}

export class ChangePasswordParams extends EntityBase {
  public old_password: string = undefined;	 // T	原始密码
  public new_password: string = undefined;	// T	新密码
}

@Injectable({
  providedIn: 'root'
})
export class LoginHttpService {

  private domain = environment.CIPP_UNIVERSE;

  constructor(private httpService: HttpService) {
  }

  /**
   * 请求登录
   * @param username 名称
   * @param password 密码
   * @returns Observable<LoginResultEntity>
   */
  public requestLogin(params: LoginParams): Observable<LoginResultEntity> {
    const body = {
      username: params.username,
      password: params.password,
    };
    return this.httpService.postFormData(environment.CIPP_UNIVERSE + '/login', body)
      .pipe(map(data => LoginResultEntity.Create(data.body)));
  }

  /**
   * 请求修改密码
   * @param old_password 旧密码
   * @param new_password 新密码
   * @returns {Observable<HttpResponse<any>>}
   */
  public requestModifyPassword(old_password: string, new_password: string): Observable<HttpResponse<any>> {
    const body = {
      old_password,
      new_password
    };
    return this.httpService.put(environment.CIPP_UNIVERSE + '/user/password', body);
  }
}
