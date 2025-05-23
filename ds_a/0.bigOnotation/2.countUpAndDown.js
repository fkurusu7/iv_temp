function countUpAndDown(n) {
  console.log('Going Up!');
  for (let i = 0; i <= n; i++) {
    console.log(i);
  }
  console.log('At the top! \nGoing Down!');
  for (let j = n; j >= 0; j--) {
    console.log(j);
  }

  console.log('Back down, bye!');
}

console.log(countUpAndDown(10));
