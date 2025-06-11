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
