import {Pipe, PipeTransform} from '@angular/core';
import {isUndefined} from 'util';

const ZERO = '0';

/* digitInfo is a string which has a following format:
 {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}
 minIntegerDigits is the minimum number of integer digits to use. Defaults to 1.
 minFractionDigits is the minimum number of digits after fraction. Defaults to 0.
 maxFractionDigits is the maximum number of digits after fraction. Defaults to 2.
 */
@Pipe({
  name: 'zNumber'
})
export class ZNumberPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    try {
      let minIntegerDigits, minFractionDigits, maxFractionDigits;
      if (isUndefined(args)) {
        // 未定义则使用默认值：整数最小1位，小数部分最小0位，最大2位。
        minIntegerDigits = 1;
        minFractionDigits = 0;
        maxFractionDigits = 2;
      } else {
        // 定义则使用设置值
        const tempParts: string[] = args.split('.');
        const integerDigits: string = tempParts[0];
        const fractionDigits: string = tempParts[1];
        minIntegerDigits = Number(integerDigits);
        minFractionDigits = Number(fractionDigits.split('-')[0]);
        maxFractionDigits = Number(fractionDigits.split('-')[1]);

        if (minFractionDigits > maxFractionDigits) {
          throw new Error('minFractionDigits cannot greater than maxFractionDigits.');
        }
      }

      // 将原数据转换成字符串形式,包括整数部分与小数部分
      let sourceValue: string = isUndefined(value) ? '' : typeof value === 'string' ? value : value.toString();
      const sourceFractionLength: number = isUndefined(sourceValue.split('.')[1]) ? 0 : sourceValue.split('.')[1].length;

      // 小数位数超出则四舍五入移除右侧位并重建原数据
      sourceValue = sourceFractionLength > maxFractionDigits ?
        Number(Number(sourceValue).toFixed(maxFractionDigits)).toString(/* 清零 */) : sourceValue;
      const sourceIntegerValue: string = sourceValue.split('.')[0];
      const sourceFractionValue = isUndefined(sourceValue.split('.')[1]) ? '' : sourceValue.split('.')[1];
      let targetIntegerValue = sourceIntegerValue;
      let targetFractionValue = sourceFractionValue;

      const subMinIntegerDigits = minIntegerDigits <= targetIntegerValue.length ? 0 : minIntegerDigits - targetIntegerValue.length;
      // 整数位数不足左侧补0
      targetIntegerValue = ZERO.repeat(subMinIntegerDigits) + targetIntegerValue;

      const subMinFractionDigits = minFractionDigits <= targetFractionValue.length ? 0 : minFractionDigits - targetFractionValue.length;
      // 小数位数不足右侧补0
      targetFractionValue = targetFractionValue + ZERO.repeat(subMinFractionDigits);

      // 拼接数据,返回目标字符串
      const targetValue = `${targetIntegerValue}${targetFractionValue.length > 0 ? '.' : ''}${targetFractionValue}`;
      return targetValue;
    } catch (ex) {
      throw new Error('args formatting error,use example like "1.0-2".');
    }
  }
}
