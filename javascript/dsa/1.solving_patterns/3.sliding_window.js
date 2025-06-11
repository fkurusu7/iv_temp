/* Sliding Window

  It creates a window which can either be an array or number
  from one position to another.

  Depending on a certain condition, the window either increases
  or closes (and a new window is created).

  It's useful to keep track of a SUBSET of data in an 
  array/string etc.

*/

/* Examples:

  1. Write a function which accepts an array of integers
  and a number called n. The function should calculate 
  the maximum sum of n consecutive elements in the array.
*/

function maxSubarraySum(arr, num) {
  if (arr.length < num) return null;

  let tempSum = 0;
  let maxSum = 0;

  // iterate up to num to get first sum and set maxSum
  for (let i = 0; i < num; i++) {
    maxSum += arr[i];
  }
  tempSum = maxSum;

  // iterate over the following sections and apply sliding window technique
  for (let i = num; i < arr.length; i++) {
    tempSum = tempSum + arr[i] - arr[i - num];
    maxSum = Math.max(tempSum, maxSum);
  }

  // return result
  return maxSum;
}

console.log(maxSubarraySum([4, 7, 3, 8, 6, 1, 4, 5, 1, 9], 4)); // ==> 24
