export class ValidateHelper {

  /**
   * 校验是否为有效id地址
   * @param ip_addr 目标id地址
   * @returns boolean
   */
  public static Ip(ip: string): boolean {
    if (ip == null || ip === '') {
      return true;
    }
    const regex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return ip.match(regex) != null;
  }

  /**
   * 校验是否为有效邮箱
   * @param email 邮箱地址
   * @returns boolean
   */
  public static Email(email: string): boolean {
    if (email == null || email === '') {
      return true;
    }
    const regex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return regex.test(email);
  }

  /**
   * 校验是否为有效url
   * @param str_url 目标url
   * @returns boolean
   */
  public static Url(str_url: string): boolean {
    const strRegex = `^((https|http|ftp|rtsp|mms)?://)`
      + `?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?` // ftp的user@
      + `(([0-9]{1,3}\.){3}[0-9]{1,3}` // IP形式的URL- 199.194.52.184
      + `|` // 允许IP和DOMAIN（域名）
      + `([0-9a-z_!~*'()-]+\.)*` // 域名- www.
      + `([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.` // 二级域名
      + `[a-z]{2,6})` // first level domain- .com or .museum
      + `(:[0-9]{1,4})?` // 端口- :80
      + `((/?)|` // a slash isn't required if there is no file name
      + `(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$`;
    const regex = new RegExp(strRegex);
    return regex.test(str_url);
  }

  /**
   * 校验是否为有效url(只要http、https)
   * @param str_url 目标url
   * @returns boolean
   */
  public static checkUrl(str_url: string): boolean {
    const strRegex = `^((https|http)?://)`
      + `(([0-9]{1,3}\.){3}[0-9]{1,3}` // IP形式的URL- 199.194.52.184
      + `|` // 允许IP和DOMAIN（域名）
      + `([0-9a-z_!~*'()-]+\.)*` // 域名- www.
      + `([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.` // 二级域名
      + `[a-z]{2,6})` // first level domain- .com or .museum
      + `(:[0-9]{1,4})?` // 端口- :80
      + `((/?)|` // a slash isn't required if there is no file name
      + `(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$`;
    const regex = new RegExp(strRegex);
    return regex.test(str_url);
  }

  /**
   * 校验是否为有效mac地址
   * @param mac 目标mac地址
   * @returns boolean
   */
  public static Mac(mac: string): boolean {
    if (mac == null || mac === '') {
      return true;
    }
    const regex = /([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}/;
    return regex.test(mac);
  }

  /**
   * 校验是否为有效电话号码
   * @param telephone 目标电话号码
   * @returns boolean
   */
  public static Phone(phone: string): boolean {
    if (phone === '' || phone == null) {
      return true;
    }
    const regex = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$|(^(1[3-9])\d{9}$)/g;
    return regex.test(phone);
  }

  /**
   * 校验是否为有效手机号码
   * @param num 目标手机号码
   * @returns boolean
   */
  public static Telephone(telephone: string): boolean {
    if (telephone === '' || telephone === null) {
      return true;
    }
    const regex = /^(1[3-9])\d{9}$/g;
    return regex.test(telephone);
  }

  /**
   * 校验是否为有效帐号
   * @param htcode 目标帐号
   * @param min 长度最短多少
   * @param max 长度最长多少
   * @returns boolean
   */
  public static Account(account: string, min: number = 6, max: number = 20): boolean {
    const regex = new RegExp(`^[a-z0-9_]{${min},${max}}$`);
    return regex.test(account);
  }

  /**
   * 校验字符串长度是否符合要求
   * @param target 目标字符串
   * @param min 最短
   * @param max 最长
   * @returns boolean
   */
  public static Length(target: string, min: number, max: number): boolean {
    return (target == null || (target.length >= min && target.length <= max));
  }

  /**
   * 校验是否为有效车牌号
   * @param plate_number 目标车牌号
   * @returns boolean
   */
  public static PlateNumber(plate_number: string): boolean {
    if (plate_number === '' || plate_number == null) {
      return true;
    }
    const rule1 = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z](?![A-HJ-NP-Z]{5})[A-HJ-NP-Z\d]{5}$/;
    const rule2 = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z](?![A-HJ-NP-Z]{4})[A-HJ-NP-Z\d]{4}学$/;
    const rule3 = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z](?![A-HJ-NP-Z]{4})[A-HJ-NP-Z\d]{4}警$/;
    const rule4 = /^[A-Z]{2}(?![A-HJ-NP-Z]{5})[A-HJ-NP-Z\d]{5}$/;
    const rule5 = /^WJ[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}\d{4}[A-H_J-NP-Z\d]$/;
    const rule6 = /^粤[A-HJ-NP-Z\d][A-HJ-NP-Z\d]{4}港|澳$/;
    const rule7 = /^\d{6}使$/;
    const rule8 = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z](?![A-HJ-NP-Z]{4})[A-HJ-NP-Z\d]{4}领$/;
    const rule9 = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z](?![A-HJ-NP-Z]{4})[A-HJ-NP-Z\d]{4}挂$/;
    const rule10 = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z][D|F][A-HJ-NP-Z\d]\d{4}$/;
    const rule11 = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z]\d{5}[D|F]$/;

    const str = plate_number.toUpperCase();
    return rule1.test(str) || rule2.test(str) || rule3.test(str) || rule4.test(str)
      || rule5.test(str) || rule6.test(str) || rule7.test(str)
      || rule8.test(str) || rule9.test(str) || rule10.test(str) || rule11.test(str);
  }

  /**
   * 验证身份证是否正确
   * @param string id
   * @returns boolean
   */
  public static ID(id: string): boolean {
    if (id === '' || id === null || id.trim() === '') {
      return true;
    }
    const regex = /^([1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2})$/g;
    return regex.test(id);
  }

  /**
   * 验证密码格式是否正确
   * @param string password
   * @returns boolean
   */
  public static Password(password: string): boolean {
    if (password === '' || password === null || password.trim() === '') {
      return true;
    }
    const regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/g;
    return regex.test(password);
  }


  /**
   * 验证支持英文、数字和下划线,且不能为纯数字
   * @param string words
   * @returns boolean
   */
  public static NotAllNum(words: string): boolean {
    if (words === '' || words === null || words.trim() === '') {
      return true;
    }
    const regex = /^(?!\d+$)[a-zA-Z0-9-_]+$/g;
    return regex.test(words);
  }

  /**
   * 验证不能有空格
   * @param string words
   * @returns boolean
   */
  public static NoSpace(words: string): boolean {
    const regex = /^[^ ]{6,20}$/g;
    return regex.test(words);
  }

  /**
   * 验证只允许输入汉字，英文，数字
   * @param string words
   * @returns boolean
   */
  public static ChineseEnglishNum(words: string): boolean {

    const regex = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/g;
    return regex.test(words);
  }

  /**
   * 验证只支持支持汉字、英文和数字,且不能为纯数字
   * @param string words
   * @returns boolean
   */
  public static ChineseEnglishNumNotOnlyNum(words: string): boolean {

    const regex = /^(?!(\d+)$)[\u4e00-\u9fffa-zA-Z\d]+$/;
    // const regex = /^\d*([\u4e00-\u9fa5]|[a-zA-Z])+\d*$/;

    return regex.test(words);
  }

  /**
   * 校验是否为有效邮箱 (前缀、后缀不以'_'、'-'、'.'结尾，而且需要有@)
   * @param email 邮箱地址
   * @returns boolean
   */
  public static Email1(email: string): boolean {
    if (email == null || email === '') {
      return true;
    }
    const regex = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/;
    return regex.test(email);
  }

  /**
   * 校验是否(只支持数字，大小写字母和标点符号，不能有空格)
   * @param email 邮箱地址
   * @returns boolean
   */
  public static PasswordNew(pwd: string): boolean {
    if (pwd == null || pwd === '') {
      return true;
    }
    const regex = /^[0-9a-zA-Z_\-~!@#$%^&*()_+<>?:,./;’，。、‘：“《》？~！@#￥%……（）{}`=【】；'\[\]\\|]+$/;
    const value = regex.test(pwd);
    return value;
  }

  /**
   * 校验是否是空值
   * @param value 目标值
   * @returns boolean
   */
  public static IsEmptyValue(value: any): boolean {
    if (value === '' || value === undefined || value === null) {
      return true;
    }
    return false;
  }
}



