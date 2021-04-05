import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../utils/z-entity';
import { environment } from '../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { Observable } from 'rxjs';
import { ParkingBasicInfoEntity } from '../../parkings/parkings.model';
import { CompanyBasicInfoEntity } from '../../basics/operation-company/operation-company.model';
import { PlatformBasicInfoEntity } from '../../basics/manufacturer/manufacturer.model';
import { map } from 'rxjs/operators';

export class UploadRecordEntity extends EntityBase {
  public upload_record_id = ''; // String(32) 上传记录ID
  public parking: ParkingBasicInfoEntity = undefined; // Json	停车场信息
  public company: CompanyBasicInfoEntity = undefined; // Json	运营公司信息
  public platform: PlatformBasicInfoEntity = undefined; // Json	收费系统信息
  public upload_type: string = undefined; // 上传类型
  public content: string = undefined; // 具体内容
  public created_time: number = undefined; // Float	创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking') {
      return ParkingBasicInfoEntity;
    } else if (propertyName === 'company') {
      return CompanyBasicInfoEntity;
    } else if (propertyName === 'platform') {
      return PlatformBasicInfoEntity;
    }
    return null;
  }
}

export class SearchUploadRecordParams extends EntityBase {
  public parking_name: string = undefined; // String	F	停车场名称
  public company_name: string = undefined; // String	F	运营公司名称
  public platform_name: string = undefined; // String	F	收费系统名称
  public section: string = undefined; // String	F	时间戳区间, 单位秒
  public page_limit: number = undefined;
}

export class UploadRecordsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<UploadRecordEntity> {
    const tempList: Array<UploadRecordEntity> = [];
    results.forEach(res => {
      tempList.push(UploadRecordEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable()
export class UploadRecordsHttpService {

  private domain = environment.CIPP_UNIVERSE;

  constructor(private httpService: HttpService) {
  }

  /**
   * 条件检索上传记录
   * @param searchParams 参数列表
   * @returns {Observable<R>}
   */
  public requestUploadRecordsData(searchParams: SearchUploadRecordParams): Observable<UploadRecordsLinkResponse> {
    const url = this.domain + '/upload_records';
    const params = this.httpService.generateListURLSearchParams(searchParams);
    return this.httpService.get(url, params).pipe(map(data => new UploadRecordsLinkResponse(data)));
  }

  /**
   * 通过link条件检索上传记录
   * @param url url
   * @returns {Observable<R>}
   */
  public continueUploadRecordsData(url: string): Observable<UploadRecordsLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new UploadRecordsLinkResponse(data)));
  }
}

