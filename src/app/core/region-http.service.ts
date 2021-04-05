import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { EntityBase } from '../../utils/z-entity';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

export enum RegionLevel {
  province = 1,
  city = 2,
  district = 3,
}

export class RegionEntity extends EntityBase {
  public parent_id: string = undefined;
  public name: string = undefined;
  public region_id: string = undefined;
  public level: RegionLevel = undefined;
  public center: string = undefined; // '124.0000,24.0000'
  public cities: Array<RegionEntity> = undefined;
  public districts: Array<RegionEntity> = undefined;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'districts') {
      return RegionEntity;
    } else if (propertyName === 'cities') {
      return RegionEntity;
    }
    return null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RegionHttpService {

  constructor(private httpService: HttpService) {
  }

  /**
   * 请求行政区域列表
   * @param region_id 区域id
   * @returns {Observable<R>}
   */
  public requestRegions(region_id?: string): Observable<Array<RegionEntity>> {
    const httpUrl = `${environment.CIPP_UNIVERSE}/regions`;
    const params = this.httpService.generateURLSearchParams({ region_id: region_id });
    return this.httpService.get(httpUrl, params).pipe(map(res => {
      const regions: Array<RegionEntity> = [];
      res.body.forEach(data => {
        regions.push(RegionEntity.Create(data));
      });
      return regions;
    }));
  }
}
