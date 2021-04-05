import { Pipe, PipeTransform } from '@angular/core';

const CompanyState = {
  1: '正常',
  2: '异常'
};

@Pipe({
  name: 'companyState'
})
export class CompanyStatePipe implements PipeTransform {

  transform(value: any, args: any[]): any {
    if (value === null || value === undefined) {
      return '--';
    } else if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return CompanyState[value];
    } else {
      return CompanyState[value];
    }
  }
}

