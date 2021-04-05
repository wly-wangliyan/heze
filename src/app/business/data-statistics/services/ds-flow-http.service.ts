/**
 * Created by zack on 9/3/18.
 */
import { HttpService, LinkResponse } from '../../../core/http.service';
import { Subject, Observable } from 'rxjs';
import {
  ParkingEntryFlowByHourEntity, ParkingEntryFlowByDayEntity, ParkingEntryFlowByWeekEntity,
  ParkingEntryFlowByMonthEntity, ParkingEntryFlowByYearEntity, RegionEntryFlowByHourEntity, RegionEntryFlowByDayEntity,
  RegionEntryFlowByWeekEntity, RegionEntryFlowByMonthEntity, RegionEntryFlowByYearEntity, GroupEntryFlowByHourEntity,
  GroupEntryFlowByDayEntity, GroupEntryFlowByWeekEntity, GroupEntryFlowByMonthEntity, GroupEntryFlowByYearEntity,
  ParkingTotalEntryFlowByEveryDayEntity, GroupTotalEntryFlowByEveryDayEntity, RegionTotalEntryFlowByEveryDayEntity,
  RegionExitFlowByHourEntity, TotalEntryFlowEntity, TodayRealFlowEntity, ParkingExitFlowByHourEntity,
} from '../data-statistics.model';
import { DateFormatHelper } from '../../../../utils/date-format-helper';
import { map } from 'rxjs/operators';

export class DSFlowHttpService {
  private domain: string;
  private httpService: HttpService;

  constructor(httpService: HttpService, domain: string) {
    this.domain = domain;
    this.httpService = httpService;
  }

  /**** 流量 ****/

  // /**
  //  * 按时查停车场入口流量
  //  * @param region_id 区域id
  //  * @param startDate 开始时间
  //  * @param endDate 结束时间
  //  * @param page_size 分页大小
  //  * @return Observable<Array<ParkingEntryFlowByHourEntity>>
  //  */
  // public requestParkingStatisticsEntryFlowByHourList(region_id: string, startDate: Date, endDate: Date, page_size: number = 1000): Observable<Array<ParkingEntryFlowByHourEntity>> {
  //   const section = DateFormatHelper.GenerateSection(startDate, endDate);
  //   const params = this.httpService.generateURLSearchParams({
  //     section: section,
  //     region_id: region_id,
  //     page_num: 1,
  //     page_size: page_size,
  //   });
  //   return this.httpService.get(this.domain + '/parking_statistics/parking_entry_flow_by_hour', params).map(data => {
  //     const tempList = [];
  //     data.json().forEach(jsonObj => {
  //       tempList.push(ParkingEntryFlowByHourEntity.Create(jsonObj));
  //     });
  //     return tempList;
  //   });
  // }

  /**
   * 按时查停车场入口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param parking_id 停车场id
   * @return Observable<Array<ParkingEntryFlowByHourEntity>>
   */
  public requestParkingStatisticsEntryFlowByHourList(region_id: string, startDate: Date, endDate: Date, parking_id: string): Observable<Array<ParkingEntryFlowByHourEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      parking_id: parking_id,
    });
    return this.httpService.get(this.domain + '/parking_statistics/parking_entry_flow_by_hour', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(ParkingEntryFlowByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  // 按小时查出口
  public requestParkingStatisticsExitFlowByHourList(region_id: string, startDate: Date, endDate: Date, parking_id: string): Observable<Array<ParkingExitFlowByHourEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      parking_id: parking_id,
    });
    return this.httpService.get(this.domain + '/parking_statistics/parking_exit_flow_by_hour', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(ParkingExitFlowByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }


  /**
   * 按天查停车场入口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @param order_by 排序方式
   * @returns Observable<R>
   */
  public requestParkingStatisticsEntryFlowByDayList(region_id: string, startDate: Date,
    endDate: Date, page_size: number,
    order_by: 'entry_flow' | '-entry_flow' | 'time_point' | 'turnover_rate' | '-turnover_rate'): Observable<ParkingEntryFlowByDayLinkResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      page_size: page_size,
      page_num: 1,
      order_by: order_by
    });
    return this.httpService.get(this.domain + '/parking_statistics/parking_entry_flow_by_day', params).pipe(map(data => new ParkingEntryFlowByDayLinkResponse(data)));
  }

  /**
   * 按天查停车场入口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   *  parking_id 停车场id
   * @param page_size 分页大小
   * @param order_by 排序方式
   * @returns Observable<R>
   */
  public requestParkingStatisticsEntryFlowByDayListWithParkingId(region_id: string, startDate: Date,
    endDate: Date, parking_id: string, page_size: number,
    order_by: 'entry_flow' | '-entry_flow' | 'time_point' | 'turnover_rate' | '-turnover_rate'): Observable<ParkingEntryFlowByDayLinkResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      parking_id: parking_id,
      page_size: page_size,
      page_num: 1,
      order_by: order_by
    });
    return this.httpService.get(this.domain + '/parking_statistics/parking_entry_flow_by_day', params).pipe(map(data => new ParkingEntryFlowByDayLinkResponse(data)));
  }

  /**
   * 按link继续按天查停车场入口流量
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueParkingStatisticsEntryFlowByDayList(url: string): Observable<ParkingEntryFlowByDayLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new ParkingEntryFlowByDayLinkResponse(data)));
  }

  /**
   * 按周查停车场入口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @returns Observable<R>
   */
  public requestParkingStatisticsEntryFlowByWeekList(parking_id: string,
    order_by: string, region_id: string, startDate: Date, endDate: Date, page_size: number = 1000): Observable<Array<ParkingEntryFlowByWeekEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      parking_id: parking_id,
      order_by: order_by,
      section: section,
      region_id: region_id,
      page_num: 1,
      page_size: page_size,
    });
    return this.httpService.get(this.domain + '/parking_statistics/parking_entry_flow_by_week', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(ParkingEntryFlowByWeekEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按周查停车场出口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @returns Observable<R>
   */
  public requestParkingStatisticsExitFlowByWeekList(
    parking_id: string, order_by: string, region_id: string, startDate: Date, endDate: Date, page_size: number = 1000): Observable<Array<ParkingEntryFlowByWeekEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      parking_id: parking_id,
      order_by: order_by,
      section: section,
      region_id: region_id,
      page_num: 1,
      page_size: page_size,
    });
    return this.httpService.get(this.domain + '/parking_statistics/parking_exit_flow_by_week', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(ParkingEntryFlowByWeekEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按月查停车场入口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @param order_by 排序方式
   * @returns Observable<R>
   */
  public requestParkingStatisticsEntryFlowByMonthList(parking_id: string, region_id: string, startDate: Date,
    endDate: Date, page_size: number = 1000,
    order_by?: 'entry_flow' | '-entry_flow' | 'time_point' | 'turnover_rate' | '-turnover_rate'): Observable<ParkingEntryFlowByMonthLinkResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      parking_id: parking_id,
      section: section,
      region_id: region_id,
      page_size: page_size,
      page_num: 1,
      order_by: 'entry_flow'
    });
    return this.httpService.get(this.domain + '/parking_statistics/parking_entry_flow_by_month', params).pipe(map(data => new ParkingEntryFlowByMonthLinkResponse(data)));
  }

  /**
   * 按link继续按月查停车场入口流量
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueParkingStatisticsEntryFlowByMonthList(url: string): Observable<ParkingEntryFlowByMonthLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new ParkingEntryFlowByMonthLinkResponse(data)));
  }

  /**
   * 按年查停车场入口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @param order_by 排序方式
   * @returns Observable<R>
   */
  public requestParkingStatisticsEntryFlowByYearList(region_id: string, startDate: Date,
    endDate: Date, page_size: number,
    order_by: 'entry_flow' | '-entry_flow' | 'time_point' | 'turnover_rate' | '-turnover_rate'): Observable<ParkingEntryFlowByYearLinkResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      page_num: 1,
      page_size: page_size,
      order_by: order_by
    });
    return this.httpService.get(this.domain + '/parking_statistics/parking_entry_flow_by_year', params).pipe(map(data => new ParkingEntryFlowByYearLinkResponse(data)));
  }

  /**
   * 按link继续按年查停车场入口流量
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueParkingStatisticsEntryFlowByYearList(url: string): Observable<ParkingEntryFlowByYearLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new ParkingEntryFlowByYearLinkResponse(data)));
  }

  /**
   * 按时查区入口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param show_type 显示类型：1,图表;2,表格
   * @returns Observable<R>
   */
  public requestRegionStatisticsEntryFlowByHourList(region_id: string, startDate: Date, endDate: Date, show_type: '1' | '2' = '1'): Observable<Array<RegionEntryFlowByHourEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      show_type: show_type,
    });
    return this.httpService.get(this.domain + '/region_statistics/parking_entry_flow_by_hour', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(RegionEntryFlowByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 请求今日实时流量
   * @returns Observable<any>
   */
  public requestRealTodayEntryFlow(): Observable<TodayRealFlowEntity> {
    return this.httpService.get(`${this.domain}/region_statistics/today_total_entry_flow`).pipe(map(data => TodayRealFlowEntity.Create(data['body'])));
  }

  /**
   * 按天查区入口流量(获取所有)
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param show_type 显示类型：1,图表;2,表格
   * @returns Subject<Array<RegionEntryFlowByDayEntity>>
   */
  public requestAllRegionStatisticsEntryFlowByDayList(region_id: string, startDate: Date, endDate: Date, show_type: '1' | '2' = '1'): Observable<Array<RegionEntryFlowByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const url = `${this.domain}/region_statistics/parking_entry_flow_by_day?page_num=1&page_size=1000&region_id=${region_id ? region_id : ''}&show_type=${show_type}&section=${section}`;
    const subject = new Subject<Array<RegionEntryFlowByDayEntity>>();
    this.requestLinkAllRegionStatisticsEntryFlowByDayList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取按天查区入口流量
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllRegionStatisticsEntryFlowByDayList(url: string, dataArray: Array<RegionEntryFlowByDayEntity>, subject: Subject<Array<RegionEntryFlowByDayEntity>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data['body'];
      results.forEach(jsonObj => {
        dataArray.push(RegionEntryFlowByDayEntity.Create(jsonObj));
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllRegionStatisticsEntryFlowByDayList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 按天查区入口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @param order_by 排序方式
   * @param show_type 显示类型：1,图表;2,表格
   * @returns Observable<R>
   */
  public requestRegionStatisticsEntryFlowByDayList(region_id: string, startDate: Date,
    endDate: Date, page_size: number,
    order_by: 'total_entry_flow' | '-total_entry_flow' | 'time_point', show_type: '1' | '2' = '1'): Observable<RegionEntryFlowByDayLinkResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      page_num: 1,
      page_size: page_size,
      order_by: order_by,
      show_type: show_type
    });
    return this.httpService.get(this.domain + '/region_statistics/parking_entry_flow_by_day', params).pipe(map(data => new RegionEntryFlowByDayLinkResponse(data)));
  }

  /**
   * 按link继续按天查区入口流量
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueRegionStatisticsEntryFlowByDayList(url: string): Observable<RegionEntryFlowByDayLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new RegionEntryFlowByDayLinkResponse(data)));
  }

  /**
   * 按周查区入口流量(获取所有)
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param show_type 显示类型：1,图表;2,表格
   * @returns Subject<Array<RegionEntryFlowByWeekEntity>>
   */
  public requestAllRegionStatisticsEntryFlowByWeekList(region_id: string, startDate: Date, endDate: Date, show_type: '1' | '2' = '1'): Observable<Array<RegionEntryFlowByWeekEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const url = `${this.domain}/region_statistics/parking_entry_flow_by_week?page_num=1&page_size=1000&region_id=${region_id ? region_id : ''}&show_type=${show_type}&section=${section}`;
    const subject = new Subject<Array<RegionEntryFlowByWeekEntity>>();
    this.requestLinkAllRegionStatisticsEntryFlowByWeekList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取按周查区入口流量
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllRegionStatisticsEntryFlowByWeekList(url: string, dataArray: Array<RegionEntryFlowByWeekEntity>, subject: Subject<Array<RegionEntryFlowByWeekEntity>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data['body'];
      results.forEach(jsonObj => {
        dataArray.push(RegionEntryFlowByWeekEntity.Create(jsonObj));
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllRegionStatisticsEntryFlowByWeekList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 按周查区入口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param show_type 显示类型：1,图表;2,表格
   * @param page_size 分页大小
   * @returns Observable<R>
   */
  public requestRegionStatisticsEntryFlowByWeekList(region_id: string, startDate: Date,
    endDate: Date, show_type: '1' | '2' = '1', page_size: number = 1000): Observable<Array<RegionEntryFlowByWeekEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      show_type: show_type,
      page_num: 1,
      page_size: page_size
    });
    return this.httpService.get(this.domain + '/region_statistics/parking_entry_flow_by_week', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(RegionEntryFlowByWeekEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按月查区入口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @param order_by 排序方式
   * @param show_type 显示类型：1,图表;2,表格
   * @returns Observable<R>
   */
  public requestRegionStatisticsEntryFlowByMonthList(region_id: string, startDate: Date,
    endDate: Date, page_size: number = 1000,
    order_by: 'total_entry_flow' | '-total_entry_flow' | 'time_point' = 'time_point',
    show_type: '1' | '2' = '1'): Observable<RegionEntryFlowByMonthLinkResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      page_num: 1,
      page_size: page_size,
      order_by: order_by,
      show_type: show_type,
    });
    return this.httpService.get(this.domain + '/region_statistics/parking_entry_flow_by_month', params).pipe(map(data => new RegionEntryFlowByMonthLinkResponse(data)));
  }

  /**
   * 按link继续按月查区入口流量
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueRegionStatisticsEntryFlowByMonthList(url: string): Observable<RegionEntryFlowByMonthLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new RegionEntryFlowByMonthLinkResponse(data)));
  }

  /**
   * 按年查区入口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @param order_by 排序方式
   * @param show_type 显示类型：1,图表;2,表格
   * @returns Observable<R>
   */
  public requestRegionStatisticsEntryFlowByYearList(region_id: string, startDate: Date,
    endDate: Date, page_size: number,
    order_by: 'total_entry_flow' | '-total_entry_flow' | 'time_point',
    show_type: '1' | '2' = '1'): Observable<RegionEntryFlowByYearLinkResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      page_num: 1,
      page_size: page_size,
      order_by: order_by,
      show_type: show_type
    });
    return this.httpService.get(this.domain + '/region_statistics/parking_entry_flow_by_year', params).pipe(map(data => new RegionEntryFlowByYearLinkResponse(data)));
  }

  /**
   * 按link继续按年查区入口流量
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueRegionStatisticsEntryFlowByYearList(url: string): Observable<RegionEntryFlowByYearLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new RegionEntryFlowByYearLinkResponse(data)));
  }

  /**
   * 按时查组入口流量
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   */
  public requestGroupStatisticsEntryFlowByHourList(parking_group_id: string, startDate: Date, endDate: Date): Observable<Array<GroupEntryFlowByHourEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      parking_group_id: parking_group_id,
    });
    return this.httpService.get(this.domain + '/group_statistics/parking_entry_flow_by_hour', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(GroupEntryFlowByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按天查组入口流量(获取所有)
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Subject<Array<GroupEntryFlowByDayEntity>>
   */
  public requestAllGroupStatisticsEntryFlowByDayList(parking_group_id: string, startDate: Date, endDate: Date): Observable<Array<GroupEntryFlowByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const url = `${this.domain}/group_statistics/parking_entry_flow_by_day?page_num=1&page_size=1000&parking_group_id=${parking_group_id ? parking_group_id : ''}&section=${section}`;
    const subject = new Subject<Array<GroupEntryFlowByDayEntity>>();
    this.requestLinkAllGroupStatisticsEntryFlowByDayList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取按周查组入口流量
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllGroupStatisticsEntryFlowByDayList(url: string, dataArray: Array<GroupEntryFlowByDayEntity>, subject: Subject<Array<GroupEntryFlowByDayEntity>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data['body'];
      results.forEach(jsonObj => {
        dataArray.push(GroupEntryFlowByDayEntity.Create(jsonObj));
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllGroupStatisticsEntryFlowByDayList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 按天查组入口流量
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @param order_by 排序方式
   * @returns Observable<R>
   */
  public requestGroupStatisticsEntryFlowByDayList(parking_group_id: string, startDate: Date,
    endDate: Date, page_size: number,
    order_by: 'total_entry_flow' | '-total_entry_flow' | 'time_point'): Observable<GroupEntryFlowByDayLinkResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      parking_group_id: parking_group_id,
      page_size: page_size,
      page_num: 1,
      order_by: order_by
    });
    return this.httpService.get(this.domain + '/group_statistics/parking_entry_flow_by_day', params).pipe(map(data => new GroupEntryFlowByDayLinkResponse(data)));
  }

  /**
   * 按link继续按天查组入口流量
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueGroupStatisticsEntryFlowByDayList(url: string): Observable<GroupEntryFlowByDayLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new GroupEntryFlowByDayLinkResponse(data)));
  }

  /**
   * 按周查组入口流量(获取所有)
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Subject<Array<GroupEntryFlowByWeekEntity>>
   */
  public requestAllGroupStatisticsEntryFlowByWeekList(parking_group_id: string, startDate: Date, endDate: Date): Observable<Array<GroupEntryFlowByWeekEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const url = `${this.domain}/group_statistics/parking_entry_flow_by_week?page_num=1&page_size=1000&parking_group_id=${parking_group_id ? parking_group_id : ''}&section=${section}`;
    const subject = new Subject<Array<GroupEntryFlowByWeekEntity>>();
    this.requestLinkAllGroupStatisticsEntryFlowByWeekList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取按周查组入口流量
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllGroupStatisticsEntryFlowByWeekList(url: string, dataArray: Array<GroupEntryFlowByWeekEntity>, subject: Subject<Array<GroupEntryFlowByWeekEntity>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data['body'];
      results.forEach(jsonObj => {
        dataArray.push(GroupEntryFlowByWeekEntity.Create(jsonObj));
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllGroupStatisticsEntryFlowByWeekList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 按周查组入口流量
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Observable<R>
   */
  public requestGroupStatisticsEntryFlowByWeekList(parking_group_id: string, startDate: Date, endDate: Date, page_size: number = 1000): Observable<Array<GroupEntryFlowByWeekEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      parking_group_id: parking_group_id,
      page_num: 1,
      page_size: page_size
    });
    return this.httpService.get(this.domain + '/group_statistics/parking_entry_flow_by_week', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(GroupEntryFlowByWeekEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按月查组入口流量
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @param order_by 排序方式
   * @returns Observable<R>
   */
  public requestGroupStatisticsEntryFlowByMonthList(parking_group_id: string, startDate: Date,
    endDate: Date, page_size: number = 1000,
    order_by: 'total_entry_flow' | '-total_entry_flow' | 'time_point' = 'time_point'): Observable<GroupEntryFlowByMonthLinkResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      parking_group_id: parking_group_id,
      page_num: 1,
      page_size: page_size,
      order_by: order_by
    });
    return this.httpService.get(this.domain + '/group_statistics/parking_entry_flow_by_month', params).pipe(map(data => new GroupEntryFlowByMonthLinkResponse(data)));
  }

  /**
   * 按link继续按月查组入口流量
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueGroupStatisticsEntryFlowByMonthList(url: string): Observable<GroupEntryFlowByMonthLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new GroupEntryFlowByMonthLinkResponse(data)));
  }

  /**
   * 按年查组入口流量
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @param order_by 排序方式
   * @returns Observable<R>
   */
  public requestGroupStatisticsEntryFlowByYearList(parking_group_id: string, startDate: Date,
    endDate: Date, page_size: number,
    order_by: 'total_entry_flow' | '-total_entry_flow' | 'time_point'): Observable<GroupEntryFlowByYearLinkResponse> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      parking_group_id: parking_group_id,
      page_num: 1,
      page_size: page_size,
      order_by: order_by
    });
    return this.httpService.get(this.domain + '/group_statistics/parking_entry_flow_by_year', params).pipe(map(data => new GroupEntryFlowByYearLinkResponse(data)));
  }

  /**
   * 按link继续按年查组入口流量
   * @param url linkUrl
   * @returns Observable<R>
   */
  public continueGroupStatisticsEntryFlowByYearList(url: string): Observable<GroupEntryFlowByYearLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new GroupEntryFlowByYearLinkResponse(data)));
  }

  /**
   * 查按每天所有停车场入口总流量
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @returns Observable<R>
   */
  public requestParkingStatisticsTotalEntryFlowByDayList(startDate: Date, endDate: Date, page_size: number = 1000): Observable<Array<ParkingTotalEntryFlowByEveryDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      page_num: 1,
      page_size: page_size,
    });
    return this.httpService.get(this.domain + '/parking_statistics/parking_entry_flow_by_everyday', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(ParkingTotalEntryFlowByEveryDayEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按每天查所有组入口总流量
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @returns Observable<R>
   */
  public requestGroupStatisticsTotalEntryFlowByDayList(startDate: Date, endDate: Date, page_size: number = 1000): Observable<Array<GroupTotalEntryFlowByEveryDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      page_size: page_size,
      page_num: 1,
    });
    return this.httpService.get(this.domain + '/group_statistics/parking_entry_flow_by_everyday', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(GroupTotalEntryFlowByEveryDayEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按每天查所有区入口总流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param show_type 显示类型：1,图表;2,表格
   * @param page_size 分页大小
   * @returns Observable<R>
   */
  public requestRegionStatisticsTotalEntryFlowByDayList(
    region_id: string, startDate: Date, endDate: Date, show_type: '1' | '2' = '1', page_size: number = 1000): Observable<Array<RegionTotalEntryFlowByEveryDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      show_type: show_type,
      page_num: 1,
      page_size: page_size
    });
    return this.httpService.get(this.domain + '/region_statistics/parking_entry_flow_by_everyday', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(RegionTotalEntryFlowByEveryDayEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按时查停车场出口流量
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @return Observable<Array<RegionExitFlowByHourEntity>>
   */
  public requestRegionStatisticsExitFlowByHourList(region_id: string, startDate: Date, endDate: Date, page_size: number = 1000): Observable<Array<RegionExitFlowByHourEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      page_num: 1,
      page_size: page_size,
    });
    return this.httpService.get(this.domain + '/region_statistics/parking_exit_flow_by_hour', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(RegionExitFlowByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 查询入口总流量
   * @returns Observable<Response>
   */
  public requestTotalRegionStatisticsEntryFlow(): Observable<TotalEntryFlowEntity> {
    return this.httpService.get(this.domain + '/region_statistics/total_entry_flow').pipe(map(
      data => TotalEntryFlowEntity.Create(data['body'])));
  }
}

export class ParkingEntryFlowByDayLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ParkingEntryFlowByDayEntity> {
    const tempList: Array<ParkingEntryFlowByDayEntity> = [];
    results.forEach(res => {
      tempList.push(ParkingEntryFlowByDayEntity.Create(res));
    });
    return tempList;
  }
}

export class ParkingEntryFlowByMonthLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ParkingEntryFlowByMonthEntity> {
    const tempList: Array<ParkingEntryFlowByMonthEntity> = [];
    results.forEach(res => {
      tempList.push(ParkingEntryFlowByMonthEntity.Create(res));
    });
    return tempList;
  }
}

export class ParkingEntryFlowByYearLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ParkingEntryFlowByYearEntity> {
    const tempList: Array<ParkingEntryFlowByYearEntity> = [];
    results.forEach(res => {
      tempList.push(ParkingEntryFlowByYearEntity.Create(res));
    });
    return tempList;
  }
}

export class GroupEntryFlowByDayLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<GroupEntryFlowByDayEntity> {
    const tempList: Array<GroupEntryFlowByDayEntity> = [];
    results.forEach(res => {
      tempList.push(GroupEntryFlowByDayEntity.Create(res));
    });
    return tempList;
  }
}

export class GroupEntryFlowByMonthLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<GroupEntryFlowByMonthEntity> {
    const tempList: Array<GroupEntryFlowByMonthEntity> = [];
    results.forEach(res => {
      tempList.push(GroupEntryFlowByMonthEntity.Create(res));
    });
    return tempList;
  }
}

export class GroupEntryFlowByYearLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<GroupEntryFlowByYearEntity> {
    const tempList: Array<GroupEntryFlowByYearEntity> = [];
    results.forEach(res => {
      tempList.push(GroupEntryFlowByYearEntity.Create(res));
    });
    return tempList;
  }
}

export class RegionEntryFlowByDayLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<RegionEntryFlowByDayEntity> {
    const tempList: Array<RegionEntryFlowByDayEntity> = [];
    results.forEach(res => {
      tempList.push(RegionEntryFlowByDayEntity.Create(res));
    });
    return tempList;
  }
}

export class RegionEntryFlowByMonthLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<RegionEntryFlowByMonthEntity> {
    const tempList: Array<RegionEntryFlowByMonthEntity> = [];
    results.forEach(res => {
      tempList.push(RegionEntryFlowByMonthEntity.Create(res));
    });
    return tempList;
  }
}

export class RegionEntryFlowByYearLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<RegionEntryFlowByYearEntity> {
    const tempList: Array<RegionEntryFlowByYearEntity> = [];
    results.forEach(res => {
      tempList.push(RegionEntryFlowByYearEntity.Create(res));
    });
    return tempList;
  }
}
