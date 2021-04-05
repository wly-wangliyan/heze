/**
 * Created by zack on 9/3/18.
 */
import { HttpService } from '../../../core/http.service';
import { Subject, Observable } from 'rxjs';
import {
  RegionOnlineRateByHourEntity, RegionOnlineRateByDayEntity,
  GroupOnlineRateByHourEntity, GroupOnlineRateByDayEntity
} from '../data-statistics.model';
import { DateFormatHelper } from '../../../../utils/date-format-helper';
import { map } from 'rxjs/operators';

export class DSOnlineRateHttpService {
  private domain: string;
  private httpService: HttpService;

  constructor(httpService: HttpService, domain: string) {
    this.domain = domain;
    this.httpService = httpService;
  }

  /**** 在线率 ****/
  /**
   * 按行政区域检索按小时统计的在线率结果
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Observable<R>
   */
  public requestRegionStatisticsOnlineRateByHourList(region_id: string, startDate: Date, endDate: Date): Observable<Array<RegionOnlineRateByHourEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
    });
    return this.httpService.get(this.domain + '/region_statistics/online_rates_by_hours', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(RegionOnlineRateByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按行政区域检索按天统计的在线率结果(获取所有)
   * @param region_id 区id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Subject<Array<RegionOnlineRateByDayEntity>>
   */
  public requestAllRegionStatisticsOnlineRateByDayList(region_id: string, startDate: Date, endDate: Date): Observable<Array<RegionOnlineRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const url = `${this.domain}/region_statistics/online_rates_by_days?page_limit=1000&region_id=${region_id ? region_id : ''}&section=${section}`;
    const subject = new Subject<Array<RegionOnlineRateByDayEntity>>();
    this.requestLinkAllRegionStatisticsOnlineRateByDayList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取按行政区域检索按天统计的在线率结果
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllRegionStatisticsOnlineRateByDayList(url: string, dataArray: Array<RegionOnlineRateByDayEntity>, subject: Subject<Array<RegionOnlineRateByDayEntity>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data['body'];
      results.forEach(jsonObj => {
        dataArray.push(RegionOnlineRateByDayEntity.Create(jsonObj));
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllRegionStatisticsOnlineRateByDayList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 按行政区域检索按天统计的在线率结果
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Observable<R>
   */
  public requestRegionStatisticsOnlineRateByDayList(region_id: string, startDate: Date, endDate: Date): Observable<Array<RegionOnlineRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
    });
    return this.httpService.get(this.domain + '/region_statistics/online_rates_by_days', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(RegionOnlineRateByDayEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按组检索按小时统计的在线率结果
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Observable<R>
   */
  public requestGroupStatisticsOnlineRateByHourList(parking_group_id: string, startDate: Date, endDate: Date): Observable<Array<GroupOnlineRateByHourEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      parking_group_id: parking_group_id,
    });
    return this.httpService.get(this.domain + '/group_statistics/online_rates_by_hours', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(GroupOnlineRateByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按组检索按天统计的在线率结果(获取所有)
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Subject<Array<GroupOnlineRateByDayEntity>>
   */
  public requestAllGroupStatisticsOnlineRateByDayList(parking_group_id: string, startDate: Date, endDate: Date): Observable<Array<GroupOnlineRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const url = `${this.domain}/group_statistics/online_rates_by_days?page_limit=1000&parking_group_id=${parking_group_id ? parking_group_id : ''}&section=${section}`;
    const subject = new Subject<Array<GroupOnlineRateByDayEntity>>();
    this.requestLinkAllGroupStatisticsOnlineRateByDayList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取按组检索按天统计的在线率结果
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllGroupStatisticsOnlineRateByDayList(url: string, dataArray: Array<GroupOnlineRateByDayEntity>, subject: Subject<Array<GroupOnlineRateByDayEntity>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data['body'];
      results.forEach(jsonObj => {
        dataArray.push(GroupOnlineRateByDayEntity.Create(jsonObj));
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllGroupStatisticsOnlineRateByDayList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 按组检索按天统计的在线率结果
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Observable<R>
   */
  public requestGroupStatisticsOnlineRateByDayList(parking_group_id: string, startDate: Date, endDate: Date): Observable<Array<GroupOnlineRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      parking_group_id: parking_group_id,
    });
    return this.httpService.get(this.domain + '/group_statistics/online_rates_by_days', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(GroupOnlineRateByDayEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }
}
