import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zMaxLength'
})
export class ZMaxLengthPipe implements PipeTransform {

  /**
   * 转换方法
   * @param message 文本
   * @returns any
   */
  public transform(message: any, maxLength = 10, dot = true): string {
    if (message && message.length > maxLength) {
      return message.substr(0, maxLength - 1) + (dot ? '...' : '');
    }
    return message;
  }

}
