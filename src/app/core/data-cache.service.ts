import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/* 数据缓存
* 适用场景:1.单纯数据的缓存
* 2.检索列表页面的状态缓存,同时在子页面如果发生数据变更(增，删，改),需要手动清除缓存。
* 注意:当前只能存储一份缓存，不适合当作为全局缓存。
* 要求:熟悉服务注入后的作用域，不然会思维混乱。
* by zwl 2018.2.9
* */
@Injectable()
export class DataCacheService {

  private cacheObj: any;

  /**
   * 设置缓存数据
   * @param dataProvider 数据提供者
   * @param propertyKeys 需要缓存的字段
   */
  public setCache(dataProvider: any, ...propertyKeys: string[]) {
    this.cacheObj = {};
    propertyKeys.forEach(key => {
      this.cacheObj[key] = dataProvider[key];
    });
  }

  /**
   * 获取缓存数据
   * @returns {any}
   */
  public getCache(): Observable<any> {
    return Observable.create(observer => {
      const tmpCache = this.cacheObj;
      this.cacheObj = null;
      observer.next(tmpCache);
      observer.complete();
    });
  }

  /**
   * 当缓存数据不再适用时需要清空时调用
   */
  public clear() {
    this.cacheObj = null;
  }
}
