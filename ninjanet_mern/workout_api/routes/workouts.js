const express = require("express");
const router = express.Router();
const {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
} = require("../controllers/workoutController");

// GET all workouts
router.get("/", getWorkouts);

// GET Single workout
router.get("/:id", getWorkout);

// POST a New Workout
router.post("/", createWorkout);

// DELETE a Workout
router.delete("/:id", deleteWorkout);

// UPDATE a Workout
router.patch("/:id", updateWorkout);

module.exports = router;
