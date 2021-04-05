import {Pipe, PipeTransform} from '@angular/core';
import {isNullOrUndefined} from 'util';

/* 当数值为空时使用占位符替换,默认为-- */
@Pipe({
  name: 'zPlaceholder'
})
export class ZPlaceholderPipe implements PipeTransform {

  public transform(value: string, placeholder: string = '--'): any {
    if (isNullOrUndefined(value) || value.trim() === '') {
      return placeholder;
    }
    return value;
  }
}
