import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityBase } from '../../../../utils/z-entity';
import { DateFormatHelper } from 'src/utils/date-format-helper';
import { ValidateHelper } from '../../../../utils/validate-helper';
import { UserTypeEntity } from '../../data-records/parking-records/parking-records-http.service';
import { CompanyEntity } from '../../basics/operation-company/operation-company.model';

/**停车场 */
export class ParkingBasicInfoEntity extends EntityBase {
  public parking_id: string = undefined; // String	停车场ID
  public parking_name: string = undefined; // String	停车场名称
  public company: CompanyEntity = undefined; // 所属企业
  public lon: string = undefined; // 经度
  public lat: string = undefined; // 纬度
  public area_type: number = undefined; // 用地类型 1:路外 2:路内
  public status: number = undefined; // 状态 1:运营中 2:未运营
  public total: number = undefined; // 停车场泊位总数
  public updated_time: number = undefined; // 	Float	更新时间
  public created_time: number = undefined; // 	Float	创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'company') {
      return CompanyEntity;
    }
    return null;
  }
}

/**停车场在线状态 */
export class ParkingDynamicOnlineStatusEntity extends EntityBase {
  public total_num: number = undefined; // 停车场总数
  public online_num: number = undefined; // 在线停车场数
  public offline_num: number = undefined; // 离线停车场数
}

/**车位利用率实体 */
export class ParkingDynamicUtilizationRateEntity extends EntityBase {
  public total_num: number = undefined; // 车位总数
  public used_num: number = undefined;  // 占用车位数
  public unused_num: number = undefined; // // 空闲车位数
  public inside_total_num: number = undefined; // 路内车位总数
  public inside_used_num: number = undefined;  // 路内占用车位数
  public inside_unused_num: number = undefined; // 路内空闲车位数
  public outside_total_num: number = undefined; // 路外车位总数
  public outside_used_num: number = undefined;  // 路外占用车位数
  public outside_unused_num: number = undefined; // 路外空闲车位数
}

/**动态信息实体 */
export class ParkingDynamicsInfoEntity extends EntityBase {
  public parking: ParkingBasicInfoEntity = undefined; // object	停车场
  public total_num: number = undefined; // 	Int	总车位数
  public total_tmp_num: number = undefined; // Int	总临时车位数
  public tmp_num: number = undefined; // Int	占用临时车位数
  public total_other_num: number = undefined; // 	Int	总其他车位数
  public other_num: number = undefined; // 	Int	占用其他车位数
  public status: any = undefined; // 	Int	车位状态 1: 空闲 2: 宽松 3: 紧张
  public flow: number = undefined; // 停车场实时流量
  public filling_rate: number = undefined; // 填充率
  public run_status: number = undefined; // 0: 未知, 1:正常, 2:异常
  public area_type: number = undefined;  // 1 路外 2 路内
  public updated_time: number = undefined; // 	Float	更新时间
  public created_time: number = undefined; // 	Float	创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking') {
      return ParkingBasicInfoEntity;
    }
    return null;
  }
}

/**实时信息 */
export class DynamicsEntity extends EntityBase {
  public parking_spots: number = undefined; // 	Int	总车位数
  public income: number = undefined; // FLOAT	实时收入
  public parkings: number = undefined; // Int	停车场
  public flows: number = undefined; // 	Int	实时总流量
}

/* 动态信息中提取出来的热力图数据 */
export class ParkingDynamicsInfoHeatMapDataEntity extends EntityBase {
  public lng: number = undefined;
  public lat: number = undefined;
  public count: number = undefined;
}

/**按小时入口流量 */
export class EntryFlowByHourEntity extends EntityBase {
  public entry_flow_by_hour_id: string = undefined; // String	入口流量按小时统计id
  public entry_flow: number = undefined; // Int	入口流量
  public time_point: number = undefined; // Float	每周期的时间点
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
}

/**按小时出口流量 */
export class ExitFlowByHourEntity extends EntityBase {
  public exit_flow_by_hour_id: string = undefined; // String	入口流量按小时统计id
  public exit_flow: number = undefined; // Int	入口流量
  public time_point: number = undefined; // Float	每周期的时间点
  public updated_time: number = undefined; // Float	更新时间
  public created_time: number = undefined; // Float	创建时间
}

/**停车场数 */
export class ParkingCountEntity extends EntityBase {
  public free: number = undefined; // int 空闲
  public normal: number = undefined; // int 宽松
  public busy: number = undefined; // int 紧张
}

/**** 实时信息获取参数 ****/
export class ParkingDynamicsInfoParams {
  public page_num = 1; // int	F	页码 默认1
  public page_size = 45; // 	int	F	每页条数 默认15
  public order_by = '-status'; // 排序方式: "-total_num, total_num, -filling_rate, filling_rate, -total_tmp_num, total_tmp_num, -status, status"
}

export class ParkingDynamicsInfoLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ParkingDynamicsInfoEntity> {
    const tempList: Array<ParkingDynamicsInfoEntity> = [];
    results.forEach(res => {
      tempList.push(ParkingDynamicsInfoEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RealTimeInfoHttpService {

  /**company_id 企业id 为非必传参数，不传表示为获取集团数据，传值表示获取企业下数据 */

  private domain = environment.CIPP_UNIVERSE;

  constructor(private httpService: HttpService) { }


  /**
   * 获取集团/企业下 当前授权停车场在线状态统计结果
   * @param {string} company_id 企业id
   */
  public requestParkingDynamicOnlineStatus(company_id?: string): Observable<ParkingDynamicOnlineStatusEntity> {
    let httpUrl = `${this.domain}/parking_online_status`;
    if (!ValidateHelper.IsEmptyValue(company_id)) {
      httpUrl = `${this.domain}/companies/${company_id}/parking_online_status`;
    }
    return this.httpService.get(httpUrl).pipe(map(data => ParkingDynamicOnlineStatusEntity.Create(data['body'])));
  }

  /**
   * 获取集团/企业 当前授权停车场车位填充率/利用率统计结果
   * @param {string} company_id 企业id
   */
  public requestParkingDynamicUtilizationRate(company_id?: string): Observable<ParkingDynamicUtilizationRateEntity> {
    let httpUrl = `${this.domain}/realtime_statistics`;
    if (!ValidateHelper.IsEmptyValue(company_id)) {
      httpUrl = `${this.domain}/companies/${company_id}/realtime_statistics`;
    }
    return this.httpService.get(httpUrl).pipe(map(data => ParkingDynamicUtilizationRateEntity.Create(data['body'])));
  }

  /**
   * 条件检索 集团/企业 授权停车场实时动态信息
   * @param searchParams 参数列表
   * @param {string} company_id 企业id
   * @returns Observable<R>
   */
  public requestParkingDynamicInfoList(searchParams: ParkingDynamicsInfoParams, company_id?: string): Observable<ParkingDynamicsInfoLinkResponse> {
    let httpUrl = `${this.domain}/parkings/parking_dynamics`;
    if (!ValidateHelper.IsEmptyValue(company_id)) {
      httpUrl = `${this.domain}/companies/${company_id}/parkings/parking_dynamics`;
    }
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(httpUrl, params).pipe(map(data => new ParkingDynamicsInfoLinkResponse(data)));
  }

  /**
   * 通过link继续检索 集团/企业 停车场实时动态信息
   * @param url linkUrl
   */
  public continueParkingDynamicInfoList(url: string): Observable<ParkingDynamicsInfoLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new ParkingDynamicsInfoLinkResponse(data)));
  }

  /**
   * 集团/企业 所有授权停车场实时动态信息(用于地图)
   * @param {string} company_id 企业id
   */
  public requestAllParkingDynamicInfoList(company_id?: string): Observable<Array<any>> {
    let httpUrl = `${this.domain}/parkings/parking_dynamics?`;
    if (!ValidateHelper.IsEmptyValue(company_id)) {
      httpUrl = `${this.domain}/companies/${company_id}/parkings/parking_dynamics?`;
    }
    httpUrl += 'page_num=1&page_size=1000';
    const subject = new Subject<Array<any>>();
    this.requestLinkAllParkingDynamicInfoList(httpUrl, [[], []], subject);
    return subject;
  }

  /**
   * 递归获取停车场实时动态信息
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllParkingDynamicInfoList(url: string, dataArray: Array<any>, subject: Subject<Array<any>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data['body'];
      results.forEach(jsonObj => {
        const dataEntity: ParkingDynamicsInfoEntity = ParkingDynamicsInfoEntity.Create(jsonObj);
        dataArray[0].push(dataEntity);
        const heatMapEntity = new ParkingDynamicsInfoHeatMapDataEntity();
        heatMapEntity.lng = dataEntity.parking ? Number(dataEntity.parking.lon) : 0;
        heatMapEntity.lat = dataEntity.parking ? Number(dataEntity.parking.lat) : 0;
        heatMapEntity.count = dataEntity.tmp_num;
        dataArray[1].push(heatMapEntity);
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllParkingDynamicInfoList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 获取 集团/企业 实时用户类型比例结果
   * @param {string} company_id 企业id
   */
  public requestStatisticsUserTypeList(company_id?: string): Observable<UserTypeEntity> {
    let httpUrl = `${this.domain}/driver_types`;
    if (!ValidateHelper.IsEmptyValue(company_id)) {
      httpUrl = `${this.domain}/companies/${company_id}/driver_types`;
    }
    return this.httpService.get(httpUrl).pipe(map(data => UserTypeEntity.Create(data['body'])));
  }

  /**
   * 获取 集团/企业 实时信息
   * @param {string} company_id 企业id
   */
  public requestDynamicsData(company_id?: string): Observable<DynamicsEntity> {
    let httpUrl = `${this.domain}/dynamics`;
    if (!ValidateHelper.IsEmptyValue(company_id)) {
      httpUrl = `${this.domain}/companies/${company_id}/dynamics`;
    }
    return this.httpService.get(httpUrl).pipe(map(data => DynamicsEntity.Create(data['body'])));
  }

  /**
   * 按时查 集团/企业 入口流量
   * @param {string} company_id 企业id
   */
  public requestEntryFlowByHourList(company_id?: string): Observable<Array<EntryFlowByHourEntity>> {
    let httpUrl = `${this.domain}/entry_flows_by_hour`;
    if (!ValidateHelper.IsEmptyValue(company_id)) {
      httpUrl = `${this.domain}/companies/${company_id}/company_entry_flows_by_hour`;
    }
    return this.httpService.get(httpUrl).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(EntryFlowByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按时查 集团/企业 出口流量
   * @param {string} company_id 企业id
   */
  public requestExitFlowByHourList(company_id?: string): Observable<Array<ExitFlowByHourEntity>> {
    let httpUrl = `${this.domain}/exit_flows_by_hour`;
    if (!ValidateHelper.IsEmptyValue(company_id)) {
      httpUrl = `${this.domain}/companies/${company_id}/company_exit_flows_by_hour`;
    }
    return this.httpService.get(httpUrl).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(ExitFlowByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 获取 集团/企业 停车场车位状态
   * @param {string} company_id 企业id
   */
  public requestParkingCountData(company_id?: string): Observable<ParkingCountEntity> {
    let httpUrl = `${this.domain}/parkings/parking_dynamics/count `;
    if (!ValidateHelper.IsEmptyValue(company_id)) {
      httpUrl = `${this.domain}/companies/${company_id}/parkings/parking_dynamics/count `;
    }
    return this.httpService.get(httpUrl).pipe(map(data => ParkingCountEntity.Create(data['body'])));
  }

}
