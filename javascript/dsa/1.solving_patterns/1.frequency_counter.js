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
