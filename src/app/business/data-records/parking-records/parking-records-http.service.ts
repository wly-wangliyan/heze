import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../utils/z-entity';
import { environment } from '../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParkingBasicInfoEntity } from '../../parkings/parkings.model';

// 停车记录用户类型
export class UserTypeEntity extends EntityBase {
  public tmp: number = undefined; // Int	临时用户数量
  public white: number = undefined; // Int	白名单用户数量
  public timely: number = undefined; // Int	包时用户数量
  public count: number = undefined; // Int	包次用户数量
  public visitor: number = undefined; // Int	访客用户数量
  public reservation: number = undefined; // Int	预约用户数量
  public space_sharing: number = undefined; // Int	共享用户数量
  public other: number = undefined; // Int	其他用户数量
}

/**停车记录 */
export class ParkingRecordEntity extends EntityBase {
  public parking_record_id: string = undefined; // 记录ID
  public parking: ParkingBasicInfoEntity = undefined; // Json	停车场信息
  public car_id: string = undefined; // String	车牌号码，无牌车为无+数字，可能没有数字
  public user_types: Array<string> = undefined; // 用户类型，详情见UserType
  public entry_time: number = undefined; // Float	入场时间
  public exit_time: number = undefined; // Float	出场时间
  public parking_time: number = undefined; // Float	停车时长
  public spot_no: string = undefined; // CharField	车位编号
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking') {
      return ParkingBasicInfoEntity;
    }
    return null;
  }
}

/**停车记录条件筛选参数 */
export class SearchParkingRecordParams extends EntityBase {
  public parking_name: string = undefined; // String	F	停车场名称
  public car_id: string = undefined; // String	F	车牌号
  public user_types = ''; // String	F	用户类型code
  public entry_section: string = undefined; // String	F	入场时间戳区间, 单位秒
  public exit_section: string = undefined; // String	F	出厂时间戳区间, 单位秒
  public page_size = 45;
  public page_num = 1;
}

export class ParkingRecordsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ParkingRecordEntity> {
    const tempList: Array<ParkingRecordEntity> = [];
    results.forEach(res => {
      tempList.push(ParkingRecordEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ParkingRecordsHttpService {

  private domain = environment.CIPP_UNIVERSE;

  constructor(private httpService: HttpService) {
  }

  /**
   * 条件检索停车记录
   * @param searchParams 参数列表
   * @returns Observable<R>
   */
  public requestParkingRecordsData(searchParams: SearchParkingRecordParams): Observable<ParkingRecordsLinkResponse> {
    const url = this.domain + '/parking_records';
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(url, params).pipe(map(data => new ParkingRecordsLinkResponse(data)));
  }

  /**
   * 通过link条件检索停车记录
   * @param url url
   * @returns Observable<R>
   */
  public continueParkingRecordsData(url: string): Observable<ParkingRecordsLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new ParkingRecordsLinkResponse(data)));
  }

}


