const { Router } = require("express");
const { analyseImage } = require("../utils/");
const router = new Router();

router.post("/", async (req, res, next) => {
  const imageUrl = req.body.imageUrl;
  try {
    const imageLabel = await analyseImage(imageUrl);
    res.send({ imageLabel });
  } catch (e) {
    res.status(400).send({ message: "Sorry! Something went wrong" });
    next(e);
  }
});

module.exports = router;
