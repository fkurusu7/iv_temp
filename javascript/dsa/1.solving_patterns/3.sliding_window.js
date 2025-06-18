/* Sliding Window

  It creates a window which can either be an array or number
  from one position to another.

  Depending on a certain condition, the window either increases
  or closes (and a new window is created).

  It's useful to keep track of a SUBSET of data in an 
  array/string etc.

*/

/* maxSubarraySum
  Given an array of integers and a number, write a function called maxSubarraySum, 
  which finds the maximum sum of a subarray with the length of the number passed to the function.

  Note that a subarray must consist of consecutive elements from the original array. In the first example below, [100, 200, 300] is a subarray of the original array, but [100, 300] is not.

  maxSubarraySum([100,200,300,400], 2) // 700
  maxSubarraySum([1,4,2,10,23,3,1,0,20], 4)  // 39 
  maxSubarraySum([-3,4,0,-2,6,-1], 2) // 5
  maxSubarraySum([3,-2,7,-4,1,-1,4,-2,1],2) // 5
  maxSubarraySum([2,3], 3) // null
  
  Constraints:
    Time Complexity - O(N)
    Space Complexity - O(1)
*/

function maxSubarraySum(numbers, consecutive) {
  if (!numbers.length || numbers.length < consecutive) return null;

  let maxSum = 0;
  let tempSum = 0;

  // Calculate the first maxSum and tempSum
  for (let i = 0; i < consecutive; i++) {
    maxSum += numbers[i];
  }

  tempSum = maxSum;

  // Apply sliding window
  for (let i = consecutive; i < numbers.length; i++) {
    tempSum += numbers[i] - numbers[i - consecutive];
    maxSum = Math.max(maxSum, tempSum);
  }

  // return maxSum
  return maxSum;
}

console.log(maxSubarraySum([100, 200, 300, 400], 2)); // ==> 700
console.log(maxSubarraySum([1, 4, 2, 10, 23, 3, 1, 0, 20], 4)); // ==> 39
console.log(maxSubarraySum([-3, 4, 0, -2, 6, -1], 2)); // ==> 5
console.log(maxSubarraySum([3, -2, 7, -4, 1, -1, 4, -2, 1], 2)); // ==> 5
console.log(maxSubarraySum([2, 3], 3)); // ==> null
console.log(maxSubarraySum([], 3)); // ==> null

/* minSubArrayLen
  Given an array of positive integers and a positive integer, Write a function that 
  returns the minimal length of a contiguous (consecutive) subarray of which the sum
  is greater than or equal to the integer passed to the function. 
  If there isn't one, return 0 instead.

  Examples:
    minSubArrayLen([2,3,1,2,4,3], 7) // 2 -> because [4,3] is the smallest subarray
    minSubArrayLen([2,1,6,5,4], 9) // 2 -> because [5,4] is the smallest subarray
    minSubArrayLen([3,1,7,11,2,9,8,21,62,33,19], 52) // 1 -> because [62] is greater than 52
    minSubArrayLen([1,4,16,22,5,7,8,9,10],39) // 3
    minSubArrayLen([1,4,16,22,5,7,8,9,10],55) // 5
    minSubArrayLen([4, 3, 3, 8, 1, 2, 3], 11) // 2
    minSubArrayLen([1,4,16,22,5,7,8,9,10],95) // 0
  
  Requirements:
    Time Complexity - O(n)
    Space Complexity - O(1)
*/

function minSubArrayLen(numbers, target) {
  let total = 0,
    start = 0,
    end = 0,
    minLength = Infinity;

  while (start < numbers.length) {
    // calculate total while total is less than target
    if (total < target && end < numbers.length) {
      total += numbers[end];
      end++;
    }
    // if total >= target calculate minLength
    else if (total >= target) {
      minLength = Math.min(minLength, end - start);
      total -= numbers[start];
      start++;
    }
    // break loop to avoid infinite loop
    else {
      break;
    }
  }

  return minLength === Infinity ? 0 : minLength;
}
/* 
5551694300
5 - 1 - 2 Servios de poliza 
  */
console.log(minSubArrayLen([2, 3, 1, 2, 4, 3], 7)); // ==> 2 -> because [4,3] is the smallest subarray
console.log(minSubArrayLen([2, 1, 6, 5, 4], 9)); // ==> 2 -> because [5,4] is the smallest subarray
console.log(minSubArrayLen([3, 1, 7, 11, 2, 9, 8, 21, 62, 33, 19], 52)); // ==> 1 -> because [62] is greater than 52
console.log(minSubArrayLen([1, 4, 16, 22, 5, 7, 8, 9, 10], 39)); // ==> 3
console.log(minSubArrayLen([1, 4, 16, 22, 5, 7, 8, 9, 10], 55)); // ==> 5
console.log(minSubArrayLen([4, 3, 3, 8, 1, 2, 3], 11)); // ==> 2
console.log(minSubArrayLen([1, 4, 16, 22, 5, 7, 8, 9, 10], 95)); // ==> 0
