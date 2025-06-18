/* Multiple Pointers

  Creating pointers or values that correspond to an index or position and 
  move towards the beginning, end or middle based on a certain condition.
  - Minimal space complexity.

*/

/* 
Examples:
  
1.- Write a function called sumZero which accepts a sorted arrays of integers.
  Find the first pair where sum is 0. Return an array that includes both values
  that sum to zero or undefined if a pair does not exist.

*/

function sumZero(arrNum) {
  let left = 0;
  let right = arrNum.length - 1;

  while (left < right) {
    const sum = arrNum[right] + arrNum[left];
    if (sum === 0) {
      return [arrNum[left], arrNum[right]];
    } else if (sum > 0) {
      right -= 1;
    } else {
      left += 1;
    }
  }
}

console.log(sumZero([-3, -2, -1, 0, 1, 2, 3])); // [-3, 3]
console.log(sumZero([-4, -2, -1, 0, 1, 3, 5, 8, 9])); // [-1, 1]
console.log(sumZero([-12, -11, -10, -9, -4, -2, -1, 0, 1, 3, 5, 8, 9])); // [-9, 9]
console.log(sumZero([-2, -1, 0, 1, , 3])); // undefined
console.log(sumZero([1, 2, 3])); // undefined

/* 
  Implement a function which accepts a orted array, and counts the unique 
  values in the array.
  There can be negative numbers in the array, but it will always be sorted.
*/

function countUniqueValues(arr) {
  if (arr.length === 0) return 0;

  let left = 0;
  let right = 1;

  while (right < arr.length) {
    if (arr[left] === arr[right]) {
      right++;
    } else {
      left++;
      arr[left] = arr[right];
      right++;
    }
  }

  return left + 1;
}

console.log(countUniqueValues([1, 1, 1, 1, 1, 2])); // ==> 2
console.log(countUniqueValues([1, 2, 3, 4, 4, 4, 7, 7, 12, 12, 13])); // ==> 7
// console.log(countUniqueValues([])); // ==> 0
// console.log(countUniqueValues([-2, -1, -1, 0, 1])); // ==> 4

/* averagePair
  Given a sorted array of integers and a target average, determine if there is a pair
  of values in the array where the average of the pair equals the target average. 
  There may be more than one pair that matches the average target.

  Bonus Constraints:
    Time: O(N)
    Space: O(1)

  Examples:
    averagePair([1,2,3],2.5) // true
    averagePair([1,3,3,5,6,7,10,12,19],8) // true
    averagePair([-1,0,3,4,5,6], 4.1) // false
    averagePair([],4) // false

*/

function averagePair(nums, target) {
  if (nums.length === 0) return false;

  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const calcAver = (nums[left] + nums[right]) / 2;

    if (calcAver === target) {
      return true;
    } else if (calcAver > target) {
      right--;
    } else {
      left++;
    }
  }

  return false;
}

console.log(averagePair([1, 2, 3], 2.5)); // ==> true
console.log(averagePair([1, 3, 3, 5, 6, 7, 10, 12, 19], 8)); // ==> true
console.log(averagePair([-1, 0, 3, 4, 5, 6], 4.1)); // ==> false
console.log(averagePair([], 4)); // ==> false

/* isSubsequence
  Given two strings, check whether the characters in the first string form a 
  subsequence of the characters in the second string. 
  In other words, the function should check whether the characters in the first 
  string appear somewhere in the second string, without their order changing.

  Examples:
    isSubsequence('hello', 'hello world'); // true
    isSubsequence('sing', 'sting'); // true
    isSubsequence('abc', 'abracadabra'); // true
    isSubsequence('abc', 'acb'); // false (order matters)
  
  Complexities:
    Time Complexity - O(N + M)
    Space Complexity - O(1)
*/

function isSubsequence(subSeq, sequence) {
  let subIndex = 0;
  let seqIndex = 0;

  while (seqIndex <= sequence.length) {
    if (subSeq[subIndex] === sequence[seqIndex]) subIndex++;
    if (subIndex === subSeq.length) return true;
    seqIndex++;
  }

  return false;
}

console.log(isSubsequence('hello', 'hello world')); // ==> true
console.log(isSubsequence('sing', 'sting')); // ==> true
console.log(isSubsequence('abc', 'abracadabra')); // ==> true
console.log(isSubsequence('abc', 'acb')); // ==> false (order matters)

/* findPair
  Given an unsorted array and a number n, find if there exists a pair of elements 
  in the array whose difference is n. 
  This function should return true if the pair exists or false if it does not.

  Examples:
    findPair([6,1,4,10,2,4], 2) // true
    findPair([8,6,2,4,1,0,2,5,13],1) // true
    findPair([4,-2,3,10],-6) // true
    findPair([6,1,4,10,2,4], 22) // false
    findPair([], 0) // false
    findPair([5,5], 0) // true
    findPair([-4,4], -8) // true
    findPair([-4,4], 8) // true
    findPair([1,3,4,6],-2) // true
    findPair([0,1,3,4,6],-2) // true
    findPair([1,2,3], 0) // false
  
  Part 1 - solve this with the following requirements:
    - Time Complexity Requirement - O(n)
    - Space Complexity Requirement - O(n)

  Part 2 - solve this with the following requirements:
    - Time Complexity Requirement - O(n log n)
    - Space Complexity Requirement - O(1)
*/

function findPair(arr, target) {
  if (!arr.length) return false;

  arr.sort((a, b) => a - b);
  let i = 0;
  let j = 1;

  while (i < arr.length && j < arr.length) {
    if (i !== j && Math.abs(arr[i] - arr[j]) === Math.abs(target)) {
      return true;
    } else if (arr[j] - arr[i] < target) {
      j++;
    } else {
      i++;
    }
  }

  return false;
}

console.log(findPair([6, 1, 4, 10, 2, 4], 2)); // ==> true
console.log(findPair([8, 6, 2, 4, 1, 0, 2, 5, 13], 1)); // ==> true
console.log(findPair([4, -2, 3, 10], -6)); // ==> true
console.log(findPair([6, 1, 4, 10, 2, 4], 22)); // ==> false
console.log(findPair([], 0)); // ==> false
console.log(findPair([5, 5], 0)); // ==> true
console.log(findPair([-4, 4], -8)); // ==> true
console.log(findPair([-4, 4], 8)); // ==> true
console.log(findPair([1, 3, 4, 6], -2)); // ==> true
console.log(findPair([0, 1, 3, 4, 6], -2)); // ==> true
console.log(findPair([1, 2, 3], 0)); // ==> false
