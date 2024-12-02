const express = require("express");
const router = express.Router();
const {
  getWorkouts,
  getWorkout,
  createWorkout,
} = require("../controllers/workoutController");

// GET all workouts
router.get("/", getWorkouts);

// GET Single workout
router.get("/:id", getWorkout);

// POST a New Workout
router.post("/", createWorkout);

// DELETE a Workout
router.delete("/:id", (req, res) => {
  return res.json({ message: "DELETE WO" });
});

// UPDATE a Workout
router.patch("/:id", (req, res) => {
  console.log(req.body);
  return res.json({ message: "UPDATE WO" });
});

module.exports = router;
