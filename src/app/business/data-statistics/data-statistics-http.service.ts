import {Injectable} from '@angular/core';
import {HttpService, LinkResponse} from '../../core/http.service';
import {environment} from '../../../environments/environment';
import {
  ParkingDynamicsInfoParams,
  ParkingDynamicsInfoEntity,
  ParkingDynamicOnlineRateEntity,
  ParkingDynamicUtilizationRateEntity,
  ParkingRealTimeStatisticsParams,
  ParkingRealTimeStatisticsEntity,
  GroupRealTimeStatisticsEntity,
  RegionRealTimeStatisticsEntity,
  GroupRealTimeStatisticsParams,
  RegionRealTimeStatisticsParams,
  ParkingCountEntity,
  ParkingDynamicsInfoHeatMapDataEntity,
  RegionUserTypeByDayEntity,
  RegionUserTypeEntity,
  RegionRealTimeDataEntity,
  ParkingFlowParams,
  ParkingHistoryEntity,
  ParkingOutFlowEntity,
  ParkingDynamicsExportParams,
} from './data-statistics.model';
import {Subject, Observable} from 'rxjs';
import {DSOnlineRateHttpService} from './services/ds-online-rate-http.service';
import {DSFillingRateHttpService} from './services/ds-filling-rate-http.service';
import {DSFlowHttpService} from './services/ds-flow-http.service';
import {DSTurnoverRateHttpService} from './services/ds-turnover-rate-http.service';
import {DateFormatHelper} from '../../../utils/date-format-helper';
import {DSUserHttpService} from './services/ds-user-http.service';
import {ParkingEntity} from '../parkings/parkings.model';
import {HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStatisticsHttpService {

  private domain = environment.CIPP_UNIVERSE;

  public readonly onlineRate: DSOnlineRateHttpService;
  public readonly fillingRate: DSFillingRateHttpService;
  public readonly turnoverRate: DSTurnoverRateHttpService;
  public readonly flow: DSFlowHttpService;
  public readonly user: DSUserHttpService;

  constructor(private httpService: HttpService) {
    this.onlineRate = new DSOnlineRateHttpService(httpService, this.domain);
    this.fillingRate = new DSFillingRateHttpService(httpService, this.domain);
    this.flow = new DSFlowHttpService(httpService, this.domain);
    this.turnoverRate = new DSTurnoverRateHttpService(httpService, this.domain);
    this.user = new DSUserHttpService(httpService, this.domain);
  }

  /**** 实时信息 ****/

  /**
   * 通过停车场id获取停车场实时信息
   * @param parking_id 停车场id
   * @returns Observable<R> 未找到返回404
   */
  public requestParkingDynamicInfoById(parking_id: string): Observable<ParkingDynamicsInfoEntity> {
    return this.httpService.get(this.domain + '/parkings/' + parking_id + '/parking_dynamics').pipe(map(data => ParkingDynamicsInfoEntity.Create(data['body'])));
  }

  /**
   * 条件检索停车场实时动态信息(获取所有)
   * @param region_id 区域id
   * @returns Subject<[Array<ParkingDynamicsInfoEntity>,Array<ParkingDynamicsInfoHeatMapDataEntity>]
   */
  public requestAllParkingDynamicInfoList(region_id: string): Observable<Array<any>> {
    const url = `${this.domain}/parkings/parking_dynamics?page_num=1&page_size=1000&region_id=${region_id}`;
    const subject = new Subject<Array<any>>();
    this.requestLinkAllParkingDynamicInfoList(url, [[], []], subject);
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
   * 条件检索停车场实时动态信息
   * @param searchParams 参数列表
   * @returns Observable<R>
   */
  public requestParkingDynamicInfoList(searchParams: ParkingDynamicsInfoParams): Observable<ParkingDynamicsInfoLinkResponse> {
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(this.domain + '/parkings/parking_dynamics', params).pipe(map(data => new ParkingDynamicsInfoLinkResponse(data)));
  }

  /**
   * 通过link继续检索停车场实时动态信息
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueParkingDynamicInfoList(url: string): Observable<ParkingDynamicsInfoLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new ParkingDynamicsInfoLinkResponse(data)));
  }

  /**
   * 获取当前停车场在线状态统计结果
   * @param region_id 行政区域id
   * @returns Observable<R>
   */
  public requestParkingDynamicOnlineRate(region_id: string): Observable<ParkingDynamicOnlineRateEntity> {
    const params = this.httpService.generateURLSearchParams({region_id: region_id});
    return this.httpService.get(this.domain + '/parking_online_infos/realtime_statistics', params).pipe(map(data => ParkingDynamicOnlineRateEntity.Create(data['body'])));
  }

  /**
   * 获取当前停车场车位填充率/利用率统计结果
   * @param region_id 行政区域id
   * @param parking_group_id 组id
   * @returns Observable<R>
   */
  public requestParkingDynamicUtilizationRate(region_id: string, parking_group_id: string): Observable<ParkingDynamicUtilizationRateEntity> {
    const params = this.httpService.generateURLSearchParams({
      region_id: region_id,
      parking_group_id: parking_group_id,
      status: 1  // 实时统计正常的
    });
    return this.httpService.get(this.domain + '/parking_dynamics/realtime_statistics', params).pipe(map(data => ParkingDynamicUtilizationRateEntity.Create(data['body'])));
  }

  /**
   * 检索停车场统计结果
   * @param searchParams 参数列表
   * @returns Observable<R>
   */
  public requestParkingRealTimeStatisticsList(searchParams: ParkingRealTimeStatisticsParams): Observable<ParkingRealTimeStatisticsLinkResponse> {
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(this.domain + '/parking_realtime_statistics', params).pipe(map(data => new ParkingRealTimeStatisticsLinkResponse(data)));
  }

  /**
   * 通过link继续检索停车场统计结果
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueParkingRealTimeStatisticsList(url: string): Observable<ParkingRealTimeStatisticsLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new ParkingRealTimeStatisticsLinkResponse(data)));
  }

  /**
   * 检索停车场组统计结果
   * @param searchParams 参数列表
   * @returns Observable<R>
   */
  public requestGroupRealTimeStatisticsList(searchParams: GroupRealTimeStatisticsParams): Observable<GroupRealTimeStatisticsLinkResponse> {
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(this.domain + '/group_realtime_statistics', params).pipe(map(data => new GroupRealTimeStatisticsLinkResponse(data)));
  }

  /**
   * 通过link继续检索停车场组统计结果
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueGroupRealTimeStatisticsList(url: string): Observable<GroupRealTimeStatisticsLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new GroupRealTimeStatisticsLinkResponse(data)));
  }

  /**
   * 检索行政区域统计结果
   * @param searchParams 参数列表
   * @returns Observable<R>
   */
  public requestRegionRealTimeStatisticsList(searchParams: RegionRealTimeStatisticsParams): Observable<RegionRealTimeStatisticsLinkResponse> {
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(this.domain + '/region_realtime_statistics', params).pipe(map(data => new RegionRealTimeStatisticsLinkResponse(data)));
  }

  /**
   * 通过link继续检索行政区域统计结果
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueRegionRealTimeStatisticsList(url: string): Observable<RegionRealTimeStatisticsLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new RegionRealTimeStatisticsLinkResponse(data)));
  }

  /**
   * 获取实时动态信息各个数据数量
   * @param string region_id
   * @returns Observable<Response>
   */
  public requestRegionRealTimeData(region_id: string) {
    const params = this.httpService.generateURLSearchParams({
      region_id: region_id
    });
    return this.httpService.get(this.domain + '/parkings/parking_dynamics/counts', params).pipe(map(data => RegionRealTimeDataEntity.Create(data['body'])));
  }

  /**
   * 获取停车场总数
   * @param region_id 区域id
   * @param parking_group_id 分组id
   * @param status 状态 1:正常 2:已注销
   * @returns Observable<R>
   */
  public requestParkingCountData(region_id: string, parking_group_id?: string, status = 1): Observable<ParkingCountEntity> {
    const params = this.httpService.generateURLSearchParams({
      region_id: region_id,
      parking_group_id: parking_group_id,
      status: status,
    });
    return this.httpService.get(this.domain + '/parkings/count', params).pipe(map(data => ParkingCountEntity.Create(data['body'])));
  }

  /**
   * 获取按行政区域检索按天统计的用户类型比例结果
   * @param string region_id
   * @param Date startDate
   * @param Date endDate
   * @returns Observable<Array<RegionUserTypeByDayEntity>>
   */
  public requestRegionStatisticsUserTypeByDayList(region_id: string, startDate: Date, endDate: Date): Observable<Array<RegionUserTypeByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
    });
    return this.httpService.get(this.domain + '/region_statistics/user_type_ratio_by_days', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(RegionUserTypeByDayEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 获取实时用户类型比例结果
   * @param string region_id
   * @returns Observable<Array<RegionUserTypeEntity>>
   */
  public requestRegionStatisticsUserTypeList(region_id: string): Observable<RegionUserTypeEntity> {
    const params = this.httpService.generateURLSearchParams({
      region_id: region_id,
    });
    return this.httpService.get(this.domain + '/region_user_type_statistics', params).pipe(map(data => RegionUserTypeEntity.Create(data['body'])));
  }

  /**
   * 条件检索获取停车场列表
   * @param params ParkingFlowParams
   * @returns Observable<Array<ParkingEntity>>
   */
  public requestParkingFlowList(params: ParkingFlowParams): Observable<ParkingFlowLinkResponse> {
    return this.httpService.get(this.domain + '/parking_history/parkings', params.json()).pipe(map(data => new ParkingFlowLinkResponse(data)));
  }

  /**
   * 通过link条件检索获取停车场列表
   * @param url url
   * @returns Observable<R>
   */
  public continueParkingFlowList(url: string): Observable<ParkingFlowLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new ParkingFlowLinkResponse(data)));
  }

  /**
   * 点击teble创建浏览历史
   * @param parking_id 停车场id
   * @returns Observable<Response>
   */
  public createParkingLookHistory(parking_id: any) {
    const body = {parking_id: parking_id};
    return this.httpService.post(this.domain + '/parking_histories', body);
  }

  /**
   * 点击查看历史获取停车场流量统计历史
   * @returns Observable<ParkingHistoryEntity>
   */
  public requestLookHistoryList(): Observable<LookHistoryLinkResponse> {
    return this.httpService.get(this.domain + '/parking_histories').pipe(map(data => new LookHistoryLinkResponse(data)));
  }

  /**
   * 删除停车场流量统计历史
   * @param parking_history_id 停车场流量统计历史id
   */
  public deleteLookHistoryList(parking_history_id: string) {
    const httpUrl = `${this.domain}/parking_histories/${parking_history_id}`;
    return this.httpService.delete(httpUrl);
  }

  /**
   * 按天查出口车流量
   * @param
   * parking_id  String  F  停车场id
   section  String  F  时间区间,开始和结束时间以逗号分割 例:"1438016400,1548172800"
   order_by  String  F  排序:'-time_point',time_point,-exit_flow,entry_flow,-total_turnover_rate,total_turnover_rate
   region_id  String  F  区域分组id
   page_size  Int  F  每页限制
   page_num  Int  F  页码
   * @returns Observable<ParkingHistoryEntity>
   */
  public requestParkingOutFlowByDayList(
    region_id: string, startDate: Date, endDate: Date, page_size: number = 1000, parking_id: string,
    order_by: 'entry_flow' | '-entry_flow' | 'time_point' | 'turnover_rate' | '-turnover_rate'
  ): Observable<ParkingOutFlowByDayResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      page_num: 1,
      page_size: page_size,
      parking_id: parking_id,
      order_by: order_by
    });
    return this.httpService.get(this.domain + '/parking_statistics/parking_exit_flow_by_day', params).pipe(map(data => new ParkingOutFlowByDayResponse(data)));
  }

  // 按周出口
  public requestParkingOutFlowByWeekList(
    region_id: string, startDate: Date, endDate: Date, page_size: number = 1000, parking_id: string,
    order_by: 'entry_flow' | '-entry_flow' | 'time_point' | 'turnover_rate' | '-turnover_rate'
  ): Observable<ParkingOutFlowByDayResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      page_num: 1,
      page_size: page_size,
      parking_id: parking_id,
      order_by: order_by
    });
    return this.httpService.get(this.domain + '/parking_statistics/parking_exit_flow_by_week', params).pipe(map(data => new ParkingOutFlowByDayResponse(data)));
  }

  // 按月
  public requestParkingOutFlowByMonthList(
    region_id: string, startDate: Date, endDate: Date, page_size: number = 1000, parking_id: string,
    order_by: 'entry_flow' | '-entry_flow' | 'time_point' | 'turnover_rate' | '-turnover_rate'
  ): Observable<ParkingOutFlowByDayResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      page_num: 1,
      page_size: page_size,
      parking_id: parking_id,
      order_by: order_by
    });
    return this.httpService.get(this.domain + '/parking_statistics/parking_exit_flow_by_month', params).pipe(map(data => new ParkingOutFlowByDayResponse(data)));
  }

  /**
   * 导出停车场状态excel表格
   * @param ParkingDynamicsExportParams params
   * @returns excel
   */
  public requestParkingStateExport(params: ParkingDynamicsExportParams) {
    return this.httpService.get(this.domain + '/parking_dynamics/export', params);
  }
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

export class ParkingRealTimeStatisticsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ParkingRealTimeStatisticsEntity> {
    const tempList: Array<ParkingRealTimeStatisticsEntity> = [];
    results.forEach(res => {
      tempList.push(ParkingRealTimeStatisticsEntity.Create(res));
    });
    return tempList;
  }
}

export class GroupRealTimeStatisticsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<GroupRealTimeStatisticsEntity> {
    const tempList: Array<GroupRealTimeStatisticsEntity> = [];
    results.forEach(res => {
      tempList.push(GroupRealTimeStatisticsEntity.Create(res));
    });
    return tempList;
  }
}

export class RegionRealTimeStatisticsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<RegionRealTimeStatisticsEntity> {
    const tempList: Array<RegionRealTimeStatisticsEntity> = [];
    results.forEach(res => {
      tempList.push(RegionRealTimeStatisticsEntity.Create(res));
    });
    return tempList;
  }
}

export class ParkingFlowLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ParkingEntity> {
    const tempList: Array<ParkingEntity> = [];
    results.forEach(res => {
      tempList.push(ParkingEntity.Create(res));
    });
    return tempList;
  }
}

export class LookHistoryLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ParkingHistoryEntity> {
    const tempList: Array<ParkingHistoryEntity> = [];
    results.forEach(res => {
      tempList.push(ParkingHistoryEntity.Create(res));
    });
    return tempList;
  }
}

export class ParkingOutFlowByDayResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ParkingOutFlowEntity> {
    const tempList: Array<ParkingOutFlowEntity> = [];
    results.forEach(res => {
      tempList.push(ParkingOutFlowEntity.Create(res));
    });
    return tempList;
  }
}
