const express = require("express");
const loggerMiddleWare = require("morgan");
const corsMiddleWare = require("cors");
const { PORT } = require("./config/constants");
const authRouter = require("./routers/auth");
const searchRecipesRouter = require("./routers/searchRecipes");
const analyseRouter = require("./routers/analyse");

const app = express();
app.use(loggerMiddleWare("dev"));
app.use(corsMiddleWare());

const bodyParserMiddleWare = express.json();
app.use(bodyParserMiddleWare);

app.use("/", authRouter);
app.use("/recipes", searchRecipesRouter);
app.use("/analyse", analyseRouter);

// Listen for connections on specified port (default is port 4000)

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
