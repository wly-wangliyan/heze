import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { GlobalService } from '../../core/global.service';

@Pipe({
  name: 'zDuration'
})

/**根据开始结束时间计算停车时长 */
export class ZDurationPipe implements PipeTransform {

  public transform(startTimeStamp: number, endTimeStamp: number | null, ignoreSeconds: boolean = true): any {
    if (isNullOrUndefined(startTimeStamp) || !startTimeStamp) {
      // 未传递开始时间戳则认为无效
      return '--';
    }
    if (isNullOrUndefined(endTimeStamp) || !endTimeStamp) {
      // 当结束时间为空时使用当前时间戳
      endTimeStamp = GlobalService.Instance.timeStamp;
    }

    let totalSeconds = Math.floor(Number(endTimeStamp - startTimeStamp));
    if (totalSeconds <= 0) {
      return '0天';
    }

    if (ignoreSeconds) {
      const second = totalSeconds % 3600 % 60;
      if (second !== 0) {
        totalSeconds = totalSeconds - second + 60; // 当秒数不为0时进位(进一分钟)
      }
    }

    const days = Math.floor(Number(totalSeconds / (3600 * 24)));
    const hours = Math.floor(Number(totalSeconds % (3600 * 24) / 3600));
    const minutes = Math.floor(Number(totalSeconds % 3600 / 60));
    const seconds = Math.floor(Number(totalSeconds % 3600 % 60));
    let formatDate = days ? days + '天' : null;
    formatDate = hours ? formatDate + hours + '小时' : formatDate;
    formatDate = minutes ? formatDate + minutes + '分' : formatDate;
    formatDate = seconds ? formatDate + seconds + '秒' : formatDate;

    return isNullOrUndefined(formatDate) ? '--' : formatDate;
  }

}

@Pipe({
  name: 'zDuration1'
})

/**根据停车时长时间戳转换停车时长 */
export class ZDuration1Pipe implements PipeTransform {

  public transform(durationTimeStamp: number, ignoreSeconds: boolean = true): any {
    if (durationTimeStamp === null || durationTimeStamp === undefined) {
      // 未传递时间戳则认为无效
      return '--';
    }

    let totalSeconds = Math.floor(Number(durationTimeStamp));
    if (totalSeconds <= 0) {
      return '0天';
    }

    if (ignoreSeconds) {
      const second = totalSeconds % 3600 % 60;
      if (second !== 0) {
        totalSeconds = totalSeconds - second + 60; // 当秒数不为0时进位(进一分钟)
      }
    }

    const days = Math.floor(Number(totalSeconds / (3600 * 24)));
    const hours = Math.floor(Number(totalSeconds % (3600 * 24) / 3600));
    const minutes = Math.floor(Number(totalSeconds % 3600 / 60));
    const seconds = Math.floor(Number(totalSeconds % 3600 % 60));
    let formatDate = days ? days + '天' : null;
    formatDate = hours ? formatDate + hours + '小时' : formatDate;
    formatDate = minutes ? formatDate + minutes + '分' : formatDate;
    formatDate = seconds ? formatDate + seconds + '秒' : formatDate;

    return isNullOrUndefined(formatDate) ? '--' : formatDate;
  }
}
