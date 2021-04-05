/**
 * Created by zack on 12/2/18.
 */

/**
 * 数字转字符串
 * @param num 数字(忽略小数部分)
 * @returns string[]
 */
export function NumberToArray(num: number): Array<string> {
  const tmpStr = num.toFixed(0);
  const tmpArray = new Array<string>();
  for (const char of tmpStr) {
    tmpArray.push(char);
  }

  return tmpArray;
}
