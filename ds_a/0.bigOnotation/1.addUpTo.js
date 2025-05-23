function getPerformance(t1, t2) {
  return `Time Elapsed: ${(t2 - t1) / 1000} seconds.`;
}

/* 
  Write a function that calculates the sum of 
  all numbers from 1 up to (and including) some
  number n.
*/

function addUpToFor(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}

let t1For = performance.now();
console.log(`addUpToFor 1000000: ${addUpToFor(1000000)}`);
let t2For = performance.now();
console.log(getPerformance(t1For, t2For));

function addUpToMath(n) {
  return (n * (n + 1)) / 2;
}

let t1Math = performance.now();
console.log(`addUpToMath 1000000: ${addUpToMath(1000000)}`);
let t2Math = performance.now();
console.log(getPerformance(t1Math, t2Math));
