/**
 * Created by zack on 5/7/19.
 */

/*
* 数据对象基类 v1.1.0
* 版本变更:
* v1.0.0: ...
* v1.1.0: 新增二级对象解析可排序
* 使用说明:
*   1.子类的属性必须赋值(undefined)
*   2.属性中的对象需要使用getPropertyClass方法指定类型
*   3.强规范下所有字段都依靠初始化的赋值定义，否则获取不到数据，请认真对应接口。
*   4.目前无法结构化二维以上数组中的对象 如: Array<Array<object>>
* */

export abstract class EntityBase {

  /**
   * 创建实例
   * @param json json对象
   * @returns any 实例对象
   */
  public static Create(json: any): any {
    const constructor: any = this;
    const entity: EntityBase = new constructor();
    entity.parseEntity(entity, json, false);
    return entity;
  }

  /**
   * 克隆当前实例对象
   * @returns any 新的实例对象
   */
  public clone(): any {
    const constructor: any = this.constructor;
    const entity: EntityBase = new constructor();
    entity.parseEntity(entity, this, true);
    return entity;
  }

  /**
   * 将实例对象转换成json对象
   * @returns any json对象
   */
  public json(): any {
    const json = {};
    this.parseJson(json, this);
    return json;
  }

  /**
   * 获取引用对象对应的类型
   * @param propertyName 属性名
   * @returns null 返回的类型必须继承自ZCoreBase
   */
  public getPropertyClass(propertyName: string): typeof EntityBase {
    return null;
  }

  /**
   * 获取需要推迟解析的属性列表
   * @returns Array<string> 有序属性列表
   */
  public getDelayParseProperties(): Array<string> {
    return [];
  }

  /**
   * 将数据解析成实例对象
   * @param EntityBase target 目标实例对象
   * @param json json对象
   */
  private parseEntity(target: EntityBase, json: any, isClone: boolean) {

    // 延迟解析列表，二级属性列表
    const delayParseProperties = this.getDelayParseProperties();
    let secondLevelProperties: Array<string> = [];

    // 第一轮基础属性赋值
    for (const propertyName in target) {

      if ((isClone && noCloneDictionary[target.generateKey(propertyName)]) ||
        (!isClone && noCreateDictionary[target.generateKey(propertyName)])) {
        // 跳过不clone与create属性
        continue;
      }

      const propertyValue = json[propertyName];
      if (propertyValue !== null && propertyValue !== undefined) {
        if (typeof propertyValue === 'string'
          || typeof propertyValue === 'number'
          || typeof propertyValue === 'boolean') {
          // 基础类型直接赋值
          target[propertyName] = propertyValue;
        } else {
          // 对象类型第二轮进行赋值(为了处理复杂数据结构)
          if (delayParseProperties.findIndex(property => property === propertyName) < 0) {
            secondLevelProperties.push(propertyName);
          }
        }
      } else {
        // 数据中没有相关字段的数据则跳过
      }
    }

    // 重新拼接有序数组
    secondLevelProperties = secondLevelProperties.concat(delayParseProperties);

    // 第二轮赋值
    secondLevelProperties.forEach(propertyName => {
      if ((isClone && noCloneDictionary[target.generateKey(propertyName)]) ||
        (!isClone && noCreateDictionary[target.generateKey(propertyName)])) {
        // 跳过不clone与create属性
        return;
      }

      const propertyValue = json[propertyName];
      if (propertyValue !== null && propertyValue !== undefined) {
        if (Object.prototype.toString.call(propertyValue) === '[object Array]') {
          // 数据为数组对象
          target[propertyName] = [];
          const classConstructor = target.getPropertyClass(propertyName);
          if (classConstructor === null || classConstructor === undefined) {
            // 单一对象需要重写类名方法让基类识别,才能保持结构化一致
            propertyValue.forEach(value => {
              if (typeof value === 'string'
                || typeof value === 'number'
                || typeof value === 'boolean') {
                target[propertyName].push(value);
              } else if (Object.prototype.toString.call(value) === '[object Array]') {
                const cloneValue = JSON.parse(JSON.stringify(value));
                target[propertyName].push(cloneValue);
              } else if (Object.prototype.toString.call(propertyValue) === '[object Object]') {
                console.warn('You need override getPropertyClass to make your code more structured. by zack');
                const cloneValue = JSON.parse(JSON.stringify(value));
                target[propertyName].push(cloneValue);
              }
            });
          } else {
            propertyValue.forEach(value => {
              target[propertyName].push(classConstructor.Create(value));
            });
          }
        } else if (Object.prototype.toString.call(propertyValue) === '[object Object]') {
          // 数据为对象
          const classConstructor = target.getPropertyClass(propertyName);
          if (classConstructor === null || classConstructor === undefined) {
            // 单一对象需要重写类名方法让基类识别,才能保持结构化一致
            console.warn(`You need override getPropertyClass(${propertyName}) to make your code more structured. by zack`);
            const cloneValue = JSON.parse(JSON.stringify(propertyValue));
            target[propertyName] = cloneValue;
          } else {
            target[propertyName] = classConstructor.Create(propertyValue);
          }
        } else {
          // 数据中没有相关字段的数据则跳过
        }
      }
    });
  }

  /**
   * 将数据解析成json对象
   * @param target 目标json对象
   * @param EntityBase entity 实例对象
   */
  private parseJson(target: any, entity: EntityBase) {
    for (const propertyName in entity) {
      if (noJsonDictionary[entity.generateKey(propertyName)]) {
        // 跳过不json属性
        continue;
      }

      const propertyValue = entity[propertyName];
      if (!(propertyValue === null || propertyValue === undefined)) {
        if (typeof propertyValue === 'string'
          || typeof propertyValue === 'number'
          || typeof propertyValue === 'boolean') {
          // 基础类型直接赋值
          target[propertyName] = propertyValue;
        } else if (Object.prototype.toString.call(propertyValue) === '[object Array]') {
          // 数据为数组对象
          target[propertyName] = [];
          propertyValue.forEach(value => {
            if (value instanceof EntityBase) {
              target[propertyName].push(value.json());
            } else if (typeof value === 'string'
              || typeof value === 'number'
              || typeof value === 'boolean') {
              target[propertyName].push(value);
            } else if (Object.prototype.toString.call(value) === '[object Array]') {
              const cloneValue = JSON.parse(JSON.stringify(value));
              target[propertyName].push(cloneValue);
            } else if (Object.prototype.toString.call(propertyValue) === '[object Object]') {
              console.warn('You need override getPropertyClass to make your code more structured. by zack');
              const cloneValue = JSON.parse(JSON.stringify(value));
              target[propertyName].push(cloneValue);
            }
          });
        } else if (Object.prototype.toString.call(propertyValue) === '[object Object]') {
          // 数据为对象
          if (propertyValue instanceof EntityBase) {
            target[propertyName] = propertyValue.json();
          } else {
            console.warn('You need override getPropertyClass to make your code more structured. by zack');
            target[propertyName].push(propertyValue);
          }
        } else {
          // 非基础属性则跳过
        }
      }
    }
  }

  /**
   * 获取装饰器对应的键值
   * @param string propertyName 属性名称
   * @returns string 约定的装饰器键值
   */
  private generateKey(propertyName: string): string {
    return this.constructor.name + '-' + propertyName;
  }
}

/****** 装饰器 ******/
/*
 使用说明:
    1.因为属性装饰器不可以使用属性描述符,所以需要另寻他法，现在想到的一种方案是使用这种全局贯穿的方式来达到修饰效果
      附文档位置:https://www.tslang.cn/docs/handbook/decorators.html
    2.这套修饰符体系要求整个项目中不可以出现使用"相同名字的类并且使用修饰符"的情况发生,否则会造成全局变量运行错误。
    3.目前提供三种修饰符对应三种数据转换。
    noCreate 对应 Create 方法，目的是用来略过不想使用解析的属性。
    noJson 对应 json 方法, 目的是用来略过不想转换成json的属性。
    noClone 对应 clone 方法, 目的是用来略过不想clone到新对象的属性。
    4.修饰符可以对同一属性叠加使用。
    5.只读属性或get访问器不能进行Create与Clone操作,需要使用noCreate和noClone进行修饰。
 */

const noCreateDictionary = {};

export function noCreate(target: any, propertyKey: string) {
  noCreateDictionary[target.constructor.name + '-' + propertyKey] = true;
}

const noJsonDictionary = {};

export function noJson(target: any, propertyKey: string) {
  noJsonDictionary[target.constructor.name + '-' + propertyKey] = true;
}

const noCloneDictionary = {};

export function noClone(target: any, propertyKey: string) {
  noCloneDictionary[target.constructor.name + '-' + propertyKey] = true;
}
