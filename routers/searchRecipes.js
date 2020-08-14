const { Router } = require("express");
const { searchEdamam } = require("../utils");
const router = new Router();

router.post("/", async (req, res, next) => {
  const foodLabel = req.body.foodLabel;
  try {
    const recipes = await searchEdamam(foodLabel);
    res.send({ recipes });
  } catch (e) {
    res.status(400).send({ message: "Sorry! Something went wrong" });
    next(e);
  }
});

module.exports = router;
