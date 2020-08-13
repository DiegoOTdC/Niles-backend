const { Router } = require("express");
const { analyseImage } = require("../utils/");
const { searchEdamam } = require("../utils");
const router = new Router();

router.post("/", async (req, res, next) => {
  const imageUri = req.body.imageUri;
  console.log("imageUrl", imageUri);
  try {
    const imageLabel = await analyseImage(imageUri);

    if (imageLabel) {
      const recipes = await searchEdamam(imageLabel);
      console.log("recipes in route", recipes);
      res.send({ recipes: recipes });
    }
  } catch (e) {
    res.status(400).send({ message: "Sorry! Something went wrong" });
    next(e);
  }
});

module.exports = router;
