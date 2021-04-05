import { Injectable } from '@angular/core';
import { HttpService, LinkResponse } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { EntityBase } from '../../../utils/z-entity';
import { Observable, Subject } from 'rxjs';
import { isUndefined } from 'util';
import { ParkingEntity } from '../parkings/parkings.model';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class GroupSearchParams extends EntityBase {
  public parking_group_name: string = undefined; // 组名称
  public parking_group_types: string = undefined; // 组类型
  public page_num: number = undefined; // 页码
  public page_size: number = undefined; // 每页条数
  public is_deleted = false; // 不传获取所有分组
}

export class GroupEntity extends EntityBase {
  public parking_group_id: string = undefined; // 分组id
  public parking_group_name: string = undefined; // 分组名称
  public parking_group_types: Array<any> = undefined; // 分组类型
  public parkings: Array<any> = undefined; // 关联停车场
  public is_deleted: boolean = undefined; // 分组状态
  public deleted_time: number = undefined; // 删除时间
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间
}

export class GroupEditEntity extends EntityBase {
  public parking_group_name: string = undefined; // 分组名称
  public parking_group_types: string = undefined; // 分组类型
  public parking_ids: string = undefined; // 停车场id集合

  public toEditJson() {
    const json = this.json();
    delete json['parking_group_name'];
    delete json['parking_group_types'];
    return json;
  }
}

export class GroupParkingsSearchParams extends EntityBase {
  public parking_name: string = undefined; // 组名称
  public page_num: number = undefined; // 页码
  public page_size: number = undefined; // 每页条数
}

export class GroupParkingsEntity extends EntityBase {
  public parking: ParkingEntity = undefined; // 停车场
  public is_deleted: boolean = undefined; // 关联状态
  public deleted_time: number = undefined; // 删除时间
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间（停车场添加到组的时间）

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking') {
      return ParkingEntity;
    }
    return null;
  }
}

export class GroupsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<GroupEntity> {
    const tempList: Array<GroupEntity> = [];
    results.forEach(res => {
      tempList.push(GroupEntity.Create(res));
    });
    return tempList;
  }
}

export class GroupParkingsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<GroupParkingsEntity> {
    const tempList: Array<GroupParkingsEntity> = [];
    results.forEach(res => {
      tempList.push(GroupParkingsEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GroupsHttpService {

  private domain = environment.CIPP_UNIVERSE;

  constructor(private httpService: HttpService) {
  }

  /**
   * 条件检索组列表
   * @param searchParams
   * @param isList
   * @returns {Observable<R>}
   */
  public requestGroupsData(searchParams: GroupSearchParams, isList: boolean = true): Observable<GroupsLinkResponse> {
    const url = this.domain + '/parking_groups';
    let params = this.httpService.generateListURLSearchParams(searchParams);
    if (!isList) {
      params = this.httpService.generateURLSearchParams(searchParams);
    }
    return this.httpService.get(url, params).pipe(map(data => new GroupsLinkResponse(data)));
  }

  /**
   * 通过link查看组列表
   * @param url
   * @returns {Observable<R>}
   */
  public continueGroupsData(url: string): Observable<GroupsLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new GroupsLinkResponse(data)));
  }

  /**
   * 添加组
   * @param groupsParams
   * @returns {Observable<HttpResponse<any>>}
   */
  public requestAddGroupsData(groupsParams: GroupEditEntity): Observable<HttpResponse<any>> {
    const url = this.domain + '/parking_groups';
    const body = groupsParams.json();
    return this.httpService.post(url, body);
  }

  /**
   * 编辑组
   * @param groupsParams
   * @param groupId
   * @returns {Observable<HttpResponse<any>>}
   */
  public requestUpdateGroupsData(groupsParams: GroupEditEntity, groupId: string): Observable<HttpResponse<any>> {
    const url = this.domain + '/parking_groups/' + groupId;
    const body = groupsParams.json();
    return this.httpService.put(url, body);
  }

  /**
   * 删除组
   * @param groupId
   * @returns {Observable<HttpResponse<any>>}
   */
  public requestDeleteGroups(groupId: string): Observable<HttpResponse<any>> {
    const url = this.domain + '/parking_groups/' + groupId;
    return this.httpService.delete(url);
  }

  /**
   * 查看详情
   * @param groupId
   * @returns {OperatorFunction<T, R>}
   */
  public requestGroupsByIdData(groupId: string): Observable<GroupEntity> {
    const url = this.domain + '/parking_groups/' + groupId;
    return this.httpService.get(url).pipe(map(res => res.body));
  }

  /**
   * 根据组获取停车场列表
   * @param searchParams
   * @param groupId
   * @returns {Observable<R>}
   */
  public requestGroupParkingsData(searchParams: GroupParkingsSearchParams, groupId: string): Observable<GroupParkingsLinkResponse> {
    const url = this.domain + '/parking_groups/' + groupId + '/parkings';
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(url, params).pipe(map(data => new GroupParkingsLinkResponse(data)));
  }

  /**
   * 更新组停车场
   * @param groupParkingsParams
   * @param groupId
   * @returns {Observable<HttpResponse<any>>}
   */
  public requestUpdateGroupParkingsData(groupParkingsParams: GroupEditEntity, groupId: string): Observable<HttpResponse<any>> {
    const url = this.domain + '/parking_groups/' + groupId + '/parkings';
    const body = groupParkingsParams.toEditJson();
    return this.httpService.patch(url, body);
  }

  /**
   * 获取所有分组列表
   * @param isDeleted 是否为删除的数据
   * @returns {Subject<Array<GroupEntity>>}
   */
  public requestAllGroupsData(isDeleted?: boolean, order_by?: string): Subject<Array<GroupEntity>> {
    let url = this.domain + '/parking_groups?page_num=1&page_size=100&order_by=-deleted_time';
    if (!isUndefined(isDeleted)) {
      if (isDeleted) {
        url = this.domain + '/parking_groups?page_num=1&page_size=100&order_by=-deleted_time&is_deleted=true';
      } else {
        url = this.domain + '/parking_groups?page_num=1&page_size=100&is_deleted=false';
      }
    }
    const subject = new Subject<Array<GroupEntity>>();
    this.requestLinkGroupsData(url, [], subject);
    return subject;
  }

  /**
   * 递归获取所有分组列表
   * @param url linkUrl
   * @param groups 分组列表
   * @param subject 通知
   */
  private requestLinkGroupsData(url: string, groups: Array<GroupEntity>, subject: Subject<Array<GroupEntity>>) {
    this.httpService.get(url).subscribe(res => {
      // 数据转换
      const results: Array<GroupEntity> = [];
      res.body.forEach(data => {
        results.push(GroupEntity.Create(data));
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = res.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkGroupsData(linkUrl, groups, subject);
      } else {
        subject.next(groups);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 获取有效分组数
   * @param is_deleted 是否获取已删除
   * @returns {Observable<R>}
   */
  public requestAllGroupCount(is_deleted: boolean = false): Observable<number> {
    const url = this.domain + '/parking_groups/count';
    const params = this.httpService.generateURLSearchParams({ is_deleted: is_deleted });
    return this.httpService.get(url, params).pipe(map(data => data.body.total_num));
  }
}

