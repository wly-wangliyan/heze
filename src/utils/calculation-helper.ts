/**
 * Created by zack on 5/5/17.
 */
export class CalculationHelper {

  private constructor() {
  }

  /**
   * 计算增幅百分比 最大值为999%  显示样式: +32.18%
   * @param left 后值
   * @param right 前值
   * @returns IncreasePercentItem
   */
  public static IncreasePercent(left: number, right: number): IncreasePercentItem {
    if (left === 0 || right === 0 || left === right) {
      return new IncreasePercentItem(false, '');
    }
    const tempValue = (left - right) / right;
    let value;

    if (tempValue >= 10 || tempValue <= -10) {
      value = '999%';
    } else {
      value = (tempValue * 100).toFixed(2).toString() + '%';
    }

    value = tempValue > 0 ? '+' + value : value;

    return new IncreasePercentItem(tempValue > 0, value);
  }

  /**
   * 计算占比百分比 显示式样:(30.02%)
   * @param args 多个数字
   * @returns any[] 返回与传入数据长度相同的百分比字符串
   */
  public static ProportionPercent(...args: number[]): Array<string> {

    let total = 0;
    const results = new Array(args.length).fill('');

    // 求和
    args.forEach(num => {
      total += num;
    });

    if (total === 0) {
      return results;
    }

    args.forEach((num, index) => {
      const value = parseFloat((num / total * 100).toFixed(2));
      if (value !== 0) {
        results[index] = '(' + value.toString() + '%)';
      }
    });

    return results;
  }

  /**
   * 计算占比百分比 显示式样:(30.02%)
   * @param value 传入值
   * @param total 总值
   * @returns string 占比字符串
   */
  public static SoloProportionPercent(value: number, total: number): string {
    if (value === 0 || total === 0) {
      return '';
    }

    const temp = parseFloat((value / total * 100).toFixed(2));

    if (temp !== 0) {
      return '(' + temp.toString() + '%)';
    }

    return '';
  }

  public static Add(a, b) {
    let c, d, e;
    try {
      c = a.toString().split('.')[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      d = b.toString().split('.')[1].length;
    } catch (f) {
      d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (this.Mul(a, e) + this.Mul(b, e)) / e;
  }

  public static Sub(a, b) {
    let c, d, e;
    try {
      c = a.toString().split('.')[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      d = b.toString().split('.')[1].length;
    } catch (f) {
      d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (this.Mul(a, e) - this.Mul(b, e)) / e;
  }

  public static Mul(a, b) {
    let c = 0;
    const d = a.toString(),
      e = b.toString();
    try {
      c += d.split('.')[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      c += e.split('.')[1].length;
    } catch (f) {
      c = 0;
    }
    return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
  }

  public static Div(a, b) {
    let c, d, e = 0,
      f = 0;
    try {
      e = a.toString().split('.')[1].length;
    } catch (g) {
      e = 0;
    }
    try {
      f = b.toString().split('.')[1].length;
    } catch (g) {
      f = 0;
    }
    return c = Number(a.toString().replace('.', '')), d = Number(b.toString().replace('.', '')), this.Mul(c / d, Math.pow(10, f - e));
  }
}

export class IncreasePercentItem {

  public isPlus: boolean;
  public value: string;

  /**
   * 构造函数
   * @param isPlus 是否是正数
   * @param value 显示值
   */
  constructor(isPlus: boolean = false, value: string = '') {
    this.isPlus = isPlus;
    this.value = value;
  }
}
