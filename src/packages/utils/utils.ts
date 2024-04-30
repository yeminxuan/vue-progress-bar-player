/*
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2024-03-29 13:16:24
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-04-30 17:09:53
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
const splitFunMethods = (
  data: any,
  interval: string,
  field: string,
  inRangeColor: string,
  outRangeColor: string
) => {
  let result: any = [];
  const singleResult: any = [];
  let currentArray: any = [];
  const startInterval = interval.split(",")[0];
  const endInterval = interval.split(",")[1];
  const start_matches = /[\[|\(]/.exec(startInterval);
  const end_matches = /[\)|\]]/.exec(endInterval);
  /* Error feedback start */
  if (start_matches == null || end_matches == null)
    throw Error("Please use `[]` or `()` to include the interval you set");
  if (
    !isNumeric(startInterval.split(start_matches[0])[1]) ||
    !isNumeric(endInterval.split(end_matches[0])[0])
  )
    throw Error(`Invalid comparison interval => ${interval}`);

  const newInterval = [
    start_matches[0],
    isNumeric(startInterval.split(start_matches[0])[1])
      ? Number(startInterval.split(start_matches[0])[1])
      : startInterval.split(start_matches[0])[1],
    isNumeric(endInterval.split(end_matches[0])[0])
      ? Number(endInterval.split(end_matches[0])[0])
      : endInterval.split(end_matches[0])[0],
    end_matches[0],
  ];
  for (let i = 0; i < data.length; i++) {
    currentArray.push({ ...data[i], dataIndex: i });
    /* when the loop reaches the last element */
    if (i == data.length - 1) {
      if (
        newInterval[3] == "]"
          ? data[i][field] > newInterval[2]
          : data[i][field] >= newInterval[2]
      ) {
        currentArray.map((item: any) => {
          item.color = outRangeColor;
          return item;
        });
        result.push(currentArray);
        currentArray = [];
      } else if (
        newInterval[0] == "["
          ? data[i][field] < newInterval[1]
          : data[i][field] <= newInterval[1]
      ) {
        currentArray.map((item: any) => {
          item.color = outRangeColor;
          return item;
        });
        result.push(currentArray);
        currentArray = [];
      } else if (
        newInterval[0] == "["
          ? data[i][field] >= newInterval[1]
          : data[i][field] > newInterval[1] && newInterval[3] == "]"
            ? data[i][field] <= newInterval[2]
            : data[i][field] < newInterval[2]
      ) {
        currentArray.map((item: any) => {
          inRangeColor;
          return item;
        });
        result.push(currentArray);
        currentArray = [];
      }
      break;
    }

    /* Compare the previous number to determine the interval */
    // If the next number is greater than the max interval and the current number in the interval
    if (
      i > 0 &&
      (newInterval[0] == "["
        ? data[i][field] >= newInterval[1]
        : data[i][field] > newInterval[1]) &&
      (newInterval[3] == "]"
        ? data[i][field] <= newInterval[2]
        : data[i][field] < newInterval[2]) &&
      (newInterval[3] == "]"
        ? data[i + 1][field] > newInterval[2]
        : data[i + 1][field] >= newInterval[2])
    ) {
      currentArray.map((item: any) => {
        item.color = inRangeColor;
        return item;
      });
      result.push(currentArray);
      currentArray = [];
    } else if (
      //If current number is greater than the max interval, and the new number is in the interval
      i > 0 &&
      (newInterval[3] == "]"
        ? data[i][field] > newInterval[2]
        : data[i][field] >= newInterval[2]) &&
      (newInterval[0] == "["
        ? data[i + 1][field] >= newInterval[1]
        : data[i + 1][field] > newInterval[1]) &&
      (newInterval[3] == "]"
        ? data[i + 1][field] <= newInterval[2]
        : data[i + 1][field] < newInterval[2])
    ) {
      currentArray.map((item: any) => {
        item.color = outRangeColor;
        return item;
      });
      result.push(currentArray);
      currentArray = [];
    } else if (
      //If current number is in the interval and the new number is less than the min interval
      i > 0 &&
      (newInterval[0] == "["
        ? data[i][field] >= newInterval[1]
        : data[i][field] > newInterval[1]) &&
      (newInterval[3] == "]"
        ? data[i][field] <= newInterval[2]
        : data[i][field] < newInterval[2]) &&
      (newInterval[0] == "["
        ? data[i + 1][field] < newInterval[1]
        : data[i + 1][field] <= newInterval[1])
    ) {
      currentArray.map((item: any) => {
        item.color = inRangeColor;
        return item;
      });
      result.push(currentArray);
      currentArray = [];
    } else if (
      //If current number is less than the min interval and the new number is in the interval
      i > 0 &&
      (newInterval[0] == "["
        ? data[i + 1][field] >= newInterval[1]
        : data[i + 1][field] > newInterval[1]) &&
      (newInterval[3] == "]"
        ? data[i + 1][field] <= newInterval[2]
        : data[i + 1][field] < newInterval[2]) &&
      (newInterval[0] == "["
        ? data[i][field] < newInterval[1]
        : data[i][field] <= newInterval[1])
    ) {
      currentArray.map((item: any) => {
        item.color = outRangeColor;
        return item;
      });
      result.push(currentArray);
      currentArray = [];
    } else if (
      //If current number is greater than the max interval and the next number is less than the min interval
      i > 0 &&
      (newInterval[3] == "]"
        ? data[i][field] > newInterval[2]
        : data[i][field] >= newInterval[2]) &&
      (newInterval[0] == "["
        ? data[i + 1][field] < newInterval[1]
        : data[i + 1][field] <= newInterval[1])
    ) {
      currentArray.map((item: any) => {
        item.color = outRangeColor;
        return item;
      });
      result.push(currentArray);
      currentArray = [];
    } else if (
      //If the current number is greater than the max interval and the next number is less than the the min interval.
      i > 0 &&
      (newInterval[3] == "]"
        ? data[i + 1][field] > newInterval[2]
        : data[i + 1][field] >= newInterval[2]) &&
      (newInterval[0] == "["
        ? data[i][field] < newInterval[1]
        : data[i][field] <= newInterval[1])
    ) {
      currentArray.map((item: any) => {
        item.color = outRangeColor;
        return item;
      });
      result.push(currentArray);
      currentArray = [];
    } else if (
      // If current number is less than the min interval, and next number is less than the min interval too
      i > 0 &&
      (newInterval[0] == "["
        ? data[i + 1][field] < newInterval[1]
        : data[i + 1][field] <= newInterval[1]) &&
      (newInterval[0] == "["
        ? data[i][field] < newInterval[1]
        : data[i][field] <= newInterval[1])
    ) {
      currentArray.map((item: any) => {
        item.color = outRangeColor;
        return item;
      });
      singleResult.push(...currentArray);
    } else if (
      // If current number is greater than the max interval, and next number is greater than the max interval too
      i > 0 &&
      (newInterval[3] == "]"
        ? data[i + 1][field] > newInterval[2]
        : data[i + 1][field] >= newInterval[2]) &&
      (newInterval[3] == "]"
        ? data[i][field] > newInterval[2]
        : data[i][field] >= newInterval[2])
    ) {
      currentArray.map((item: any) => {
        item.color = outRangeColor;
        return item;
      });
      singleResult.push(...currentArray);
    } else if (
      i > 0 &&
      (newInterval[0] == "["
        ? data[i + 1][field] >= newInterval[1]
        : data[i + 1][field] > newInterval[1]) &&
      (newInterval[3] == "]"
        ? data[i + 1][field] <= newInterval[2]
        : data[i + 1][field] < newInterval[2]) &&
      (newInterval[0] == "["
        ? data[i][field] >= newInterval[1]
        : data[i][field] > newInterval[1]) &&
      (newInterval[3] == "]"
        ? data[i][field] <= newInterval[2]
        : data[i][field] < newInterval[2])
    ) {
      currentArray.map((item: any) => {
        item.color = inRangeColor;
        return item;
      });
      singleResult.push(...currentArray);
    }
  }
  if (singleResult.length == data.length) {
    result = singleResult;
  } else {
    result = result;
  }
  return result;
};
export { isNumeric, splitFunMethods };
