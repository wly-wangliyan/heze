import {Injectable} from '@angular/core';
import {HttpService, LinkResponse} from '../../core/http.service';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {
  ParkingEntity, ParkingRelationEntity,
  ParkingsSearchParams,
} from './parkings.model';

@Injectable()
export class ParkingsHttpService {

  private domain = environment.CIPP_UNIVERSE;

  constructor(private httpService: HttpService) {
  }

  /**
   * 条件检索停车场
   * @param searchParams
   * @param isList
   * @returns {OperatorFunction<T, R>}
   */
  public requestParkingsData(searchParams: ParkingsSearchParams, isList: boolean = true): Observable<ParkingsLinkResponse> {
    const url = this.domain + '/parkings';
    let params = this.httpService.generateListURLSearchParams(searchParams);
    if (!isList) {
      params = this.httpService.generateURLSearchParams(searchParams);
    }
    return this.httpService.get(url, params).pipe(map(data => new ParkingsLinkResponse(data)));
  }

  /**
   * 通过link查看停车场列表
   * @param url
   * @returns {Observable<R>}
   */
  public continueParkingsData(url: string): Observable<ParkingsLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new ParkingsLinkResponse(data)));
  }

  /**
   * 请求所有停车场
   * @returns {Subject<Array<ParkingEntity>>}
   */
  public requestAllParkingData() {
    const url = this.domain + '/parkings?page_num=1&page_size=1000';
    const subject = new Subject<Array<ParkingEntity>>();
    this.requestLinkAllParkingList(url, [], subject);
    return subject;
  }

  private requestLinkAllParkingList(url: string, dataArray: Array<ParkingEntity>, subject: Subject<Array<any>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data.body;
      results.forEach(jsonObj => {
        dataArray.push(ParkingEntity.Create(jsonObj));
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllParkingList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 获取指定停车场
   * @param parkingId
   * @returns {Observable<R>}
   */
  public requestParkingsByIdData(parkingId: string): Observable<ParkingEntity> {
    const url = this.domain + '/parkings/' + parkingId;
    return this.httpService.get(url).pipe(map(data => ParkingEntity.Create(data.body)));
  }


  /**
   * 获取停车场运营关系
   * @param {string} parking_id
   * @returns {Observable<ParkingRelationEntity>}
   */
  public requestParkingRelationDetail(parking_id: string): Observable<ParkingRelationEntity> {
    return this.httpService.get(this.domain + `/parkings/${parking_id}/relation`)
      .pipe(map(data => ParkingRelationEntity.Create(data.body)));
  }
}

export class ParkingsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ParkingEntity> {
    const tempList: Array<ParkingEntity> = [];
    results.forEach(res => {
      tempList.push(ParkingEntity.Create(res));
    });
    return tempList;
  }
}
