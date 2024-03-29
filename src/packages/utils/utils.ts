/*
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-29 13:16:24
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-29 13:16:41
 * @FilePath: /vue3-process-bar-player/src/packages/utils/utils.ts
 * @Description:
 */
const isNumeric = (str: string): boolean => {
  /**
   * @Description: Checks whether the passed string can be converted to a finite floating point number
   * @param {string} str
   * @return {boolen} no => false true => yes
   */
  return !isNaN(parseFloat(str)) && isFinite(parseFloat(str));
};
export { isNumeric };
