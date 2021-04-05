/**
 * Created by zack on 9/3/18.
 */
import { HttpService } from '../../../core/http.service';
import { Subject, Observable } from 'rxjs';
import {
  RegionTurnoverRateByHourEntity,
  RegionTurnoverRateByDayEntity, GroupTurnoverRateByHourEntity, GroupTurnoverRateByDayEntity
} from '../data-statistics.model';
import { DateFormatHelper } from '../../../../utils/date-format-helper';
import { map } from 'rxjs/operators';
import { EntityBase } from '../../../../utils/z-entity';

export class DSTurnoverRateHttpService {
  private domain: string;
  private httpService: HttpService;

  constructor(httpService: HttpService, domain: string) {
    this.domain = domain;
    this.httpService = httpService;
  }

  /**** 周转率 ****/
  /**
   * 按行政区域检索按小时统计的周转率结果
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Observable<R>
   */
  public requestRegionStatisticsTurnoverRateByHourList(region_id: string, startDate: Date, endDate: Date): Observable<Array<RegionTurnoverRateByHourEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
    });
    return this.httpService.get(this.domain + '/region_statistics/turnover_rate_by_hour', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(RegionTurnoverRateByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按行政区域检索按天统计的周转率结果(获取所有)
   * @param region_id 区id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Subject<Array<RegionTurnoverRateByDayEntity>>
   */
  public requestAllRegionStatisticsTurnoverRateByDayList(region_id: string, startDate: Date, endDate: Date): Observable<Array<RegionTurnoverRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const url = `${this.domain}/region_statistics/turnover_rate_by_day?page_num=1&page_size=1000&region_id=${region_id ? region_id : ''}&section=${section}`;
    const subject = new Subject<Array<RegionTurnoverRateByDayEntity>>();
    this.requestLinkAllRegionStatisticsTurnoverRateByDayList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取按行政区域检索按天统计的周转率结果
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllRegionStatisticsTurnoverRateByDayList(url: string, dataArray: Array<RegionTurnoverRateByDayEntity>, subject: Subject<Array<RegionTurnoverRateByDayEntity>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data['body'];
      results.forEach(jsonObj => {
        dataArray.push(RegionTurnoverRateByDayEntity.Create(jsonObj));
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllRegionStatisticsTurnoverRateByDayList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 按行政区域检索按天统计的周转率结果
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @returns Observable<R>
   */
  public requestRegionStatisticsTurnoverRateByDayList(region_id: string, startDate: Date, endDate: Date, page_size: number = 1000): Observable<Array<RegionTurnoverRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
      page_num: 1,
      page_size: page_size
    });
    return this.httpService.get(this.domain + '/region_statistics/turnover_rate_by_day', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(RegionTurnoverRateByDayEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按组检索按小时统计的周转率结果
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Observable<R>
   */
  public requestGroupStatisticsTurnoverRateByHourList(parking_group_id: string, startDate: Date, endDate: Date): Observable<Array<GroupTurnoverRateByHourEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      parking_group_id: parking_group_id,
    });
    return this.httpService.get(this.domain + '/group_statistics/turnover_rate_by_hour', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(GroupTurnoverRateByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按组检索按天统计的周转率结果(获取所有)
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Subject<Array<GroupTurnoverRateByDayEntity>>
   */
  public requestAllGroupStatisticsTurnoverRateByDayList(parking_group_id: string, startDate: Date, endDate: Date): Observable<Array<GroupTurnoverRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const url = `${this.domain}/group_statistics/turnover_rate_by_day?page_num=1&page_size=1000&parking_group_id=${parking_group_id ? parking_group_id : ''}&section=${section}`;
    const subject = new Subject<Array<GroupTurnoverRateByDayEntity>>();
    this.requestLinkAllGroupStatisticsTurnoverRateByDayList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取按组检索按天统计的周转率结果
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllGroupStatisticsTurnoverRateByDayList(url: string, dataArray: Array<GroupTurnoverRateByDayEntity>, subject: Subject<Array<GroupTurnoverRateByDayEntity>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data['body'];
      results.forEach(jsonObj => {
        dataArray.push(GroupTurnoverRateByDayEntity.Create(jsonObj));
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllGroupStatisticsTurnoverRateByDayList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 按组检索按天统计的周转率结果
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @param page_size 分页大小
   * @returns Observable<R>
   */
  public requestGroupStatisticsTurnoverRateByDayList(parking_group_id: string, startDate: Date, endDate: Date, page_size: number = 1000): Observable<Array<GroupTurnoverRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      parking_group_id: parking_group_id,
      page_num: 1,
      page_size: page_size
    });
    return this.httpService.get(this.domain + '/group_statistics/turnover_rate_by_day', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(GroupTurnoverRateByDayEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按周查组周转率
   */
  // public requestTurnoverByWeek()
  public requestTurnoverByWeek(parking_group_id: string, startDate: Date, endDate: Date, page_size: number = 1000): Observable<Array<GroupTurnoverRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      parking_group_id: parking_group_id,
      page_num: 1,
      page_size: page_size
    });
    return this.httpService.get(this.domain + '/group_statistics/turnover_rate_by_week', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(GroupTurnoverRateByDayEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }
}

export class TurnoverEntity extends EntityBase {
  public group_turnover_rate_by_week_id: string = undefined; // 	String	组周转率按周统计id
  public parking_group: string = undefined; // 		Json	关联组
  public road_inside_entry_flow: number = undefined; // 		Int	路内入口流量
  public road_inside_total_num: number = undefined; // 		Int	路内停车场总车位数
  public road_inside_turnover_rate: number = undefined; // 		Float	路内停车场周转率
  public road_outside_entry_flow: number = undefined; // 		Int	路外入口流量
  public road_outside_total_num: number = undefined; // 		Int	路外停车场总车位数
  public road_outside_turnover_rate: number = undefined; // 		Float	路外停车场周转率
  public total_entry_flow: number = undefined; // 		Int	总入口流量
  public total_num: number = undefined; // 		Int	停车场总车位数
  public total_turnover_rate: number = undefined; // 		Float	周转率
  public road_inside_parking_count: number = undefined; // 		Int	路内停车场总数
  public road_outside_parking_count: number = undefined; // 	Int	路外停车场总数
  public total_parking_count: number = undefined; // 		Int	停车场总数
  public time_point: number = undefined; // 		Float	每周的时间点
  public updated_time: number = undefined; // 		Float	更新时间
  public created_time: number = undefined; // 		Float	创建时间
}
