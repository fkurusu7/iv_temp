const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise 1");
  }, 2000);
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise 2");
  }, 1500);
});

Promise.all([promise1, promise2])
  .then((data) => {
    console.log(data[0], data[1]);
  })
  .catch((error) => console.log(error));
