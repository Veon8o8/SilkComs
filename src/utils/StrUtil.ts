// src/utils/StrUtil.ts

class StrUtil {

  /** 字符串首字母大写
   * @param input 
   * @returns 
   */
  capitalizeFirstLetter(input: string) {
    return `${input.charAt(0).toUpperCase()}${input.slice(1)}`;
  }
}

export const strUtil = new StrUtil