/* Frequency (aka fq) Counters
  This pattern uses objects or sets to collect values/fqs of values.
  It avoid the need for nested loops or O(n^2) operations with arrays/strings.

  Examples:
*/

/* 1.- 
  Write a function called SAME, which accepts two arrays. the function should
  return true if every value in the array has it's corresponding value squared
  in the second array. The fq of values must be the same.
*/

function same(arrNum, arrNumSq) {
  // check lengths, must be same in both arrays
  if (arrNum.length !== arrNumSq.length) return false;

  let freqCounter1 = {};
  let freqCounter2 = {};

  for (const val of arrNum) {
    freqCounter1[val] = (freqCounter1[val] || 0) + 1;
  }
  for (const val of arrNumSq) {
    freqCounter2[val] = (freqCounter2[val] || 0) + 1;
  }

  console.log(freqCounter1, freqCounter2);

  for (let key in freqCounter1) {
    if (!(key ** 2 in freqCounter2)) return false;

    if (freqCounter2[key ** 2] !== freqCounter1[key]) {
      return false;
    }
  }
  return true;
}

// console.log(same([1, 2, 3], [4, 1, 9])); // => true
// console.log(same([1, 2, 3, 2], [4, 1, 9, 4])); // => true
// console.log(same([1, 2, 3], [1, 9])); // => false
// console.log(same([1, 2, 1], [4, 4, 1])); // => false - must be same fq

/* 2.- 
  Given two strings, write a function to determine if the second string is an anagram
  of the first. i.e. 'cinema', formed from 'iceman'.
*/

function validAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;

  const freqCounter1 = {};
  const freqCounter2 = {};

  for (const val of str1) {
    freqCounter1[val] = (freqCounter1[val] || 0) + 1;
  }
  for (const val of str2) {
    freqCounter2[val] = (freqCounter2[val] || 0) + 1;
  }

  // console.log(freqCounter1);
  // console.log(freqCounter2);

  for (const key in freqCounter1) {
    if (freqCounter2[key] !== freqCounter1[key]) return false;
  }

  return true;
}

// console.log(validAnagram('', '')); // ==> true
// console.log(validAnagram('aaz', 'zza')); // ==> false
// console.log(validAnagram('anagram', 'nagaram')); // ==> true
// console.log(validAnagram('rat', 'car')); // ==> false
// console.log(validAnagram('awesome', 'awesom')); // ==> false
// console.log(validAnagram('qwerty', 'qewrty')); // ==> true
// console.log(validAnagram('texttwisttime', 'timetwisttext')); // ==> true

function validAnagramV2(str1, str2) {
  if (str1.length !== str2.length) return false;

  const lookup = {};

  for (const val of str1) {
    lookup[val] = (lookup[val] || 0) + 1;
  }

  // console.log(lookup);
  // { a: 3, n: 1, g: 1, r: 1, m: 1 }

  for (const key of str2) {
    if (!lookup[key]) return false;
    else lookup[key] -= 1;
  }

  return true;
}

console.assert(validAnagramV2('', '') === true, 'Failed'); // ==> true
console.assert(validAnagramV2('aaz', 'zza') === false, 'Failed'); // ==> false
console.assert(validAnagramV2('anagram', 'nagaram') === true, 'Failed'); // ==> true
console.assert(validAnagramV2('rat', 'car') === false, 'Failed'); // ==> false
console.assert(validAnagramV2('awesome', 'awesom') === false, 'Failed'); // ==> false
console.assert(validAnagramV2('qwerty', 'qewrty') === true, 'Failed'); // ==> true
console.assert(
  validAnagramV2('texttwisttime', 'timetwisttext') === true,
  'Failed'
); // ==> true

/* 
  Given two positive integers, find out if the two numbers have the same frequency of digits.
  Your solution MUST have the following complexities:
  Time: O(N)
  Sample Input:
    sameFrequency(182,281) // true
    sameFrequency(34,14) // false
    sameFrequency(3589578, 5879385) // true
    sameFrequency(22,222) // false
 */

function sameFrequency(num1, num2) {
  const numToStr1 = num1.toString();
  const numToStr2 = num2.toString();

  if (numToStr1.length !== numToStr2.length) {
    return false;
  }

  const lookup = {};

  for (const n of numToStr1) {
    lookup[n] = (lookup[n] || 0) + 1;
  }

  for (const n of numToStr2) {
    if (!lookup[n]) return false;
    else lookup[n]--;
  }

  return true;
}

console.log(sameFrequency(182, 281)); // ==> true
console.log(sameFrequency(34, 14)); // ==> false
console.log(sameFrequency(3589578, 5879385)); // ==> true
console.log(sameFrequency(22, 222)); // ==> false

/*  areThereDuplicates
  Given a variable number of arguments, checks whether there are any duplicates among
  the arguments passed in.  
  ✅ This can be solved using the frequency counter pattern OR the multiple pointers pattern.
  
  Sample input:
    areThereDuplicates(1, 2, 3) // false
    areThereDuplicates(1, 2, 2) // true 
    areThereDuplicates('a', 'b', 'c', 'a') // true 
  
  Restrictions:
    Time - O(n) 
    Space - O(n)
  Bonus:
    Time - O(n log n)
    Space - O(1) 
*/

function areThereDuplicates(...values) {
  const freqCounter = {};
  for (const v of values) {
    freqCounter[v] = (freqCounter[v] || 0) + 1;
  }
  console.log(freqCounter);

  for (const key in freqCounter) {
    if (freqCounter[key] > 1) return true;
  }

  return false;
}

console.log(areThereDuplicates(1, 2, 3)); // ==> false
console.log(areThereDuplicates(1, 2, 2)); // ==> true
console.log(areThereDuplicates('a', 'b', 'c', 'a')); // ==> true

/* constructNote
Write a function called constructNote, which accepts two strings, a message and some letters. 
The function should return true if the message can be built with the letters that you are given, 
or it should return false.

Assume that there are only lowercase letters and no space or special characters in both 
the message and the letters.

Bonus Constraints:
  If M is the length of message and N is the length of letters:
    Time Complexity: O(M+N)
    Space Complexity: O(N)

Examples:
  constructNote('aa', 'abc') // false
  constructNote('abc', 'dcba') // true
  constructNote('aabbcca', 'bcabcaddff') // true 

  { a: 0, b: 0, c: 0, d: 2, f: 2 }
*/

function constructNote(message, letters) {
  if (message.length > letters.length) return false;

  const lookup = {};

  for (const key of letters) {
    lookup[key] = (lookup[key] || 0) + 1;
  }
  // { a: 1, b: 1, c: 1 }

  for (const key of message) {
    if (!lookup[key]) {
      return false;
    } else {
      lookup[key] -= 1;
    }
  }

  return true;
}

console.log(constructNote('aaqpwprms', 'abc')); // ==> false
console.log(constructNote('aa', 'abc')); // ==> false
console.log(constructNote('abc', 'dcba')); // ==> true
console.log(constructNote('aabbcc', 'bcabcaddff')); // ==> true

/* findAllDuplicates
  Given an array of positive integers, some elements appear twice and others appear once. 
  Find all the elements that appear twice in this array.
  Note that you can return the elements in any order.
    Time Complexity - O(n)
    BONUS: Space Complexity - O(1)

  Examples
    findAllDuplicates([4,3,2,7,8,2,3,1]) // [2, 3] 
    findAllDuplicates([4, 3, 2, 1, 0]) // []
    findAllDuplicates([4, 3, 2, 1, 0, 1, 2, 3]) // [3,2,1] 
*/
function findAllDuplicates(arr) {
  const result = [];
  if (arr.length === 0) return result;

  const lookup = {};

  for (const key of arr) {
    console.log(typeof key);
    lookup[key] = (lookup[key] || 0) + 1;
  }

  for (const key in lookup) {
    if (lookup[key] === 2) result.push(+key);
  }

  return result;
}

console.log(findAllDuplicates([4, 3, 2, 7, 8, 2, 3, 1])); // [2, 3]
console.log(findAllDuplicates([4, 3, 2, 1, 0])); // []
console.log(findAllDuplicates([4, 3, 2, 1, 0, 1, 2, 3])); // [3,2,1]
