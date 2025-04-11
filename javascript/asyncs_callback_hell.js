function task1(callbak) {
  setTimeout(() => {
    console.log("1. ubin");
    callbak();
  }, 1000);
}
function task2(callbak) {
  setTimeout(() => {
    console.log("2. e4rfg");
    callbak();
  }, 1000);
}
function task3(callbak) {
  setTimeout(() => {
    console.log("3. 345rtgf");
    callbak();
  }, 3000);
}
function task4(callbak) {
  setTimeout(() => {
    console.log("4. fg453");
    callbak();
  }, 1000);
}
function task5(callbak) {
  setTimeout(() => {
    console.log("5. sdfgf");
    callbak();
  }, 2000);
}
function task6(callbak) {
  setTimeout(() => {
    console.log("6. erfg");
    callbak();
  }, 500);
}

// CALLBACK HELL
task1(() => {
  task2(() => {
    task3(() => {
      task4(() => {
        task5(() => {
          task6(() => {});
        });
      });
    });
  });
});

/***************************************** */
const showMessage = (callback) => {
  console.log(callback);
};
const firstMessage = (callback) => {
  setTimeout(() => {
    showMessage("hello");
    callback();
  }, 2000);
};
const secondMessage = () => {
  showMessage("world!");
};

firstMessage(secondMessage); // => hello world!
firstMessage(secondMessage()); // => world! ERROR: callback is not a function
