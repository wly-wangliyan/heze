import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zTenThousandUnit'
})
export class ZTenThousandUnitPipe implements PipeTransform {

  /**
   * 转换方法
   * @param message 文本
   * @param digit 小数点位数,默认两位(大于等于0)
   * @param unit  是否带单位
   * @returns {any}
   */
  public transform(message: any, digit = 2, unit = true): string {
    let result: string;
    const num = parseFloat(message);

    // 处理数字部分, 有单位并且大于1万 : 无单位或有单位并且小于10000
    result = unit && num >= 10000 ? (num / 10000).toFixed(digit) : num.toFixed(digit);
    // 处理小数部分
    result = this.processDigits(result, digit);
    // 加单位
    result = unit && num >= 10000 ? result + '万' : result;
    return result;
  }

  private processDigits(result: string, digit: number): string {
    for (let index = 0; index <= digit && digit !== 0; index++) {
      if (result.slice(-1) === '0' || result.slice(-1) === '.') {
        result = result.substring(0, result.length - 1);
      } else {
        break;
      }
    }
    return result;
  }

}
