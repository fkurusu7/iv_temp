/* const preHeatOven = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const preHO = true;

      if (preHO) {
        resolve("Preheat oven to 180deg");
      } else {
        reject("Failed to preheat");
      }
    }, 2000);
  });
};
const addSugar = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const addS = true;

      if (addS) {
        resolve("Adding sugar");
      } else {
        reject("Failed to sugar it");
      }
    }, 1000);
  });
};
const addFlour = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const flour = true;

      if (false) {
        resolve("Flour added gracefully");
      } else {
        reject("Failed to add flour");
      }
    }, 3000);
  });
};

const bakeMixture = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const baking = true;

      if (baking) {
        resolve("Baking baby!!!");
      } else {
        reject("Failed to bake :(");
      }
    }, 3000);
  });
};

const bakeChocolateBrownies = async () => {
  try {
    const task1 = await preHeatOven();
    console.log(task1);
    const task2 = await addSugar();
    console.log(task2);
    const task3 = await addFlour();
    console.log(task3);
    const task4 = await bakeMixture();
    console.log(task4);
  } catch (error) {
    console.log(error);
  }
};
bakeChocolateBrownies();
 */

// Fetch, the FETCH API returns a Promise

const API_URL = "https://dummyjson.com/products";
const POST_API_URL = "https://dummyjson.com/products/add";
const POST_EXAMPLE = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    description: "iphone 19",
    price: 1000,
    rating: "9/10",
  }),
};

/* 
fetch(API_URL)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log(error));

fetch(POST_API_URL, POST_EXAMPLE)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log(error));

fetch(API_URL)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log(error)); 
*/

// FETCH with ASYNC/AWAIT

const getAllProducts = async () => {
  try {
    const response = await fetch(API_URL);
    const jsonRes = await response.json();
    console.log(jsonRes);
  } catch (error) {
    console.log(error);
  }
};
getAllProducts();
