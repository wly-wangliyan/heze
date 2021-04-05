import {Injectable} from '@angular/core';
import {HttpService, LinkResponse} from "../../../../core/http.service";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {map} from "rxjs/operators";
import {HttpResponse} from "@angular/common/http";
import {EntityBase} from "../../../../../utils/z-entity";


class MonitorLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<MonitorEntity> {
    const tempList: Array<MonitorEntity> = [];
    results.forEach(res => {
      tempList.push(MonitorEntity.Create(res));
    });
    return tempList;
  }
}

export class MonitorEntity extends EntityBase {
  public camera_config_id: string = undefined;
  public parking_id: string = undefined;
  public company_id: string = undefined;
  public camera_name: string = undefined;
  public app_key: string = undefined;
  public app_secret: string = undefined;
  public hd_video_url: string = undefined;
  public smooth_video_url: string = undefined;
  public created_time: number = undefined;
  public updated_time: number = undefined;
}

export class MonitorEditParams extends EntityBase {
  public camera_name: string = undefined; //监控摄像头名称
  public app_key: string = undefined; //摄像头key
  public app_secret: string = undefined; //摄像头secret
  public hd_video_url: string = undefined; //高清视频地址
  public smooth_video_url: string = undefined; //流畅视频地址
}

@Injectable({
  providedIn: 'root'
})
export class MonitorInfoService {

  constructor(private httpService: HttpService) {
  }

  /**
   * 获取某个停车场下的监控摄像头配置
   * @returns {Observable<R>}
   * @param parking_id
   */
  public requestMonitorList(parking_id: string): Observable<MonitorLinkResponse> {
    return this.httpService.get(environment.CIPP_UNIVERSE + `/parkings/${parking_id}/camera_configs`)
      .pipe(map(data => new MonitorLinkResponse(data)));
  }

  /**
   * 通过link获取列表
   * @param url url
   * @returns {Observable<R>}
   */
  public continueMonitorList(url: string): Observable<MonitorLinkResponse> {
    return this.httpService.get(url).pipe(map(data => new MonitorLinkResponse(data)));
  }

  /**
   * 获取某个停车场下的某个监控摄像头配置
   * @param parking_id
   * @param camera_config_id
   */
  public requestMonitorData(parking_id: string, camera_config_id: string): Observable<MonitorEntity> {
    return this.httpService.get(environment.CIPP_UNIVERSE + `/parkings/${parking_id}/camera_configs/${camera_config_id}`)
      .pipe(map(data => MonitorEntity.Create(data.body)));
  }

  /**
   * 创建|编辑某个停车场下的监控摄像头配置
   * @param editParams 用户参数
   * @param parking_id
   * @param camera_config_id
   * @returns {Observable<HttpResponse<any>>}
   */
  public requestAddOrUpdateMonitor(editParams: MonitorEditParams, parking_id: string, camera_config_id?: string): Observable<HttpResponse<any>> {
    if (camera_config_id) {
      return this.httpService.put(environment.CIPP_UNIVERSE + `/parkings/${parking_id}/camera_configs/${camera_config_id}`, editParams);
    } else {
      return this.httpService.post(environment.CIPP_UNIVERSE + `/parkings/${parking_id}/camera_configs`, editParams);
    }
  }

  /**
   * 删除某个停车场下的某个监控摄像头配置
   * @param parking_id
   * @param camera_config_id
   */
  public requestDeleteMonitorData(parking_id: string, camera_config_id: string): Observable<HttpResponse<any>> {
    return this.httpService.delete(environment.CIPP_UNIVERSE + `/parkings/${parking_id}/camera_configs/${camera_config_id}`);
  }

  /**
   * 获取监控摄像头token
   * @param parking_id
   * @param camera_config_id
   */
  public requestMonitorTokenData(parking_id: string, camera_config_id: string): Observable<any> {
    return this.httpService.get(environment.CIPP_UNIVERSE + `/parkings/${parking_id}/camera_configs/${camera_config_id}/token`).pipe(map(data => data.body));
  }
}
