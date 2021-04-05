import { Injectable } from '@angular/core';
import { HttpService, LinkResponse } from '../../core/http.service';
import { EntityBase } from '../../../utils/z-entity';
import { Observable } from 'rxjs';
import { UserEntity } from '../../core/auth.service';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';


export class UserSearchParams extends EntityBase {
  public username: string = undefined; // String	F	用户名
  public realname: string = undefined; // String F	姓名
  public telephone: string = undefined; // String	F	联系电话
  public page_num: number = undefined; // int	F	页码
  public page_size: number = undefined; // int	F	每页条数
}

export class UserEditParams extends EntityBase {
  public username: string = undefined; // String	F	用户名
  public realname: string = undefined; // String F	姓名
  public telephone: string = undefined; // String	F	联系电话
  public email: string = undefined; // String	邮箱
  public permission_groups: Array<string> = undefined; // Array	权限组
  public department: string = undefined; // String	部门
  public remarks: string = undefined; // String	备注

  constructor(user?: UserEntity) {
    super();
    if (user) {
      this.username = user.username;
      this.realname = user.realname;
      this.telephone = user.telephone;
      this.email = user.email;
      this.department = user.department;
      this.remarks = user.remarks;
      // permission_groups数据在外部处理
    }
  }

  public toAddJson(): any {
    return this.json();
  }

  public toEditJson(): any {
    const json = this.json();
    delete json['username'];
    return json;
  }
}

export class UserLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<UserEntity> {
    const tempList: Array<UserEntity> = [];
    results.forEach(res => {
      tempList.push(UserEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable()
export class EmployeesHttpService {

  constructor(private httpService: HttpService) {
  }

  /**
   * 获取用户列表
   * @param searchParams
   * @returns {Observable<R>}
   */
  public requestUserList(searchParams: UserSearchParams): Observable<UserLinkResponse> {
    const params = this.httpService.generateListURLSearchParams(searchParams);
    return this.httpService.get(environment.CIPP_UNIVERSE + '/users', params)
      .pipe(map(data => new UserLinkResponse(data)));
  }

  /**
   * 通过link获取列表
   * @param url url
   * @returns {Observable<R>}
   */
  public continueUserList(url: string): Observable<UserLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new UserLinkResponse(data)));
  }

  /**
   * 请求添加用户信息
   * @param editParams 用户参数
   * @returns {Observable<HttpResponse<any>>}
   */
  public requestAddUser(editParams: UserEditParams): Observable<HttpResponse<any>> {
    const body = editParams.toAddJson();
    return this.httpService.post(environment.CIPP_UNIVERSE + '/users', body);
  }

  /**
   * 请求编辑用户信息
   * @param editParams 用户参数
   * @param username 用户名
   * @returns {Observable<HttpResponse<any>>}
   */
  public requestEditUser(editParams: UserEditParams, username: string): Observable<HttpResponse<any>> {
    const body = editParams.toEditJson();
    return this.httpService.put(environment.CIPP_UNIVERSE + '/users/' + username, body);
  }

  /**
   * 请求获取用户信息
   * @param username 用户名
   * @returns {Observable<R>}
   */
  public requestUserInfo(username: string): Observable<UserEntity> {
    return this.httpService.get(environment.CIPP_UNIVERSE + '/users/' + username).pipe(map(res => res.body));
  }

  /**
   * 请求删除用户
   * @param username 用户名
   * @returns {Observable<HttpResponse<any>>}
   */
  public requestDeleteUser(username: string): Observable<HttpResponse<any>> {
    return this.httpService.delete(environment.CIPP_UNIVERSE + '/users/' + username);
  }

  /**
   * 请求重置密码
   * @param username 用户名
   * @returns {Observable<HttpResponse<any>>}
   */
  public requestResetPassword(username: string): Observable<HttpResponse<any>> {
    return this.httpService.put(environment.CIPP_UNIVERSE + '/users/' + username + '/password/reset');
  }
}

