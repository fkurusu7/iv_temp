import { connect, connection } from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_DB_CONNECTION) {
      throw new Error(
        "MongoDB connection string is not defined in environment variables"
      );
    }
    await connect(process.env.MONGO_DB_CONNECTION, {
      autoIndex: true,
    });
    console.log("MongoDB connection was successful");

    // Connection States
    connection.on("connected", () => console.log("Mongoose connected to DB"));
    connection.on("error", (err) =>
      console.log("Mongoose connection error", err)
    );
    connection.on("diconnected", () =>
      console.log("Mongoose connection disconnected")
    );

    // Handle application termination
    process.on("SIGINT", async () => {
      try {
        await connection.close();
        console.log("Mongoose connection closed through app termination");
        process.exit(0);
      } catch (err) {
        console.log("Error closing Mongoose connection:", err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
