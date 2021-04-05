import { Injectable } from '@angular/core';
import { AuthService, UserPermissionGroupEntity } from './auth.service';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { ScreenHelper } from '../../utils/screen-helper';
import { isNullOrUndefined, isUndefined } from 'util';
import { PromptBoxComponent } from '../share/components/prompts/prompt-box/prompt-box.component';
import { ConfirmationBoxComponent } from '../share/components/prompts/confirmation-box/confirmation-box.component';
import { Http500PageComponent } from '../share/components/prompts/http-500-page/http-500-page.component';
import { Http403PageComponent } from '../share/components/prompts/http-403-page/http-403-page.component';

import { RegionHttpService, RegionEntity, RegionLevel } from './region-http.service';
import { GlobalConst } from '../share/global-const';
import { DateFormatHelper } from '../../utils/date-format-helper';
import { GroupEntity, GroupsHttpService } from '../business/groups/groups-http.service';
import { map, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  // 特殊存储，全局化资源配置
  public static Instance: GlobalService;
  private _permissionGroups: Array<UserPermissionGroupEntity>;
  private _regions: Array<RegionEntity>;
  private _currentRegions: Array<RegionEntity>;
  private _groups: Array<GroupEntity>;

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private regionHttpService: RegionHttpService,
    private groupsHttpService: GroupsHttpService) {
  }

  public promptBox: PromptBoxComponent;
  public confirmationBox: ConfirmationBoxComponent;
  public http500Page: Http500PageComponent;
  public http403Page: Http403PageComponent;
  private permissionErrorMessage = '授权失败，请重新登录';

  /**
   * 获取当前服务器时间戳(秒）
   * @returns number
   */
  public get timeStamp(): number {
    return this.httpService.timeStamp;
  }

  /**
   * 获取权限组列表
   * @returns {any}
   */
  public get permissionGroups(): Observable<Array<UserPermissionGroupEntity>> {
    if (isUndefined(this._permissionGroups)) {
      return this.authService.requestPermissionGroups().pipe(map(permissionGroups => {
        this._permissionGroups = permissionGroups;
        return permissionGroups;
      }));
    } else {
      return Observable.create(observer => {
        observer.next(this._permissionGroups);
        observer.complete();
      });
    }
  }

  /**
   * 获取组列表数据
   * @returns {any}
   */
  public get groups(): Observable<Array<GroupEntity>> {
    if (isNullOrUndefined(this._groups)) {
      return this.groupsHttpService.requestAllGroupsData().pipe(map(groups => {
        this._groups = groups;
        return groups;
      }));
    } else {
      return Observable.create(observer => {
        observer.next(this._groups);
        observer.complete();
      });
    }
  }

  // 组数据有改动时重新获取组数据
  public resetGroups() {
    this._groups = null;
    this.groupsHttpService.requestAllGroupsData().subscribe(group => {
      this._groups = group;
    });
  }

  public getRegionById(region_id: string): Observable<Array<RegionEntity>> {
    return this.regions.pipe(flatMap((regions) => {
      // 处理
      const targetRegions = [];
      if (region_id) {
        const location0Region = this.findRegionById(region_id, regions);
        if (location0Region) {
          if (location0Region.parent_id) {
            const locationFu1Region = this.findRegionById(location0Region.parent_id, regions);
            if (locationFu1Region.parent_id) {
              // id是一个区级的,并且上有两级
              const locationFu2Region = this.findRegionById(locationFu1Region.parent_id, regions);
              const fu2region = locationFu2Region.clone();
              const fu1region = locationFu1Region.clone();
              const region = location0Region.clone();
              fu2region.cities = [];
              fu2region.districts = [];
              fu1region.cities = [];
              fu1region.districts = [];
              region.cities = [];
              region.districts = [];
              fu2region.cities[0] = fu1region;
              fu1region.districts[0] = region;
              targetRegions.push(fu2region);
            } else {
              // id是一个市级，并且上有一级
              const fu1region = locationFu1Region.clone();
              const region = location0Region.clone();
              fu1region.cities = [];
              fu1region.districts = [];
              region.cities = [];
              if (region.level === RegionLevel.city) {
                fu1region.cities[0] = region;
              } else {
                region.districts = [];
                fu1region.districts[0] = region;
              }
              targetRegions.push(fu1region);
            }
          } else {
            // id是一个省级
            const region = location0Region.clone();
            targetRegions.push(region);
          }
        }
      }
      return targetRegions;
      // return Observable.create(observer => {
      //   // return regions;
      //   observer.next(targetRegions);
      //   observer.complete();
      // });
    }));
  }

  private findRegionById(region_id: string, regionArray: Array<RegionEntity>): RegionEntity {
    let targetRegion;
    for (const index in regionArray) {
      if (regionArray.hasOwnProperty(index)) {
        if (regionArray[index].region_id === region_id) {
          targetRegion = regionArray[index];
          break;
        }
        targetRegion = this.findRegionById(region_id, regionArray[index].cities);
        if (targetRegion) {
          break;
        }
        targetRegion = this.findRegionById(region_id, regionArray[index].districts);
        if (targetRegion) {
          break;
        }
      }

    }
    return targetRegion;
  }

  /**
   * 获取所有行者区域列表
   * @returns {any}
   */
  public get regions(): Observable<Array<RegionEntity>> {
    if (isUndefined(this._regions)) {
      return this.regionHttpService.requestRegions().pipe(map(regions => {
        this._regions = regions;
        return regions;
      }));
    } else {
      return Observable.create(observer => {
        observer.next(this._regions);
        observer.complete();
      });
    }
  }

  /**
   * 获取当前操作的行政区域列表(行政区域不含父节点)
   */
  public get currentRegions(): Observable<Array<RegionEntity>> {
    if (isUndefined(this._currentRegions)) {
      return this.regionHttpService.requestRegions(GlobalConst.RegionID).pipe(map(regions => {
        const tempList = [];
        // 当前数据结构不复杂，可以这么干
        for (const province of regions) {
          if (province.region_id === GlobalConst.RegionID) {
            tempList.push(province);
            this._currentRegions = tempList;
            return tempList;
          } else {
            if (province.cities && province.cities.length > 0) {
              for (const city of province.cities) {
                if (city.region_id === GlobalConst.RegionID) {
                  city.center = GlobalConst.RegionCenter.join(',');
                  tempList.push(city);
                  this._currentRegions = tempList;
                  return tempList;
                } else {
                  if (city.districts && city.districts.length > 0) {
                    for (const district of city.districts) {
                      if (district.region_id === GlobalConst.RegionID) {
                        tempList.push(district);
                        this._currentRegions = tempList;
                        return tempList;
                      }
                    }
                  }
                }
              }
            } else {
              for (const district of province.districts) {
                if (district.region_id === GlobalConst.RegionID) {
                  tempList.push(district);
                  this._currentRegions = tempList;
                  return tempList;
                }
              }
            }
          }
        }
        this._currentRegions = tempList;
        return tempList;
      }));
    } else {
      return Observable.create(observer => {
        observer.next(this._currentRegions);
        observer.complete();
      });
    }
  }

  /**
   * 获取当前操作的行政区域列表(行政区域平铺,市区在一起显示)
   */
  public get currentTileRegions(): Observable<Array<RegionEntity>> {
    return this.currentRegions.pipe(map(regions => {
      const tempList = [];
      regions.forEach(region => {
        tempList.push(region);
        region.cities && region.cities.forEach(city => {
          tempList.push(city);
          city.districts && city.districts.forEach(district => {
            tempList.push(district);
          });
        });
        region.districts && region.districts.forEach(district => {
          tempList.push(district);
        });
      });
      return tempList;
    }));
  }

  /**
   * 网络错误处理函数
   * @param err 错误信息
   * @returns {boolean} 是否处理了错误信息，未处理则返回false
   */
  public httpErrorProcess(err: any): boolean {

    if (err.status === 403) {
      if (isUndefined(err['text'])) {
        this.http403Page.http403Flag = true;
      } else {
        const error = err.text() ? JSON.parse(err.text()) : '';
        if (error && error['message'] === 'Authorization failed') {
          this.promptBox.open(this.permissionErrorMessage, () => {
            this.authService.kickOut();
          });
        } else {
          // 大屏不显示403 500 502画页
          if (!ScreenHelper.Instance.isFullScreen) {
            this.http403Page.http403Flag = true;
          }
        }
      }
      return true;
    } else if (err.status === 500) {
      if (!ScreenHelper.Instance.isFullScreen) {
        this.http500Page.http500Flag = true;
      }
      return true;
    } else {
      console.error(err);
      return false;
    }
  }

  /**
   * 检查时间的有效性(for数据统计)
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns {boolean} 是否有效
   */
  public checkDateValid(startDate: any, endDate: any): boolean {
    let tempStart, tempEnd;

    if (startDate instanceof Date) {
      tempStart = DateFormatHelper.Format(startDate, 'yyyy-MM-dd').replace(/-/g, '/');
    } else {
      tempStart = startDate;
    }

    if (endDate instanceof Date) {
      tempEnd = DateFormatHelper.Format(endDate, 'yyyy-MM-dd').replace(/-/g, '/');
    } else {
      tempEnd = endDate;
    }

    const currentDate = DateFormatHelper.Format(DateFormatHelper.Today, 'yyyy-MM-dd').replace(/-/g, '/');
    if (tempStart > currentDate) {
      this.promptBox.open(GlobalConst.DateFormatStartGreaterMessage);
      return false;
    }
    if (tempEnd > currentDate) {
      this.promptBox.open(GlobalConst.DateFormatEndGreaterMessage);
      return false;
    }
    if (tempEnd < tempStart) {
      this.promptBox.open(GlobalConst.DateFormatStartGreaterThanEndMessage);
      return false;
    }
    return true;
  }
}
