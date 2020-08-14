const { Router } = require("express");
const { analyseImage } = require("../utils/");
const { searchEdamam } = require("../utils");
const router = new Router();

router.post("/", async (req, res, next) => {
  console.log("what is in the body now?", req.body);

  const imageUrl = req.body.imageUrl;

  console.log("imageUrl", imageUrl);
  try {
    const imageLabel = await analyseImage(imageUrl);

    if (imageLabel) {
      const recipes = await searchEdamam(imageLabel);
      console.log("recipes in route", recipes);
      res.send({ recipes, imageUrl });
    }
  } catch (e) {
    res.status(400).send({ message: "Sorry! Something went wrong" });
    next(e);
  }
});

module.exports = router;
