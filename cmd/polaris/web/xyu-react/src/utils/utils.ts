
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {

  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

// export const getPageQuery = () => parse(window.location.href.split('?')[1]);

const utils = {
  /**
   * 工具 - 数组处理
   * 说明： 传入一个字符串数组，返回字符串数组的精简数组，剔除存在包含关系（父子级）的（父级）项
   *       比如["1.2.3","1.2","2.3"] 返回 ["1.2.3","2.3"]
   */
  arrSimple(arr: string[]){
    let tmp = Array.from(arr);
    for (let i = 0; i < arr.length; i++) {
      let value = arr[i]
      for (let j = 0; j < tmp.length; j++) {
        // 当前元素逐个比较，如果不是本元素，本元素是比较元素开头的
        if(value !== tmp[j] && tmp[j].startsWith(value)){
          value = tmp[j]
          // 如果本元素包含当前比较元素，则删除比较元素
        }else if(value !== tmp[j] && value.startsWith(tmp[j])){
          tmp.splice(j,1)
        }
      }
    }
    return tmp
  },

  /**
   * 工具 - decode
   * **/
  decode(str) {
    if (!str) {
      return str;
    }
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str;
    }
  },

  /**
   * 保留N位小数
   * 最终返回的是字符串
   * 若转换失败，返回参数原值
   * @param str - 数字或字符串
   * @param x   - 保留几位小数点
   */
  pointX(str: string | number, x = 0): string | number {
    if (!str && str !== 0) {
      return str;
    }
    const temp = Number(str);
    if (temp === 0) {
      return temp.toFixed(x);
    }
    return temp ? temp.toFixed(x) : str;
  },

  /**
   * 去掉字符串两端空格
   * @param str - 待处理的字符串
   */
  trim(str: string): string {
    const reg = /^\s*|\s*$/g;
    return str.replace(reg, "");
  },

  /**
   * 给字符串打马赛克
   * 如：将123456转换为1****6，最多将字符串中间6个字符变成*
   * 如果字符串长度小于等于2，将不会有效果
   * @param str - 待处理的字符串
   */
  addMosaic(str: string): string {
    const s = String(str);
    const lenth = s.length;
    const howmuch = ((): number => {
      if (s.length <= 2) {
        return 0;
      }
      const l = s.length - 2;
      if (l <= 6) {
        return l;
      }
      return 6;
    })();
    const start = Math.floor((lenth - howmuch) / 2);
    const ret = s.split("").map((v, i) => {
      if (i >= start && i < start + howmuch) {
        return "*";
      }
      return v;
    });
    return ret.join("");
  },
  /**
   * 获取随机数据
   * @param min
   * @param max
   */
  getRandomInt (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   *
   * @param {number} len 随机字符串的长度
   */
  randomString(len) {
    len = len || 32;
    let $chars =
        'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },

  /**
   * 每三个数字加逗号，位数刚好是 3 的倍数头部不会加逗号
   * @param {number & !0XXXX} num 需要格式化的数字,不能以 0 开头
   */

  toThousands(num) {
    let result = '';
    num = (num || 0).toString();
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return result;
  },
  /**
   * 验证字符串
   * 只能为字母、数字、下划线
   * 可以为空
   * @param str - 待处理的字符串
   * **/
  checkStr(str: string): boolean {
    if (str === "") {
      return true;
    }
    const rex = /^[_a-zA-Z0-9]+$/;
    return rex.test(str);
  },

  /**
   * 验证字符串
   * 只能为数字
   * 可以为空
   * @param str - 待处理的字符串
   * **/
  checkNumber(str: string): boolean {
    if (!str) {
      return true;
    }
    const rex = /^\d*$/;
    return rex.test(str);
  },

  /**
   * 正则 手机号验证
   * @param str - 待处理的字符串或数字
   * **/
  checkPhone(str: string | number): boolean {
    const rex = /^1[34578]\d{9}$/;
    return rex.test(String(str));
  },

  /**
   * 正则 邮箱验证
   * @param str - 待处理的字符串
   * **/
  checkEmail(str: string): boolean {
    const rex =
        /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
    return rex.test(str);
  },

  /**
   * 字符串加密
   * 简单的加密方法
   * @param code - 待处理的字符串
   */
  compile(code: string): string {
    let c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (let i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return c;
  },

  /**
   * 字符串解谜
   * 对应上面的字符串加密方法
   * @param code - 待处理的字符串
   */
  uncompile(code: string): string {
    let c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (let i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
  },

  /**
   * string 数组求并集
   */
  unionStrSet(s1: string[], s2: string[]){
    let union: string[] = s2
    s1.map((value)=>{
      if(s2.indexOf(value) === -1){
        value && union.push(value)
      }
    })
    return union
  },

  /**
   * 清除一个对象中那些属性为空值的属性
   * 0 算有效值
   * @param {Object} obj  待处理的对象
   * **/
  clearNull<T>(obj: T): T {
    const temp: any = { ...obj };
    for (const key in temp) {
      if (temp.hasOwnProperty(key)) {
        const value = temp[key];
        if (value === null || value === undefined) {
          delete temp[key];
        }
      }
    }
    return temp as T;
  },
};

export default utils;


