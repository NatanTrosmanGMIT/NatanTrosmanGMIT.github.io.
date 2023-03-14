export const asyncForEach = async (arr, callback) => {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    await callback(arr[i], i, arr);
  }
};
