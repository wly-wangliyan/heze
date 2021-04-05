/**
 * Created by zack on 9/3/18.
 */
import { HttpService } from '../../../core/http.service';
import { Subject, Observable } from 'rxjs';
import {
  RegionFillingRateByHourEntity, RegionFillingRateByDayEntity,
  GroupFillingRateByHourEntity, GroupFillingRateByDayEntity
} from '../data-statistics.model';
import { DateFormatHelper } from '../../../../utils/date-format-helper';
import { map } from 'rxjs/operators';

export class DSFillingRateHttpService {
  private domain: string;
  private httpService: HttpService;

  constructor(httpService: HttpService, domain: string) {
    this.domain = domain;
    this.httpService = httpService;
  }

  /**** 填充率 ****/
  /**
   * 按行政区域检索按小时统计的填充率结果
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Observable<R>
   */
  public requestRegionStatisticsFillingRateByHourList(region_id: string, startDate: Date, endDate: Date): Observable<Array<RegionFillingRateByHourEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
    });
    return this.httpService.get(this.domain + '/region_statistics/filling_rates_by_hours', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(RegionFillingRateByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按行政区域检索按天统计的填充率结果(获取所有)
   * @param region_id 区id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Subject<Array<RegionFillingRateByDayEntity>>
   */
  public requestAllRegionStatisticsFillingRateByDayList(region_id: string, startDate: Date, endDate: Date): Observable<Array<RegionFillingRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const url = `${this.domain}/region_statistics/filling_rates_by_days?page_limit=1000&region_id=${region_id ? region_id : ''}&section=${section}`;
    const subject = new Subject<Array<RegionFillingRateByDayEntity>>();
    this.requestLinkAllRegionStatisticsFillingRateByDayList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取按行政区域检索按天统计的填充率结果
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllRegionStatisticsFillingRateByDayList(url: string, dataArray: Array<RegionFillingRateByDayEntity>, subject: Subject<Array<RegionFillingRateByDayEntity>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data['body'];
      results.forEach(jsonObj => {
        dataArray.push(RegionFillingRateByDayEntity.Create(jsonObj));
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllRegionStatisticsFillingRateByDayList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 按行政区域检索按天统计的填充率结果
   * @param region_id 区域id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Observable<R>
   */
  public requestRegionStatisticsFillingRateByDayList(region_id: string, startDate: Date, endDate: Date): Observable<Array<RegionFillingRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      region_id: region_id,
    });
    return this.httpService.get(this.domain + '/region_statistics/filling_rates_by_days', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(RegionFillingRateByDayEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按组检索按小时统计的填充率结果
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Observable<R>
   */
  public requestGroupStatisticsFillingRateByHourList(parking_group_id: string, startDate: Date, endDate: Date): Observable<Array<GroupFillingRateByHourEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      parking_group_id: parking_group_id,
    });
    return this.httpService.get(this.domain + '/group_statistics/filling_rates_by_hours', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(GroupFillingRateByHourEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }

  /**
   * 按组检索按天统计的填充率结果(获取所有)
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Subject<Array<GroupFillingRateByDayEntity>>
   */
  public requestAllGroupStatisticsFillingRateByDayList(parking_group_id: string, startDate: Date, endDate: Date): Observable<Array<GroupFillingRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const url = `${this.domain}/group_statistics/filling_rates_by_days?page_limit=1000&parking_group_id=${parking_group_id ? parking_group_id : ''}&section=${section}`;
    const subject = new Subject<Array<GroupFillingRateByDayEntity>>();
    this.requestLinkAllGroupStatisticsFillingRateByDayList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取按组检索按天统计的填充率结果
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllGroupStatisticsFillingRateByDayList(url: string, dataArray: Array<GroupFillingRateByDayEntity>, subject: Subject<Array<GroupFillingRateByDayEntity>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data['body'];
      results.forEach(jsonObj => {
        dataArray.push(GroupFillingRateByDayEntity.Create(jsonObj));
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllGroupStatisticsFillingRateByDayList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 按组检索按天统计的填充率结果
   * @param parking_group_id 组id
   * @param startDate 开始时间
   * @param endDate 结束时间
   * @returns Observable<R>
   */
  public requestGroupStatisticsFillingRateByDayList(parking_group_id: string, startDate: Date, endDate: Date): Observable<Array<GroupFillingRateByDayEntity>> {
    const section = DateFormatHelper.GenerateSection(startDate, endDate);
    const params = this.httpService.generateURLSearchParams({
      section: section,
      parking_group_id: parking_group_id,
    });
    return this.httpService.get(this.domain + '/group_statistics/filling_rates_by_days', params).pipe(map(data => {
      const tempList = [];
      data['body'].forEach(jsonObj => {
        tempList.push(GroupFillingRateByDayEntity.Create(jsonObj));
      });
      return tempList;
    }));
  }
}
