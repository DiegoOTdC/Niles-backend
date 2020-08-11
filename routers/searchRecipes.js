const { Router } = require("express");
const { analyseImage } = require("../index");
const { searchEdamam } = require("../index");
const router = new Router();

router.get("/", async (req, res, next) => {
  const image = "../utils/oreo.jpg";
  try {
    const imageLabel = await analyseImage(image);
    const recipes = await searchEdamam(imageLabel);
    res.send(recipes);
    console.log("recipes in route", recipes);
  } catch (e) {
    res.status(400).send({ message: "Sorry! Something went wrong" });
    next(e);
  }
});

module.exports = router;
