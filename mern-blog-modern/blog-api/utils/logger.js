import chalk from "chalk";
import morgan from "morgan";

// Create custom morgan tokens
morgan.token("body", (req) => {
  if (req.body.hasOwnProperty("password")) {
    const { password, ...rest } = req.body;
    req.body = rest;
  }
  return JSON.stringify(req.body);
});
morgan.token("resBody", (req, res) => res.__body);

export const logger = {
  success: (msg) => console.log(chalk.green("✅"), chalk.bold.cyan(msg)),
  error: (msg, err) =>
    console.error(chalk.red("❌"), chalk.bold.red(msg), chalk.red(err || "")),
  info: (msg) => console.log(chalk.blue("💭"), chalk.bold.blue(msg)),
  server: (port) => {
    console.log("\n" + chalk.bold.yellow("🚀 Server Status:"));
    console.log(chalk.cyan(`   ↪ Running on port ${chalk.bold.white(port)}`));
    console.log(
      chalk.cyan(
        `   ↪ Environment: ${chalk.bold.white(
          process.env.NODE_ENV || "development"
        )}`
      )
    );
    console.log(
      chalk.cyan(
        `   ↪ Time: ${chalk.bold.white(new Date().toLocaleString())}\n`
      )
    );
  },
  // Request/Response logger middleware
  requestLogger: morgan((tokens, req, res) => {
    return [
      chalk.bold("\n🔸 Request:"),
      chalk.blue(tokens.method(req, res)),
      chalk.blue(tokens.url(req, res)),
      chalk.yellow("\nBody:"),
      tokens.body(req, res),
      chalk.bold("\n🔹 Response:"),
      chalk.green(`Status: ${tokens.status(req, res)}`),
      chalk.yellow("\nBody:"),
      tokens.resBody(req, res),
      chalk.gray("\nTime:"),
      `${tokens["response-time"](req, res)}ms`,
      "\n",
    ].join(" ");
  }),
  // Capture response body middleware
  responseCapture: (req, res, next) => {
    // Store the original res.send method
    const originalSend = res.send;
    // Override res.send with our custom version
    res.send = function (body) {
      // Store the response body in a custom property
      res.__body = body;
      // Call the original send method with the same context and body
      return originalSend.call(this, body);
    };
    next();
  },
};

/** responseCapture????
  This is doing something called "method wrapping" or "monkey patching" and here's why it's needed:

  Morgan (and our logger) needs to access the response body to log it
  By default, Express doesn't store the response body where middleware can access it
  This middleware intercepts the res.send method before it happens by:

  Saving the original res.send method
  Creating a new version that stores the body in res.__body
  Still calling the original method so everything works normally



  So when your route does res.send(someData), this middleware ensures that someData is available at res.__body for the logger to access it later.
  It's like having someone write down a copy of a letter before it's sent in the mail - the letter still gets sent, but now we have a record of what was in it.
 */
