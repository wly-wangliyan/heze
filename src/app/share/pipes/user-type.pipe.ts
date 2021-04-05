import { Pipe, PipeTransform } from '@angular/core';
import { Observable, from } from 'rxjs';

import { distinct } from 'rxjs/operators';

export const DefaultUserType = ['tmp', 'timely', 'count', 'white', 'black', 'visitor', 'space_sharing', 'reservation', 'other'];

const userTypeObj = {
  tmp: '临时',
  white: '白名单',
  black: '黑名单',
  timely: '包时',
  count: '包次',
  visitor: '访客',
  reservation: '预约',
  space_sharing: '共享',
  other: '其他',
};

@Pipe({
  name: 'userTypePipe'
})
export class UserTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      return '--';
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return userTypeObj[value] ? userTypeObj[value] : '--';
    } else if (value && value.length > 0) {
      // 当传递数组类型时的处理
      let str = '';
      from(value).pipe(distinct()).subscribe((code: any) => {
        // 拼接字符串
        const userType = userTypeObj[code] ? userTypeObj[code] : '';
        if (userType) {
          str = str ? str + ',' + userType : userType;
        }
      });
      return str ? str : '--';
    } else {
      return '--';
    }
  }
}
