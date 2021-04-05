import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroFill'
})
export class ZeroFillPipe implements PipeTransform {
  /**小于10的前面用0补齐 */
  transform(value: number, args?: any): string {
    const prefix = '0';
    let resultStr = '' + value;
    if (value < 10) {
      resultStr = prefix + resultStr;
    }
    return resultStr;
  }
}
